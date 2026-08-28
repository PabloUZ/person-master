import {
	ConflictException,
	HttpStatus,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';

import { CreateLegalPersonDTO } from '../../dto/create-legal-person.dto';
import { CreateNaturalPersonDTO } from '../../dto/create-natural-person.dto';
import { QueryPersonDTO } from '../../dto/query-person.dto';
import { UpdateLegalPersonDTO } from '../../dto/update-legal-person.dto';
import { UpdateNaturalPersonDTO } from '../../dto/update-natural-person.dto';
import { IPerson } from '../../interfaces/person.interface';
import { IPaginatedResult } from '../../interfaces/person.repository.interface';
import { DuplicateDocumentNumberError } from '../../repositories/duplicate-document-number.error';
import { PersonRepository } from '../../repositories/person.repository';

@Injectable()
export class PersonService {
	private readonly logger = new Logger(PersonService.name);

	constructor(private readonly personRepository: PersonRepository) {}

	async create(
		dto: CreateNaturalPersonDTO | CreateLegalPersonDTO,
	): Promise<IPerson> {
		const existing = await this.personRepository.findByDocumentTypeAndNumber(
			dto.documentType,
			dto.documentNumber,
		);
		if (existing) {
			this.logger.warn(
				`Exact duplicate rejected: documentType=${dto.documentType} documentNumber=${dto.documentNumber} existingId=${existing.id}`,
			);
			this.throwExactDuplicate(existing);
		}

		let person: IPerson;
		try {
			person = await this.personRepository.create(dto);
		} catch (error) {
			await this.handleDuplicateDocumentNumberError(error);
			throw error;
		}

		this.logger.log(
			`Person created: id=${person.id} personType=${person.personType}`,
		);
		return person;
	}

	async findAll(query: QueryPersonDTO): Promise<IPaginatedResult<IPerson>> {
		const page = query.page ?? 1;
		const size = query.size ?? 10;

		return this.personRepository.findAll(
			{
				personType: query.personType,
				status: query.status,
				city: query.city,
				country: query.country,
			},
			page,
			size,
		);
	}

	async findById(id: string): Promise<IPerson> {
		const person = await this.personRepository.findById(id);
		if (!person) {
			throw new NotFoundException(`Person ${id} not found`);
		}
		return person;
	}

	async findByDocumentNumber(documentNumber: string): Promise<IPerson> {
		const person =
			await this.personRepository.findByDocumentNumber(documentNumber);
		if (!person) {
			throw new NotFoundException(
				`Person with document number ${documentNumber} not found`,
			);
		}
		return person;
	}

	async replace(
		id: string,
		dto: CreateNaturalPersonDTO | CreateLegalPersonDTO,
	): Promise<IPerson> {
		const existing = await this.findById(id);
		this.assertPersonTypeUnchanged(existing, dto.personType);

		const person = await this.persistUpdate(id, dto);
		this.logger.log(`Person replaced: id=${id}`);
		return person;
	}

	async update(
		id: string,
		dto: UpdateNaturalPersonDTO | UpdateLegalPersonDTO,
	): Promise<IPerson> {
		const existing = await this.findById(id);
		this.assertPersonTypeUnchanged(existing, dto.personType);

		const person = await this.persistUpdate(id, dto);
		this.logger.log(`Person updated: id=${id}`);
		return person;
	}

	async softDelete(id: string): Promise<IPerson> {
		await this.findById(id);

		const deactivated = await this.personRepository.softDelete(id);
		if (!deactivated) {
			throw new NotFoundException(`Person ${id} not found`);
		}

		this.logger.log(`Person soft-deleted: id=${id}`);
		return deactivated;
	}

	private assertPersonTypeUnchanged(
		existing: IPerson,
		requestedType: IPerson['personType'],
	): void {
		if (existing.personType !== requestedType) {
			this.logger.warn(
				`Rejected personType change: id=${existing.id} from=${existing.personType} to=${requestedType}`,
			);
			throw new ConflictException(
				'personType cannot be changed once a person is created',
			);
		}
	}

	private async persistUpdate(
		id: string,
		data: Partial<IPerson>,
	): Promise<IPerson> {
		try {
			const updated = await this.personRepository.update(id, data);
			if (!updated) {
				throw new NotFoundException(`Person ${id} not found`);
			}
			return updated;
		} catch (error) {
			await this.handleDuplicateDocumentNumberError(error);
			throw error;
		}
	}

	private throwExactDuplicate(existing: IPerson): never {
		throw new ConflictException({
			status: HttpStatus.CONFLICT,
			error: 'EXACT_DUPLICATE',
			message:
				'A person with this document type and number is already registered.',
			existing_person: {
				id: existing.id,
				document_number: existing.documentNumber,
				first_name: existing.firstName,
				last_name: existing.lastName,
			},
		});
	}

	private async handleDuplicateDocumentNumberError(
		error: unknown,
	): Promise<void> {
		if (!(error instanceof DuplicateDocumentNumberError)) {
			return;
		}

		this.logger.warn(
			`Duplicate document number caught at write time: ${error.documentNumber}`,
		);

		const conflicting = await this.personRepository.findByDocumentNumber(
			error.documentNumber,
		);
		if (conflicting) {
			this.throwExactDuplicate(conflicting);
		}
	}
}
