import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1755655105258 implements MigrationInterface {
    name = ' $npmConfigName1755655105258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "profileImgUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profileImgUrl"`);
    }

}
