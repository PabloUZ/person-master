import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Person } from '../entities/person.entity';
import {
	DocumentType,
	IPerson,
	PersonStatus,
} from '../interfaces/person.interface';
import {
	IDuplicateCandidateCriteria,
	IPaginatedResult,
	IPersonListFilters,
	IPersonRepository,
} from '../interfaces/person.repository.interface';
import { DuplicateDocumentNumberError } from './duplicate-document-number.error';
import { InvalidLegalRepresentativeError } from './invalid-legal-representative.error';

const MYSQL_DUPLICATE_ENTRY_CODE = 'ER_DUP_ENTRY';
const MYSQL_FK_VIOLATION_CODES = ['ER_NO_REFERENCED_ROW_2', 'ER_NO_REFERENCED_ROW'];

@Injectable()
export class PersonRepository implements IPersonRepository {
	private readonly logger = new Logger(PersonRepository.name);

	constructor(
		@InjectRepository(Person)
		private readonly repo: Repository<Person>,
	) {}

	async findById(id: string): Promise<IPerson | null> {
		return this.repo.findOne({ where: { id } });
	}

	async findByDocumentNumber(
		documentNumber: string,
	): Promise<IPerson | null> {
		return this.repo.findOne({ where: { documentNumber } });
	}

	async findByDocumentTypeAndNumber(
		documentType: DocumentType,
		documentNumber: string,
	): Promise<IPerson | null> {
		return this.repo.findOne({ where: { documentType, documentNumber } });
	}

	async findCandidatesForDuplicateCheck({
		firstName,
		lastName,
		email,
		phone,
	}: IDuplicateCandidateCriteria): Promise<IPerson[]> {
		const query = this.repo.createQueryBuilder('person').where('1 = 0');

		if (firstName && lastName) {
			query.orWhere(
				'UPPER(person.firstName) = UPPER(:firstName) AND UPPER(person.lastName) = UPPER(:lastName)',
				{ firstName, lastName },
			);
		}

		if (email) {
			query.orWhere('LOWER(person.email) = LOWER(:email)', { email });
		}

		if (phone) {
			query.orWhere('person.phone = :phone', { phone });
		}

		return query.getMany();
	}

	async findAll(
		filters: IPersonListFilters,
		page: number,
		size: number,
	): Promise<IPaginatedResult<IPerson>> {
		const [items, total] = await this.repo.findAndCount({
			where: {
				...(filters.personType && { personType: filters.personType }),
				...(filters.status && { status: filters.status }),
				...(filters.city && { city: filters.city }),
				...(filters.country && { country: filters.country }),
			},
			skip: (page - 1) * size,
			take: size,
		});

		return { items, total };
	}

	async create(data: Partial<IPerson>): Promise<IPerson> {
		const person = this.repo.create(data);
		try {
			return await this.repo.save(person);
		} catch (error) {
			throw this.translateDatabaseError(error, data);
		}
	}

	async update(id: string, data: Partial<IPerson>): Promise<IPerson | null> {
		try {
			await this.repo.update(id, data);
		} catch (error) {
			throw this.translateDatabaseError(error, data);
		}
		return this.findById(id);
	}

	async softDelete(id: string): Promise<IPerson | null> {
		await this.repo.update(id, { status: PersonStatus.INACTIVE });
		return this.findById(id);
	}

	private translateDatabaseError(
		error: unknown,
		data: Partial<IPerson>,
	): unknown {
		if (!(error instanceof QueryFailedError)) {
			return error;
		}

		const code = (error as QueryFailedError & { code?: string }).code;

		if (code === MYSQL_DUPLICATE_ENTRY_CODE && data.documentNumber) {
			this.logger.warn(
				`Unique constraint hit on documentNumber=${data.documentNumber}`,
			);
			return new DuplicateDocumentNumberError(data.documentNumber);
		}

		if (
			code &&
			MYSQL_FK_VIOLATION_CODES.includes(code) &&
			data.legalRepresentativeId
		) {
			this.logger.warn(
				`Invalid legalRepresentativeId reference: ${data.legalRepresentativeId}`,
			);
			return new InvalidLegalRepresentativeError(data.legalRepresentativeId);
		}

		return error;
	}
}
