import { Test, TestingModule } from '@nestjs/testing';
import { PersonRepository } from '../../repositories/person.repository';
import { PersonService } from './person.service';

describe('PersonService', () => {
	let service: PersonService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PersonService,
				{
					provide: PersonRepository,
					useValue: {},
				},
			],
		}).compile();

		service = module.get<PersonService>(PersonService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
