import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
	private readonly logger = new Logger(HealthService.name);

	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
	) {}

	async isDatabaseReady(): Promise<boolean> {
		try {
			await this.dataSource.query('SELECT 1');
			return true;
		} catch (error) {
			this.logger.error('Readiness check failed: database unreachable', error);
			return false;
		}
	}
}
