import { Repository } from "typeorm"
import { User } from "../entities/user.entity"
import { ensureConnection } from "../index"

export async function UserRepository(): Promise<Repository<User>> {
  const connection = await ensureConnection()
  return connection!.getRepository(User)
}
