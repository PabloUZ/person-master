import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { CreateLegalPersonDTO } from '../../dto/create-legal-person.dto';
import { CreateNaturalPersonDTO } from '../../dto/create-natural-person.dto';
import { QueryPersonDTO } from '../../dto/query-person.dto';
import { UpdateLegalPersonDTO } from '../../dto/update-legal-person.dto';
import { UpdateNaturalPersonDTO } from '../../dto/update-natural-person.dto';
import { LegalPersonDAO } from '../../dao/legal-person.dao';
import { NaturalPersonDAO } from '../../dao/natural-person.dao';
import { IPerson, PersonType } from '../../interfaces/person.interface';
import { PersonTypeValidationPipe } from '../../pipes/person-type-validation/person-type-validation.pipe';
import { PersonUpdateTypeValidationPipe } from '../../pipes/person-update-type-validation/person-update-type-validation.pipe';
import { PersonService } from '../../services/person/person.service';

@ApiTags('persons')
@Controller('persons')
export class PersonController {
	constructor(private readonly personService: PersonService) {}

	@Post()
	@ApiOperation({ summary: 'Create a natural or legal person' })
	async create(
		@Body(PersonTypeValidationPipe)
		dto: CreateNaturalPersonDTO | CreateLegalPersonDTO,
	) {
		const person = await this.personService.create(dto);
		return this.toDAO(person);
	}

	@Get()
	@ApiOperation({ summary: 'List persons (filters + pagination)' })
	async findAll(@Query() query: QueryPersonDTO) {
		const { items, total } = await this.personService.findAll(query);
		return {
			items: items.map((person) => this.toDAO(person)),
			total,
			page: query.page ?? 1,
			size: query.size ?? 10,
		};
	}

	@Get('document/:documentNumber')
	@ApiOperation({ summary: 'Get a person by document number' })
	async findByDocumentNumber(
		@Param('documentNumber') documentNumber: string,
	) {
		const person =
			await this.personService.findByDocumentNumber(documentNumber);
		return this.toDAO(person);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a person by id' })
	async findById(@Param('id', ParseUUIDPipe) id: string) {
		const person = await this.personService.findById(id);
		return this.toDAO(person);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Full update of a person' })
	async replace(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(PersonTypeValidationPipe)
		dto: CreateNaturalPersonDTO | CreateLegalPersonDTO,
	) {
		const person = await this.personService.replace(id, dto);
		return this.toDAO(person);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Partial update of a person' })
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(PersonUpdateTypeValidationPipe)
		dto: UpdateNaturalPersonDTO | UpdateLegalPersonDTO,
	) {
		const person = await this.personService.update(id, dto);
		return this.toDAO(person);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Soft delete a person (status = INACTIVE)' })
	async softDelete(@Param('id', ParseUUIDPipe) id: string) {
		const person = await this.personService.softDelete(id);
		return this.toDAO(person);
	}

	private toDAO(person: IPerson): NaturalPersonDAO | LegalPersonDAO {
		if (person.personType === PersonType.NATURAL) {
			return plainToInstance(NaturalPersonDAO, person, {
				excludeExtraneousValues: true,
			});
		}

		return plainToInstance(LegalPersonDAO, person, {
			excludeExtraneousValues: true,
		});
	}
}
