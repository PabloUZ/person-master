import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { EnvDto } from './envs.dto';

export const envConfig = registerAs('envConfig', () => {
	const envs = plainToInstance(EnvDto, process.env, {
		enableImplicitConversion: true,
		excludeExtraneousValues: true,
	});

	return {
		nodeEnv: envs.NODE_ENV,
		port: envs.PORT,
		database: {
			type: envs.DB_TYPE,
			host: envs.DB_HOST,
			port: envs.DB_PORT,
			user: envs.DB_USER,
			password: envs.DB_PASSWORD,
			name: envs.DB_NAME,
			synchronize: envs.DB_SYNCHRONIZE,
		},
	};
});
