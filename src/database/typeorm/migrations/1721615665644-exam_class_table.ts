import { MigrationInterface, QueryRunner } from "typeorm";

export class ExamClassTable1721615665644 implements MigrationInterface {
    name = 'ExamClassTable1721615665644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "classes_exams_exams" ("classesId" integer NOT NULL, "examsId" integer NOT NULL, CONSTRAINT "PK_815276242bcfead0eb4f2f37264" PRIMARY KEY ("classesId", "examsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4efc25f4dde80e484a01c6637c" ON "classes_exams_exams" ("classesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6f5c7d8e59f885940bb9824898" ON "classes_exams_exams" ("examsId") `);
        await queryRunner.query(`ALTER TABLE "classes_exams_exams" ADD CONSTRAINT "FK_4efc25f4dde80e484a01c6637c2" FOREIGN KEY ("classesId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "classes_exams_exams" ADD CONSTRAINT "FK_6f5c7d8e59f885940bb9824898b" FOREIGN KEY ("examsId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classes_exams_exams" DROP CONSTRAINT "FK_6f5c7d8e59f885940bb9824898b"`);
        await queryRunner.query(`ALTER TABLE "classes_exams_exams" DROP CONSTRAINT "FK_4efc25f4dde80e484a01c6637c2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6f5c7d8e59f885940bb9824898"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4efc25f4dde80e484a01c6637c"`);
        await queryRunner.query(`DROP TABLE "classes_exams_exams"`);
    }

}
