export class DuplicateDocumentNumberError extends Error {
	constructor(public readonly documentNumber: string) {
		super(`A person with document number ${documentNumber} already exists`);
		this.name = 'DuplicateDocumentNumberError';
	}
}
