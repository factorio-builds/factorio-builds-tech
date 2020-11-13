import { Repository } from "typeorm"
import { EntityRepository } from "typeorm"
import { Build } from "../entities/build.entity"
import { ensureConnection } from "../index"

@EntityRepository(Build)
class _BuildRepository extends Repository<Build> {
  async isOwnedBy(buildId: string, ownerId: string) {
    return this.findOne({ id: buildId, owner: { id: ownerId } }).then(Boolean)
  }
}

export async function BuildRepository(): Promise<_BuildRepository> {
  const connection = await ensureConnection()
  return connection!.getCustomRepository(_BuildRepository)
}
