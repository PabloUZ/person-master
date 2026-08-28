import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { CreateLegalPersonDTO } from '../../dto/create-legal-person.dto';
import { CreateNaturalPersonDTO } from '../../dto/create-natural-person.dto';
import { QueryPersonDTO } from '../../dto/query-person.dto';
import { UpdateLegalPersonDTO } from '../../dto/update-legal-person.dto';
import { UpdateNaturalPersonDTO } from '../../dto/update-natural-person.dto';
import { IPerson } from '../../interfaces/person.interface';
import { IPaginatedResult } from '../../interfaces/person.repository.interface';
import { PersonRepository } from '../../repositories/person.repository';

@Injectable()
export class PersonService {
	constructor(private readonly personRepository: PersonRepository) {}

	async create(
		dto: CreateNaturalPersonDTO | CreateLegalPersonDTO,
	): Promise<IPerson> {
		return this.personRepository.create(dto);
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

		return this.persistUpdate(id, dto);
	}

	async update(
		id: string,
		dto: UpdateNaturalPersonDTO | UpdateLegalPersonDTO,
	): Promise<IPerson> {
		const existing = await this.findById(id);
		this.assertPersonTypeUnchanged(existing, dto.personType);

		return this.persistUpdate(id, dto);
	}

	async softDelete(id: string): Promise<IPerson> {
		await this.findById(id);

		const deactivated = await this.personRepository.softDelete(id);
		if (!deactivated) {
			throw new NotFoundException(`Person ${id} not found`);
		}
		return deactivated;
	}

	private assertPersonTypeUnchanged(
		existing: IPerson,
		requestedType: IPerson['personType'],
	): void {
		if (existing.personType !== requestedType) {
			throw new ConflictException(
				'personType cannot be changed once a person is created',
			);
		}
	}

	private async persistUpdate(
		id: string,
		data: Partial<IPerson>,
	): Promise<IPerson> {
		const updated = await this.personRepository.update(id, data);
		if (!updated) {
			throw new NotFoundException(`Person ${id} not found`);
		}
		return updated;
	}
}
