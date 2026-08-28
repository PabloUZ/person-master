import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({ whitelist: true, transform: true }),
	);

	app.setGlobalPrefix('api');
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	});

	const swaggerConfig = new DocumentBuilder()
		.setTitle('Person Service API')
		.setDescription('Master of Persons CRUD API')
		.setVersion('1.0.0')
		.addTag('persons')
		.build();
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api', app, swaggerDocument, {
		swaggerOptions: {
			supportedSubmitMethods: [],
		},
	});

	await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
