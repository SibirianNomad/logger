import { MigrationInterface, QueryRunner } from 'typeorm';

export class logSchema1657032555441 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('create schema log;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop schema log cascade;');
  }
}
