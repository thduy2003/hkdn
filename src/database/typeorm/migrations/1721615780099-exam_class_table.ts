import { MigrationInterface, QueryRunner } from "typeorm";

export class ExamClassTable1721615780099 implements MigrationInterface {
    name = 'ExamClassTable1721615780099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "class_exam" ("classesId" integer NOT NULL, "examsId" integer NOT NULL, CONSTRAINT "PK_97fc453c104a7eebc84ade4ccba" PRIMARY KEY ("classesId", "examsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_26c48805e5d44bdd0579f5688c" ON "class_exam" ("classesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_405b37c1c6ce7540187de6ca95" ON "class_exam" ("examsId") `);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD CONSTRAINT "FK_26c48805e5d44bdd0579f5688c0" FOREIGN KEY ("classesId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD CONSTRAINT "FK_405b37c1c6ce7540187de6ca95b" FOREIGN KEY ("examsId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_exam" DROP CONSTRAINT "FK_405b37c1c6ce7540187de6ca95b"`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP CONSTRAINT "FK_26c48805e5d44bdd0579f5688c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_405b37c1c6ce7540187de6ca95"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_26c48805e5d44bdd0579f5688c"`);
        await queryRunner.query(`DROP TABLE "class_exam"`);
    }

}
