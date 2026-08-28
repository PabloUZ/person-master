import { IsEnum, IsNumber } from 'class-validator';
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
}
