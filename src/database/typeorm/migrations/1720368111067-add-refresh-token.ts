import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshToken1720368111067 implements MigrationInterface {
  name = 'AddRefreshToken1720368111067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "refresh_token" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token"`);
  }
}
