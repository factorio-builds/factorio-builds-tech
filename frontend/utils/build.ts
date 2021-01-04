import { Build } from "../db/entities/build.entity"
import { IBlueprint, IBlueprintIcon } from "../types"
import { IFullPayload } from "../types/models"
import { isBook as blueprintIsBook } from "./blueprint"

export function getIcons(blueprint: IBlueprint): IBlueprintIcon[]
export function getIcons(build: Build): IBlueprintIcon[]
export function getIcons(
  buildOrBlueprint: Build | IBlueprint
): IBlueprintIcon[] {
  const maybeBuild = buildOrBlueprint as Build
  if (maybeBuild.json !== undefined) {
    // TODO: use utils.build.isBook
    const icons = blueprintIsBook(maybeBuild.json)
      ? maybeBuild.json.blueprint_book.icons
      : maybeBuild.json.blueprint.icons

    return icons || []
  } else {
    const blueprint = buildOrBlueprint as IBlueprint

    return blueprint.icons || []
  }
}

export function isBook(payload: IFullPayload): boolean {
  return payload.type === "blueprint-book"
}

export function countEntities(
  entities?: IFullPayload["blueprint"]["entities"]
): number {
  if (!entities) {
    return 0
  }

  return Object.keys(entities).reduce((acc, curr) => {
    return acc + entities[curr]
  }, 0)
}
