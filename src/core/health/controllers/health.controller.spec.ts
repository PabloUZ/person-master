import { ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('../../../config/env/envs.type', () => ({
	envConfig: {
		KEY: 'envConfig',
	},
}));

import { envConfig } from '../../../config/env/envs.type';
import { HealthService } from '../services/health.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
	let controller: HealthController;
	let healthService: { isDatabaseReady: jest.Mock };

	beforeEach(async () => {
		healthService = { isDatabaseReady: jest.fn() };

		const module: TestingModule = await Test.createTestingModule({
			controllers: [HealthController],
			providers: [
				{ provide: HealthService, useValue: healthService },
				{ provide: envConfig.KEY, useValue: { version: '1.2.3' } },
			],
		}).compile();

		controller = module.get<HealthController>(HealthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('reports liveness without checking dependencies', () => {
		expect(controller.checkLiveness()).toEqual({ status: 'ok' });
	});

	it('reports readiness when the database is reachable', async () => {
		healthService.isDatabaseReady.mockResolvedValue(true);

		await expect(controller.checkReadiness()).resolves.toEqual({
			status: 'ok',
		});
	});

	it('throws 503 when the database is unreachable', async () => {
		healthService.isDatabaseReady.mockResolvedValue(false);

		await expect(controller.checkReadiness()).rejects.toBeInstanceOf(
			ServiceUnavailableException,
		);
	});

	it('returns the configured version', () => {
		expect(controller.getVersion()).toEqual({ version: '1.2.3' });
	});
});
