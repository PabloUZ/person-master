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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { CreateLegalPersonDTO } from '../../dto/create-legal-person.dto';
import { CreateNaturalPersonDTO } from '../../dto/create-natural-person.dto';
import { QueryPersonDTO } from '../../dto/query-person.dto';
import { UpdateLegalPersonDTO } from '../../dto/update-legal-person.dto';
import { UpdateNaturalPersonDTO } from '../../dto/update-natural-person.dto';
import { LegalPersonDAO } from '../../dao/legal-person.dao';
import { NaturalPersonDAO } from '../../dao/natural-person.dao';
import { IPerson, PersonType } from '../../interfaces/person.interface';
import { PersonService } from '../../services/person/person.service';

@ApiTags('persons')
@Controller('persons')
export class PersonController {
	constructor(private readonly personService: PersonService) {}

	@Post('natural')
	@ApiOperation({ summary: 'Create a natural person' })
	@ApiBody({ type: CreateNaturalPersonDTO })
	async createNatural(@Body() dto: CreateNaturalPersonDTO) {
		const person = await this.personService.create(dto);
		return this.toDAO(person);
	}

	@Post('legal')
	@ApiOperation({ summary: 'Create a legal person' })
	@ApiBody({ type: CreateLegalPersonDTO })
	async createLegal(@Body() dto: CreateLegalPersonDTO) {
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

	@Put('natural/:id')
	@ApiOperation({ summary: 'Full update of a natural person' })
	@ApiBody({ type: CreateNaturalPersonDTO })
	async replaceNatural(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: CreateNaturalPersonDTO,
	) {
		const person = await this.personService.replace(id, dto);
		return this.toDAO(person);
	}

	@Put('legal/:id')
	@ApiOperation({ summary: 'Full update of a legal person' })
	@ApiBody({ type: CreateLegalPersonDTO })
	async replaceLegal(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: CreateLegalPersonDTO,
	) {
		const person = await this.personService.replace(id, dto);
		return this.toDAO(person);
	}

	@Patch('natural/:id')
	@ApiOperation({ summary: 'Partial update of a natural person' })
	@ApiBody({ type: UpdateNaturalPersonDTO })
	async updateNatural(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateNaturalPersonDTO,
	) {
		const person = await this.personService.update(id, dto);
		return this.toDAO(person);
	}

	@Patch('legal/:id')
	@ApiOperation({ summary: 'Partial update of a legal person' })
	@ApiBody({ type: UpdateLegalPersonDTO })
	async updateLegal(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateLegalPersonDTO,
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
