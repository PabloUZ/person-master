import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Person } from './entities/person.entity';
import { PersonRepository } from './repositories/person.repository';
import { PersonService } from './services/person/person.service';
import { PersonController } from './controllers/person/person.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Person])],
	providers: [PersonRepository, PersonService],
	controllers: [PersonController],
})
export class PersonsModule {}
