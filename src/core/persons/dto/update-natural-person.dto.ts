import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Equals, IsDefined } from 'class-validator';

import { PersonType } from '../interfaces/person.interface';
import { CreateNaturalPersonDTO } from './create-natural-person.dto';

export class UpdateNaturalPersonDTO extends PartialType(
	CreateNaturalPersonDTO,
) {
	@ApiProperty({ enum: [PersonType.NATURAL], example: PersonType.NATURAL })
	@IsDefined()
	@Equals(PersonType.NATURAL)
	personType!: PersonType.NATURAL;
}
