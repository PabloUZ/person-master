import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateLegalPersonDTO } from '../../dto/create-legal-person.dto';
import { CreateNaturalPersonDTO } from '../../dto/create-natural-person.dto';
import { PersonType } from '../../interfaces/person.interface';

@Injectable()
export class PersonTypeValidationPipe implements PipeTransform {
	async transform(
		value: unknown,
	): Promise<CreateNaturalPersonDTO | CreateLegalPersonDTO> {
		if (typeof value !== 'object' || value === null) {
			throw new BadRequestException('Invalid request body');
		}

		const personType = (value as { personType?: PersonType }).personType;

		let instance: CreateNaturalPersonDTO | CreateLegalPersonDTO;

		if (personType === PersonType.NATURAL) {
			instance = plainToInstance(CreateNaturalPersonDTO, value);
		} else if (personType === PersonType.LEGAL) {
			instance = plainToInstance(CreateLegalPersonDTO, value);
		} else {
			throw new BadRequestException(
				`personType must be one of: ${PersonType.NATURAL}, ${PersonType.LEGAL}`,
			);
		}

		const errors = await validate(instance, {
			whitelist: true,
			forbidNonWhitelisted: true,
		});

		if (errors.length > 0) {
			throw new BadRequestException(errors);
		}

		return instance;
	}
}
