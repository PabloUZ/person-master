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
	};
});
