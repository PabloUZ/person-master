import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

@Injectable()
export class PersonRepository implements IPersonRepository {
	constructor(
		@InjectRepository(Person)
		private readonly repo: Repository<Person>,
	) {}

	async findById(id: string): Promise<IPerson | null> {
		return this.repo.findOne({ where: { id } });
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
		return this.repo.save(person);
	}

	async update(id: string, data: Partial<IPerson>): Promise<IPerson | null> {
		await this.repo.update(id, data);
		return this.findById(id);
	}

	async softDelete(id: string): Promise<IPerson | null> {
		await this.repo.update(id, { status: PersonStatus.INACTIVE });
		return this.findById(id);
	}
}
