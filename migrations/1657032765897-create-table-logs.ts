import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableLogs1657032765897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "log"."logs" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "ip" character varying, 
            "browser" character varying, 
            "user_id" uuid NOT NULL constraint logs_users_id_fk
                    references users.users,
            "url" character varying, 
            "query" character varying, 
            "body" character varying, 
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now()
            );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "log"."logs";`);
  }
}
