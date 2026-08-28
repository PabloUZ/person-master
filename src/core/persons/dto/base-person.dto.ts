import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsDefined,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
} from 'class-validator';

import { DocumentType } from '../interfaces/person.interface';

export abstract class BasePersonDTO {
	@ApiProperty({ enum: DocumentType, example: DocumentType.CITIZEN_ID })
	@IsDefined()
	@IsEnum(DocumentType)
	documentType!: DocumentType;

	@ApiProperty({ example: '1094567890', minLength: 1, maxLength: 30 })
	@IsDefined()
	@IsString()
	@IsNotEmpty()
	@Length(1, 30)
	documentNumber!: string;

	@ApiProperty({ example: 'laura.gomez@email.com' })
	@IsDefined()
	@IsEmail()
	email!: string;

	@ApiPropertyOptional({ example: '3001234567', maxLength: 20 })
	@IsOptional()
	@IsString()
	@Length(1, 20)
	phone?: string;

	@ApiPropertyOptional({ maxLength: 200 })
	@IsOptional()
	@IsString()
	@Length(1, 200)
	address?: string;

	@ApiPropertyOptional({ maxLength: 50 })
	@IsOptional()
	@IsString()
	@Length(1, 50)
	city?: string;

	@ApiPropertyOptional({ default: 'CO', minLength: 2, maxLength: 3 })
	@IsOptional()
	@IsString()
	@Length(2, 3)
	country?: string;
}
