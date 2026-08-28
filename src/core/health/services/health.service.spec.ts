import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';

import { HealthService } from './health.service';

describe('HealthService', () => {
	let service: HealthService;
	let dataSource: { query: jest.Mock };

	beforeEach(async () => {
		dataSource = { query: jest.fn() };

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				HealthService,
				{ provide: getDataSourceToken(), useValue: dataSource },
			],
		}).compile();

		service = module.get<HealthService>(HealthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('returns true when the database responds', async () => {
		dataSource.query.mockResolvedValue([{ 1: 1 }]);

		await expect(service.isDatabaseReady()).resolves.toBe(true);
	});

	it('returns false when the database query fails', async () => {
		dataSource.query.mockRejectedValue(new Error('connection refused'));

		await expect(service.isDatabaseReady()).resolves.toBe(false);
	});
});
