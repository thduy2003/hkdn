import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePrimaryColumn1721280904433 implements MigrationInterface {
    name = 'ChangePrimaryColumn1721280904433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_enrollment" DROP CONSTRAINT "FK_5ffc9d9e53f2e39c60d563d6a20"`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" DROP CONSTRAINT "FK_012f3597b0b9addf5b5f2bbd6e5"`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" DROP CONSTRAINT "PK_a4f4239424fb4df69a0c166e570"`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" ADD CONSTRAINT "PK_323d194d55fea23ce6d0a644b36" PRIMARY KEY ("student_id", "id")`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" DROP CONSTRAINT "PK_323d194d55fea23ce6d0a644b36"`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" ADD CONSTRAINT "PK_8d8d66920e0e20eefff0f9e8399" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" ADD CONSTRAINT "FK_5ffc9d9e53f2e39c60d563d6a20" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" ADD CONSTRAINT "FK_012f3597b0b9addf5b5f2bbd6e5" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_enrollment" DROP CONSTRAINT "FK_012f3597b0b9addf5b5f2bbd6e5"`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" DROP CONSTRAINT "FK_5ffc9d9e53f2e39c60d563d6a20"`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" DROP CONSTRAINT "PK_8d8d66920e0e20eefff0f9e8399"`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" ADD CONSTRAINT "PK_323d194d55fea23ce6d0a644b36" PRIMARY KEY ("student_id", "id")`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" DROP CONSTRAINT "PK_323d194d55fea23ce6d0a644b36"`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" ADD CONSTRAINT "PK_a4f4239424fb4df69a0c166e570" PRIMARY KEY ("class_id", "student_id", "id")`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" ADD CONSTRAINT "FK_012f3597b0b9addf5b5f2bbd6e5" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_enrollment" ADD CONSTRAINT "FK_5ffc9d9e53f2e39c60d563d6a20" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
