import { MigrationInterface, QueryRunner } from "typeorm";

export class ExamClassTable1721615933745 implements MigrationInterface {
    name = 'ExamClassTable1721615933745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_exam" DROP CONSTRAINT "FK_26c48805e5d44bdd0579f5688c0"`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP CONSTRAINT "FK_405b37c1c6ce7540187de6ca95b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_26c48805e5d44bdd0579f5688c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_405b37c1c6ce7540187de6ca95"`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP CONSTRAINT "PK_97fc453c104a7eebc84ade4ccba"`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD CONSTRAINT "PK_405b37c1c6ce7540187de6ca95b" PRIMARY KEY ("examsId")`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP COLUMN "classesId"`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP CONSTRAINT "PK_405b37c1c6ce7540187de6ca95b"`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP COLUMN "examsId"`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD "class_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD CONSTRAINT "PK_73e0c82e91ae914eb5fcc4f86d0" PRIMARY KEY ("class_id")`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD "exam_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP CONSTRAINT "PK_73e0c82e91ae914eb5fcc4f86d0"`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD CONSTRAINT "PK_73da3686cd88b59d0a7e10f24c7" PRIMARY KEY ("class_id", "exam_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_73e0c82e91ae914eb5fcc4f86d" ON "class_exam" ("class_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f7bc9b5b32b3674e3c75fbfaea" ON "class_exam" ("exam_id") `);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD CONSTRAINT "FK_73e0c82e91ae914eb5fcc4f86d0" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD CONSTRAINT "FK_f7bc9b5b32b3674e3c75fbfaeae" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_exam" DROP CONSTRAINT "FK_f7bc9b5b32b3674e3c75fbfaeae"`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP CONSTRAINT "FK_73e0c82e91ae914eb5fcc4f86d0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f7bc9b5b32b3674e3c75fbfaea"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_73e0c82e91ae914eb5fcc4f86d"`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP CONSTRAINT "PK_73da3686cd88b59d0a7e10f24c7"`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD CONSTRAINT "PK_73e0c82e91ae914eb5fcc4f86d0" PRIMARY KEY ("class_id")`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP COLUMN "exam_id"`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP CONSTRAINT "PK_73e0c82e91ae914eb5fcc4f86d0"`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP COLUMN "class_id"`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD "examsId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD CONSTRAINT "PK_405b37c1c6ce7540187de6ca95b" PRIMARY KEY ("examsId")`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD "classesId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "class_exam" DROP CONSTRAINT "PK_405b37c1c6ce7540187de6ca95b"`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD CONSTRAINT "PK_97fc453c104a7eebc84ade4ccba" PRIMARY KEY ("classesId", "examsId")`);
        await queryRunner.query(`CREATE INDEX "IDX_405b37c1c6ce7540187de6ca95" ON "class_exam" ("examsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_26c48805e5d44bdd0579f5688c" ON "class_exam" ("classesId") `);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD CONSTRAINT "FK_405b37c1c6ce7540187de6ca95b" FOREIGN KEY ("examsId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "class_exam" ADD CONSTRAINT "FK_26c48805e5d44bdd0579f5688c0" FOREIGN KEY ("classesId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
