import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDb21721313531833 implements MigrationInterface {
    name = 'ChangeDb21721313531833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_results" DROP CONSTRAINT "FK_c1051dc605a1cd3a3060e717791"`);
        await queryRunner.query(`ALTER TABLE "exam_results" DROP COLUMN "class_enrollment_id"`);
        await queryRunner.query(`ALTER TABLE "exam_results" ADD "class_id" integer`);
        await queryRunner.query(`ALTER TABLE "exam_results" ADD "student_id" integer`);
        await queryRunner.query(`ALTER TABLE "exam_results" ADD CONSTRAINT "FK_92164be9660fdf81b1e73c9efa5" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam_results" ADD CONSTRAINT "FK_824b2bc6f305480dfff1fd9dcf4" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_results" DROP CONSTRAINT "FK_824b2bc6f305480dfff1fd9dcf4"`);
        await queryRunner.query(`ALTER TABLE "exam_results" DROP CONSTRAINT "FK_92164be9660fdf81b1e73c9efa5"`);
        await queryRunner.query(`ALTER TABLE "exam_results" DROP COLUMN "student_id"`);
        await queryRunner.query(`ALTER TABLE "exam_results" DROP COLUMN "class_id"`);
        await queryRunner.query(`ALTER TABLE "exam_results" ADD "class_enrollment_id" integer`);
        await queryRunner.query(`ALTER TABLE "exam_results" ADD CONSTRAINT "FK_c1051dc605a1cd3a3060e717791" FOREIGN KEY ("class_enrollment_id") REFERENCES "class_enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
