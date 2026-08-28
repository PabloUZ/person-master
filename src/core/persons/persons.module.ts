import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Person } from './entities/person.entity';
import { PersonRepository } from './repositories/person.repository';
import { PersonService } from './services/person/person.service';
import { PersonController } from './controllers/person/person.controller';
import { PersonTypeValidationPipe } from './pipes/person-type-validation/person-type-validation.pipe';
import { PersonUpdateTypeValidationPipe } from './pipes/person-update-type-validation/person-update-type-validation.pipe';

@Module({
	imports: [TypeOrmModule.forFeature([Person])],
	providers: [
		PersonRepository,
		PersonService,
		PersonTypeValidationPipe,
		PersonUpdateTypeValidationPipe,
	],
	controllers: [PersonController],
})
export class PersonsModule {}
