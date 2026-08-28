import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export enum Environments {
	PRODUCTION = 'prod',
	DEVELOPMENT = 'dev',
}

export class EnvDto {
	@Expose()
	@IsEnum(Environments)
	NODE_ENV!: Environments;

	@Expose()
	@IsNumber()
	PORT!: number;

	@Expose()
	@IsString()
	DB_TYPE!: string;

	@Expose()
	@IsString()
	DB_HOST!: string;

	@Expose()
	@IsNumber()
	DB_PORT!: number;

	@Expose()
	@IsString()
	DB_USER!: string;

	@Expose()
	@IsString()
	DB_PASSWORD!: string;

	@Expose()
	@IsString()
	DB_NAME!: string;

	@Expose()
	@IsBoolean()
	DB_SYNCHRONIZE!: boolean;
}
