import { spawnSync } from 'child_process';

if (process.env.NODE_ENV !== 'dev') {
	console.error('❌ This script can only be run in development environment');
	process.exit(1);
}

const name = process.argv[2];

if (!name) {
	console.error('❌ Migration name is required');
	process.exit(1);
}

try {
	const result = spawnSync(
		'npx',
		[
			'typeorm-ts-node-commonjs',
			'migration:generate',
			`src/migrations/${name}`,
			'-d',
			'src/config/database/datasource.ts',
		],
		{ stdio: 'inherit' },
	);

	if (result.error) {
		throw result.error;
	}

	const message = result.stderr?.toString() || '';

	if (message.includes('No changes in database schema were found')) {
		console.log('ℹ️ No schema changes detected. Migration not generated.');
		process.exit(0);
	}
} catch (err) {
	throw err;
}
