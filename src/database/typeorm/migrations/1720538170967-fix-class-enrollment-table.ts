import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixClassEnrollmentTable1720538170967
  implements MigrationInterface
{
  name = 'FixClassEnrollmentTable1720538170967';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "class_enrollment" ("class_id" integer NOT NULL, "student_id" integer NOT NULL, "enrollment_date" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_e6cc161417afe8c31099701543c" PRIMARY KEY ("class_id", "student_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_enrollment" ADD CONSTRAINT "FK_5ffc9d9e53f2e39c60d563d6a20" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_enrollment" ADD CONSTRAINT "FK_012f3597b0b9addf5b5f2bbd6e5" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "class_enrollment" DROP CONSTRAINT "FK_012f3597b0b9addf5b5f2bbd6e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_enrollment" DROP CONSTRAINT "FK_5ffc9d9e53f2e39c60d563d6a20"`,
    );
    await queryRunner.query(`DROP TABLE "class_enrollment"`);
  }
}
