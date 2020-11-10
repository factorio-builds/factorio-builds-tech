import { Repository } from "typeorm"
import { Build } from "../entities/build.entity"
import { ensureConnection } from "../index"

export async function BuildRepository(): Promise<Repository<Build>> {
  const connection = await ensureConnection()
  return connection!.getRepository(Build)
}
