import { Connection } from "typeorm"
import { Factory, Seeder } from "typeorm-seeding"
import { Build } from "../entities/build.entity"
import { builds } from "./data/builds"

export default class CreateBuilds implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<void> {
    // await connection.query(`TRUNCATE table "Build" CASCADE`)
    await connection
      .createQueryBuilder()
      .insert()
      .into(Build)
      .values(builds)
      .execute()
  }
}
