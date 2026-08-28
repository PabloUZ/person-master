import {
	IsBooleanString,
	IsDefined,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsString,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export enum Environments {
	PRODUCTION = 'prod',
	DEVELOPMENT = 'dev',
}

export class EnvDto {
	@Expose()
	@IsEnum(Environments)
	NODE_ENV!: Environments;

	@Expose()
	@IsDefined()
	@IsNotEmpty()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	PORT!: number;

	@Expose()
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	DB_TYPE!: string;

	@Expose()
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	DB_HOST!: string;

	@Expose()
	@IsDefined()
	@IsNotEmpty()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	DB_PORT!: number;

	@Expose()
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	DB_USER!: string;

	@Expose()
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	DB_PASSWORD!: string;

	@Expose()
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	DB_NAME!: string;

	@Expose()
	@IsDefined()
	@IsBooleanString()
	DB_SYNCHRONIZE!: 'true' | 'false';
}
