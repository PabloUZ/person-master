import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	Equals,
	IsDateString,
	IsDefined,
	IsEnum,
	IsIn,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
} from 'class-validator';

import {
	DocumentType,
	Gender,
	PersonType,
} from '../interfaces/person.interface';
import { BasePersonDTO } from './base-person.dto';

export class CreateNaturalPersonDTO extends BasePersonDTO {
	@ApiProperty({ enum: [PersonType.NATURAL], example: PersonType.NATURAL })
	@IsDefined()
	@Equals(PersonType.NATURAL)
	personType!: PersonType.NATURAL;

	@ApiProperty({
		enum: [
			DocumentType.CITIZEN_ID,
			DocumentType.FOREIGNER_ID,
			DocumentType.PASSPORT,
		],
		example: DocumentType.CITIZEN_ID,
	})
	@IsDefined()
	@IsIn([
		DocumentType.CITIZEN_ID,
		DocumentType.FOREIGNER_ID,
		DocumentType.PASSPORT,
	])
	documentType!: DocumentType;

	@ApiProperty({ example: 'Laura', maxLength: 50 })
	@IsDefined()
	@IsString()
	@IsNotEmpty()
	@Length(1, 50)
	firstName!: string;

	@ApiPropertyOptional({ maxLength: 50 })
	@IsOptional()
	@IsString()
	@Length(1, 50)
	middleName?: string;

	@ApiProperty({ example: 'Gomez', maxLength: 50 })
	@IsDefined()
	@IsString()
	@IsNotEmpty()
	@Length(1, 50)
	lastName!: string;

	@ApiPropertyOptional({ maxLength: 50 })
	@IsOptional()
	@IsString()
	@Length(1, 50)
	secondLastName?: string;

	@ApiProperty({ example: '1990-05-20' })
	@IsDefined()
	@IsDateString()
	birthDate!: string;

	@ApiPropertyOptional({ enum: Gender, example: Gender.FEMALE })
	@IsOptional()
	@IsEnum(Gender)
	gender?: Gender;
}
