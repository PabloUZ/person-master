import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Equals, IsDefined } from 'class-validator';

import { PersonType } from '../interfaces/person.interface';
import { CreateLegalPersonDTO } from './create-legal-person.dto';

export class UpdateLegalPersonDTO extends PartialType(CreateLegalPersonDTO) {
	@ApiProperty({ enum: [PersonType.LEGAL], example: PersonType.LEGAL })
	@IsDefined()
	@Equals(PersonType.LEGAL)
	personType!: PersonType.LEGAL;
}
