import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envConfig } from './config/env/envs.type';
import { validate } from './config/env/validate-envs';
import { PersonsModule } from './core/persons/persons.module';
import { CommonModule } from './core/common/common.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate,
			load: [envConfig],
		}),

		TypeOrmModule.forRootAsync({
			inject: [envConfig.KEY],
			useFactory: (envs: ConfigType<typeof envConfig>) =>
				({
					type: envs.database.type,
					host: envs.database.host,
					port: envs.database.port,
					username: envs.database.user,
					password: envs.database.password,
					database: envs.database.name,
					entities: [__dirname + '/../**/*.entity{.ts,.js}'],
					synchronize: envs.database.synchronize,
				}) as TypeOrmModuleOptions,
		}),

		PersonsModule,

		CommonModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
