import { Build } from "../db/entities/build.entity"
import { IBlueprint, IBlueprintIcon } from "../types"
import { isBook } from "./blueprint"

export function getIcons(blueprint: IBlueprint): IBlueprintIcon[]
export function getIcons(build: Build): IBlueprintIcon[]
export function getIcons(
  buildOrBlueprint: Build | IBlueprint
): IBlueprintIcon[] {
  const maybeBuild = buildOrBlueprint as Build
  if (maybeBuild.json !== undefined) {
    const icons = isBook(maybeBuild.json)
      ? maybeBuild.json.blueprint_book.icons
      : maybeBuild.json.blueprint.icons

    return icons || []
  } else {
    const blueprint = buildOrBlueprint as IBlueprint

    return blueprint.icons || []
  }
}
