import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMetadataNotification1721630420793 implements MigrationInterface {
    name = 'AddMetadataNotification1721630420793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "metadata" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "metadata"`);
    }

}
