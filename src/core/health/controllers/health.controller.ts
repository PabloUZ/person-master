import {
	Controller,
	Get,
	Inject,
	ServiceUnavailableException,
	Version,
	VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ConfigType } from '@nestjs/config';

import { envConfig } from '../../../config/env/envs.type';
import { HealthService } from '../services/health.service';

@ApiExcludeController()
@Controller()
export class HealthController {
	constructor(
		private readonly healthService: HealthService,
		@Inject(envConfig.KEY)
		private readonly envs: ConfigType<typeof envConfig>,
	) {}

	@Version(VERSION_NEUTRAL)
	@Get('health')
	checkLiveness(): { status: string } {
		return { status: 'ok' };
	}

	@Version(VERSION_NEUTRAL)
	@Get('ready')
	async checkReadiness(): Promise<{ status: string }> {
		const isDatabaseReady = await this.healthService.isDatabaseReady();

		if (!isDatabaseReady) {
			throw new ServiceUnavailableException({ status: 'unavailable' });
		}

		return { status: 'ok' };
	}

	@Version(VERSION_NEUTRAL)
	@Get('version')
	getVersion(): { version: string } {
		return { version: this.envs.version };
	}
}
