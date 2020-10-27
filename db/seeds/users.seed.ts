import { Connection } from "typeorm"
import { Factory, Seeder } from "typeorm-seeding"
import { User } from "../entities/user.entity"
import { users } from "./data/users"

export default class CreateUsers implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<void> {
    // await connection.query(`TRUNCATE table "User" CASCADE`)
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute()
  }
}
