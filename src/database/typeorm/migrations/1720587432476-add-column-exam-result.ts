import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnExamResult1720587432476 implements MigrationInterface {
  name = 'AddColumnExamResult1720587432476';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exam_results" ADD "deadline_feedback" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exam_results" DROP COLUMN "deadline_feedback"`,
    );
  }
}
