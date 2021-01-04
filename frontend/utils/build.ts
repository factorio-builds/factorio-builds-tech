import { Build } from "../db/entities/build.entity"
import { IBlueprint, IBlueprintIcon, IFullBuild } from "../types"
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

export function isBook(build: IFullBuild): boolean {
  return build.latest_version.payload.blueprint.type === "blueprint-book"
}
