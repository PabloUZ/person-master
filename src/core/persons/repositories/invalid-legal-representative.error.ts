export class InvalidLegalRepresentativeError extends Error {
	constructor(public readonly legalRepresentativeId: string) {
		super(
			`legalRepresentativeId ${legalRepresentativeId} does not reference an existing person`,
		);
		this.name = 'InvalidLegalRepresentativeError';
	}
}
