import { Repository } from "typeorm"
import { EntityRepository } from "typeorm"
import { Build } from "../entities/build.entity"
import { ensureConnection } from "../index"

@EntityRepository(Build)
class _BuildRepository extends Repository<Build> {
  async isOwnedBy(buildId: string, ownerId: string) {
    return this.findOne({ id: buildId, owner: { id: ownerId } }).then(Boolean)
  }

  async incrementViews(build: Build): Promise<boolean> {
    const updateResult = await this.update(
      { id: build.id },
      { views: build.views + 1 }
    )

    return Boolean(updateResult.affected)
  }
}

export async function BuildRepository(): Promise<_BuildRepository> {
  const connection = await ensureConnection()
  return connection!.getCustomRepository(_BuildRepository)
}
