import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from '../../services/person/person.service';
import { PersonController } from './person.controller';

describe('PersonController', () => {
	let controller: PersonController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PersonController],
			providers: [
				{
					provide: PersonService,
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<PersonController>(PersonController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
