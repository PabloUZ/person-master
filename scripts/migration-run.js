import { spawnSync } from 'child_process';

console.log('Running migrations with:');
console.log('DB host:', process.env.DB_HOST);
console.log('DB name:', process.env.DB_NAME);

try {
	if (process.env.NODE_ENV === 'dev') {
		const result = spawnSync(
			'npx',
			[
				'typeorm-ts-node-commonjs',
				'migration:run',
				'-d',
				'src/config/database/datasource.ts',
			],
			{ stdio: 'inherit' },
		);
		if (result.error) {
			throw result.error;
		}
	} else if (process.env.NODE_ENV === 'prod') {
		const result = spawnSync(
			'typeorm',
			['migration:run', '-d', 'config/database/datasource.js'],
			{ stdio: 'inherit' },
		);
		if (result.error) {
			throw result.error;
		}
	}
} catch (error) {
	console.error('Error running migrations:', error.message);
	process.exit(1);
}
