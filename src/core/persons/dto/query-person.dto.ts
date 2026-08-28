import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { PersonStatus, PersonType } from '../interfaces/person.interface';

export class QueryPersonDTO {
	@ApiPropertyOptional({ enum: PersonType })
	@IsOptional()
	@IsEnum(PersonType)
	personType?: PersonType;

	@ApiPropertyOptional({ enum: PersonStatus })
	@IsOptional()
	@IsEnum(PersonStatus)
	status?: PersonStatus;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	city?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	country?: string;

	@ApiPropertyOptional({ default: 1, minimum: 1 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number = 1;

	@ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	size?: number = 10;
}
