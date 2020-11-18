import { Repository } from "typeorm"
import { EntityRepository } from "typeorm"
import { ERole } from "../../types"
import { User } from "../entities/user.entity"
import { ensureConnection } from "../index"

@EntityRepository(User)
class _UserRepository extends Repository<User> {
  async isAdmin(userId: string) {
    return this.findOne({ id: userId, roleName: ERole.ADMIN }).then(Boolean)
  }
}

export async function UserRepository(): Promise<_UserRepository> {
  const connection = await ensureConnection()
  return connection!.getCustomRepository(_UserRepository)
}
