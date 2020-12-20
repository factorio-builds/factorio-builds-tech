import { Connection } from "typeorm"
import { Factory, Seeder } from "typeorm-seeding"
import { Build } from "../entities/build.entity"
import { generateBuilds } from "./data/builds"

export default class CreateBuilds implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<void> {
    const builds = await generateBuilds()
    await connection
      .createQueryBuilder()
      .insert()
      .into(Build)
      .values(builds)
      .execute()
  }
}
