import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvDto } from './envs.dto';

export const validate = (config: Record<string, unknown>) => {
	const envs = plainToInstance(EnvDto, config, {
		enableImplicitConversion: true,
	});

	const errors = validateSync(envs, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		const errorMessages = errors.toString();
		throw new Error(
			`Environment variables validation failed: ${errorMessages}`,
		);
	}
	return envs;
};
