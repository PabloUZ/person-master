import path from 'path';

import { DataSource } from 'typeorm';

const isTs = __filename.endsWith('.ts');

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 3306,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,

	entities: isTs
		? ['src/**/*.entity.ts']
		: [path.join(process.cwd(), 'dist/**/*.entity.js')],
	migrations: isTs
		? ['src/migrations/*.{ts, js}']
		: [path.join(process.cwd(), 'dist/migrations/*.js')],
});
