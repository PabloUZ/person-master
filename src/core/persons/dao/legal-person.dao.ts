import { Expose } from 'class-transformer';

import { PersonType } from '../interfaces/person.interface';
import { BasePersonDAO } from './base-person.dao';

export class LegalPersonDAO extends BasePersonDAO {
	@Expose()
	personType!: PersonType.LEGAL;

	@Expose()
	companyName!: string | null;

	@Expose()
	tradeName!: string | null;

	@Expose()
	incorporationDate!: string | null;

	@Expose()
	legalRepresentativeId!: string | null;
}
