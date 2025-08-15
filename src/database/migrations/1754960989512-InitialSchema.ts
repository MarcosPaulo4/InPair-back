import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1754960989512 implements MigrationInterface {
  name = 'InitialSchema1754960989512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "surname" character varying NOT NULL,"email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."connection_status_enum" AS ENUM('pending', 'accepted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "connection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "requester_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "status" "public"."connection_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_be611ce8b8cf439091c82a334b2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "connection" ADD CONSTRAINT "FK_c2db65e64362b0a7ec80cc1718c" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "connection" ADD CONSTRAINT "FK_b11eab386932ee8179304c8b38c" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "connection" DROP CONSTRAINT "FK_b11eab386932ee8179304c8b38c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "connection" DROP CONSTRAINT "FK_c2db65e64362b0a7ec80cc1718c"`,
    );
    await queryRunner.query(`DROP TABLE "connection"`);
    await queryRunner.query(`DROP TYPE "public"."connection_status_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
