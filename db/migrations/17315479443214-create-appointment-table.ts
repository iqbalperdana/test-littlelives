import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppointmentTable17315479443214
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "appointment" (
                "id" BIGSERIAL PRIMARY KEY,
                "name" VARCHAR UNIQUE NOT NULL,
                "date" TIMESTAMP NOT NULL,
                "duration" INTEGER NOT NULL DEFAULT 30,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )    
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "appointment"`);
  }
}
