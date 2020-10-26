import { MigrationInterface, QueryRunner } from "typeorm"

export class initial1603713822629 implements MigrationInterface {
  name = "initial1603713822629"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    await queryRunner.query(
      `CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "Build" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "blueprint" text NOT NULL, "description" text NOT NULL, "json" jsonb NOT NULL, "metadata" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_b24a0bfb6f30bdb48168a24a427" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "Build" ADD CONSTRAINT "FK_c7d4877eae3a530f79e4bbe0bbb" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Build" DROP CONSTRAINT "FK_c7d4877eae3a530f79e4bbe0bbb"`
    )
    await queryRunner.query(`DROP TABLE "Build"`)
    await queryRunner.query(`DROP TABLE "User"`)
  }
}
