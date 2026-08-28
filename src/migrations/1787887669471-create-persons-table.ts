import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePersonsTable1787887669471 implements MigrationInterface {
    name = 'CreatePersonsTable1787887669471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`persons\` (\`id\` varchar(36) NOT NULL, \`personType\` enum ('NATURAL', 'LEGAL') NOT NULL, \`documentType\` enum ('CITIZEN_ID', 'FOREIGNER_ID', 'PASSPORT', 'TAX_ID') NOT NULL, \`documentNumber\` varchar(30) NOT NULL, \`firstName\` varchar(50) NULL, \`middleName\` varchar(50) NULL, \`lastName\` varchar(50) NULL, \`secondLastName\` varchar(50) NULL, \`birthDate\` date NULL, \`gender\` enum ('MALE', 'FEMALE') NULL, \`companyName\` varchar(150) NULL, \`tradeName\` varchar(150) NULL, \`incorporationDate\` date NULL, \`legalRepresentativeId\` varchar(255) NULL, \`email\` varchar(100) NOT NULL, \`phone\` varchar(20) NULL, \`address\` varchar(200) NULL, \`city\` varchar(50) NULL, \`country\` varchar(3) NOT NULL DEFAULT 'CO', \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`idx_persons_first_last_name\` (\`firstName\`, \`lastName\`), INDEX \`idx_persons_email\` (\`email\`), INDEX \`idx_persons_phone\` (\`phone\`), INDEX \`idx_persons_type\` (\`personType\`), UNIQUE INDEX \`IDX_a0c04f4e7d388a91117ca8daa9\` (\`documentNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`persons\` ADD CONSTRAINT \`FK_cf97bceff8f89803a0ed579ca6c\` FOREIGN KEY (\`legalRepresentativeId\`) REFERENCES \`persons\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`persons\` DROP FOREIGN KEY \`FK_cf97bceff8f89803a0ed579ca6c\``);
        await queryRunner.query(`DROP INDEX \`IDX_a0c04f4e7d388a91117ca8daa9\` ON \`persons\``);
        await queryRunner.query(`DROP INDEX \`idx_persons_type\` ON \`persons\``);
        await queryRunner.query(`DROP INDEX \`idx_persons_phone\` ON \`persons\``);
        await queryRunner.query(`DROP INDEX \`idx_persons_email\` ON \`persons\``);
        await queryRunner.query(`DROP INDEX \`idx_persons_first_last_name\` ON \`persons\``);
        await queryRunner.query(`DROP TABLE \`persons\``);
    }

}
