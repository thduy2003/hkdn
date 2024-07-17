import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendBaseEntity1721184119012 implements MigrationInterface {
    name = 'ExtendBaseEntity1721184119012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "base_entity" ("id" SERIAL NOT NULL, CONSTRAINT "PK_03e6c58047b7a4b3f6de0bfa8d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" DROP CONSTRAINT "PK_e6cc161417afe8c31099701543c"`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" ADD CONSTRAINT "PK_a4f4239424fb4df69a0c166e570" PRIMARY KEY ("class_id", "student_id", "id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_enrollment" DROP CONSTRAINT "PK_a4f4239424fb4df69a0c166e570"`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" ADD CONSTRAINT "PK_e6cc161417afe8c31099701543c" PRIMARY KEY ("class_id", "student_id")`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" DROP COLUMN "id"`);
        await queryRunner.query(`DROP TABLE "base_entity"`);
    }

}
