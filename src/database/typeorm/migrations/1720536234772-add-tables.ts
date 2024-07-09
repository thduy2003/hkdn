import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTables1720536234772 implements MigrationInterface {
  name = 'AddTables1720536234772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "class_enrollment" ("classId" integer NOT NULL, "userId" integer NOT NULL, "enrollment_date" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "class_id" integer, "student_id" integer, CONSTRAINT "PK_63aacdbb0bef029e4cb1187bc1c" PRIMARY KEY ("classId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exams" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "type" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_b43159ee3efa440952794b4f53e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feedbacks" ("id" SERIAL NOT NULL, "content" text NOT NULL, "type" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "exam_result_id" integer, "student_id" integer, CONSTRAINT "PK_79affc530fdd838a9f1e0cc30be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exam_results" ("id" SERIAL NOT NULL, "result" numeric(6,2) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "exam_id" integer, "class_id" integer, "student_id" integer, CONSTRAINT "PK_07d4ea139ed7ca111c75df2de12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "classes" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "teacher_id" integer, "course_id" integer, CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_enrollment" ADD CONSTRAINT "FK_5ffc9d9e53f2e39c60d563d6a20" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_enrollment" ADD CONSTRAINT "FK_012f3597b0b9addf5b5f2bbd6e5" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedbacks" ADD CONSTRAINT "FK_24de535ebdc1f32c5029a6eb01b" FOREIGN KEY ("exam_result_id") REFERENCES "exam_results"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedbacks" ADD CONSTRAINT "FK_1ab5b5c2f8e75c2a5ba5ee42e59" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_results" ADD CONSTRAINT "FK_587fe839f813c89f1a4ce0610f0" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_results" ADD CONSTRAINT "FK_92164be9660fdf81b1e73c9efa5" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_results" ADD CONSTRAINT "FK_824b2bc6f305480dfff1fd9dcf4" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" ADD CONSTRAINT "FK_b34c92e413c4debb6e0f23fed46" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" ADD CONSTRAINT "FK_bd4c6c725acd427f07264770ceb" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "classes" DROP CONSTRAINT "FK_bd4c6c725acd427f07264770ceb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" DROP CONSTRAINT "FK_b34c92e413c4debb6e0f23fed46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_results" DROP CONSTRAINT "FK_824b2bc6f305480dfff1fd9dcf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_results" DROP CONSTRAINT "FK_92164be9660fdf81b1e73c9efa5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_results" DROP CONSTRAINT "FK_587fe839f813c89f1a4ce0610f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_1ab5b5c2f8e75c2a5ba5ee42e59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_24de535ebdc1f32c5029a6eb01b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_enrollment" DROP CONSTRAINT "FK_012f3597b0b9addf5b5f2bbd6e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_enrollment" DROP CONSTRAINT "FK_5ffc9d9e53f2e39c60d563d6a20"`,
    );
    await queryRunner.query(`DROP TABLE "classes"`);
    await queryRunner.query(`DROP TABLE "exam_results"`);
    await queryRunner.query(`DROP TABLE "feedbacks"`);
    await queryRunner.query(`DROP TABLE "exams"`);
    await queryRunner.query(`DROP TABLE "class_enrollment"`);
    await queryRunner.query(`DROP TABLE "courses"`);
  }
}
