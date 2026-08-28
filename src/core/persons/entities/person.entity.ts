import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Index,
} from 'typeorm';

import {
	IPerson,
	PersonType,
	DocumentType,
	PersonStatus,
	Gender,
} from '../interfaces/person.interface';

@Entity('persons')
@Index('idx_persons_type', ['personType'])
@Index('idx_persons_phone', ['phone'])
@Index('idx_persons_email', ['email'])
@Index('idx_persons_first_last_name', ['firstName', 'lastName'])
export class Person implements IPerson {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'enum', enum: PersonType })
	personType!: PersonType;

	@Column({ type: 'enum', enum: DocumentType })
	documentType!: DocumentType;

	@Column({ type: 'varchar', length: 30, unique: true })
	documentNumber!: string;

	@Column({ type: 'varchar', length: 50, nullable: true })
	firstName!: string | null;

	@Column({ type: 'varchar', length: 50, nullable: true })
	middleName!: string | null;

	@Column({ type: 'varchar', length: 50, nullable: true })
	lastName!: string | null;

	@Column({ type: 'varchar', length: 50, nullable: true })
	secondLastName!: string | null;

	@Column({ type: 'date', nullable: true })
	birthDate!: string | null;

	@Column({ type: 'enum', enum: Gender, nullable: true })
	gender!: Gender | null;

	@Column({ type: 'varchar', length: 150, nullable: true })
	companyName!: string | null;

	@Column({ type: 'varchar', length: 150, nullable: true })
	tradeName!: string | null;

	@Column({ type: 'date', nullable: true })
	incorporationDate!: string | null;

	@Column({ type: 'uuid', nullable: true })
	legalRepresentativeId!: string | null;

	@ManyToOne(() => Person, { nullable: true })
	@JoinColumn({ name: 'legalRepresentativeId' })
	legalRepresentative?: IPerson | null;

	@Column({ type: 'varchar', length: 100 })
	email!: string;

	@Column({ type: 'varchar', length: 20, nullable: true })
	phone!: string | null;

	@Column({ type: 'varchar', length: 200, nullable: true })
	address!: string | null;

	@Column({ type: 'varchar', length: 50, nullable: true })
	city!: string | null;

	@Column({ type: 'varchar', length: 3, default: 'CO' })
	country!: string;

	@Column({ type: 'enum', enum: PersonStatus, default: PersonStatus.ACTIVE })
	status!: PersonStatus;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt!: Date;
}
