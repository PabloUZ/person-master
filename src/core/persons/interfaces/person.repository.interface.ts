import { IPerson, PersonStatus, PersonType } from './person.interface';

export interface IDuplicateCandidateCriteria {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
}

export interface IPersonListFilters {
	personType?: PersonType;
	status?: PersonStatus;
	city?: string;
	country?: string;
}

export interface IPaginatedResult<T> {
	items: T[];
	total: number;
}

export interface IPersonRepository {
	findById(id: string): Promise<IPerson | null>;
	findByDocumentNumber(documentNumber: string): Promise<IPerson | null>;
	findByDocumentTypeAndNumber(
		documentType: string,
		documentNumber: string,
	): Promise<IPerson | null>;
	findCandidatesForDuplicateCheck(
		criteria: IDuplicateCandidateCriteria,
	): Promise<IPerson[]>;
	findAll(
		filters: IPersonListFilters,
		page: number,
		size: number,
	): Promise<IPaginatedResult<IPerson>>;
	create(data: Partial<IPerson>): Promise<IPerson>;
	update(id: string, data: Partial<IPerson>): Promise<IPerson | null>;
	softDelete(id: string): Promise<IPerson | null>;
}
