import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UpdateLegalPersonDTO } from '../../dto/update-legal-person.dto';
import { UpdateNaturalPersonDTO } from '../../dto/update-natural-person.dto';
import { PersonType } from '../../interfaces/person.interface';

@Injectable()
export class PersonUpdateTypeValidationPipe implements PipeTransform {
	async transform(
		value: unknown,
	): Promise<UpdateNaturalPersonDTO | UpdateLegalPersonDTO> {
		if (typeof value !== 'object' || value === null) {
			throw new BadRequestException('Invalid request body');
		}

		const personType = (value as { personType?: PersonType }).personType;

		let instance: UpdateNaturalPersonDTO | UpdateLegalPersonDTO;

		if (personType === PersonType.NATURAL) {
			instance = plainToInstance(UpdateNaturalPersonDTO, value);
		} else if (personType === PersonType.LEGAL) {
			instance = plainToInstance(UpdateLegalPersonDTO, value);
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
