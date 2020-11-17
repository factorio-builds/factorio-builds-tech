import { Connection } from "typeorm"
import { Factory, Seeder } from "typeorm-seeding"
import { Role } from "../entities/role.entity"
import { roles } from "./data/roles"

export default class CreateRoles implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(roles)
      .execute()
  }
}
