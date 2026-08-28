import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	Equals,
	IsDateString,
	IsDefined,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	Length,
} from 'class-validator';

import { PersonType } from '../interfaces/person.interface';
import { BasePersonDTO } from './base-person.dto';

export class CreateLegalPersonDTO extends BasePersonDTO {
	@ApiProperty({ enum: [PersonType.LEGAL], example: PersonType.LEGAL })
	@IsDefined()
	@Equals(PersonType.LEGAL)
	personType!: PersonType.LEGAL;

	@ApiProperty({ example: 'Acme Corp SAS', maxLength: 150 })
	@IsDefined()
	@IsString()
	@IsNotEmpty()
	@Length(1, 150)
	companyName!: string;

	@ApiPropertyOptional({ maxLength: 150 })
	@IsOptional()
	@IsString()
	@Length(1, 150)
	tradeName?: string;

	@ApiProperty({ example: '2015-03-01' })
	@IsDefined()
	@IsDateString()
	incorporationDate!: string;

	@ApiPropertyOptional({ format: 'uuid' })
	@IsOptional()
	@IsUUID()
	legalRepresentativeId?: string;
}
