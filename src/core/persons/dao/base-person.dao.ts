import { Expose } from 'class-transformer';

import { DocumentType, PersonStatus } from '../interfaces/person.interface';

export abstract class BasePersonDAO {
	@Expose()
	id!: string;

	@Expose()
	documentType!: DocumentType;

	@Expose()
	documentNumber!: string;

	@Expose()
	email!: string;

	@Expose()
	phone!: string | null;

	@Expose()
	address!: string | null;

	@Expose()
	city!: string | null;

	@Expose()
	country!: string;

	@Expose()
	status!: PersonStatus;

	@Expose()
	createdAt!: Date;

	@Expose()
	updatedAt!: Date;
}
