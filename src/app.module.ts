import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envConfig } from './config/env/envs.type';
import { validate } from './config/env/validate-envs';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate,
			load: [envConfig],
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
