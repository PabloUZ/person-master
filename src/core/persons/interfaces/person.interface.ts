export enum PersonType {
	NATURAL = 'NATURAL',
	LEGAL = 'LEGAL',
}

export enum DocumentType {
	CITIZEN_ID = 'CITIZEN_ID',
	FOREIGNER_ID = 'FOREIGNER_ID',
	PASSPORT = 'PASSPORT',
	TAX_ID = 'TAX_ID',
}

export enum PersonStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export enum Gender {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
}

export interface IPerson {
	id: string;
	personType: PersonType;
	documentType: DocumentType;
	documentNumber: string;

	firstName: string | null;
	middleName: string | null;
	lastName: string | null;
	secondLastName: string | null;
	birthDate: string | null;
	gender: Gender | null;

	companyName: string | null;
	tradeName: string | null;
	incorporationDate: string | null;
	legalRepresentativeId: string | null;

	email: string;
	phone: string | null;
	address: string | null;
	city: string | null;
	country: string;
	status: PersonStatus;

	createdAt: Date;
	updatedAt: Date;
}
