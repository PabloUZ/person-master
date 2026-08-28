import { Expose } from 'class-transformer';

import { Gender, PersonType } from '../interfaces/person.interface';
import { BasePersonDAO } from './base-person.dao';

export class NaturalPersonDAO extends BasePersonDAO {
	@Expose()
	personType!: PersonType.NATURAL;

	@Expose()
	firstName!: string | null;

	@Expose()
	middleName!: string | null;

	@Expose()
	lastName!: string | null;

	@Expose()
	secondLastName!: string | null;

	@Expose()
	birthDate!: string | null;

	@Expose()
	gender!: Gender | null;
}
