import { IBlueprint, IBlueprintEntity } from "../types"

interface IComputedHeuristic {
  value: boolean
  confidence: number
}

function hasEntity(
  blueprint: IBlueprint,
  entityName: IBlueprintEntity["name"]
): boolean {
  if (!blueprint.entities) {
    return false
  }

  return blueprint.entities.some((entity) => {
    return entity.name === entityName
  })
}

function hasEntities(
  blueprint: IBlueprint,
  entityNames: IBlueprintEntity["name"][]
): boolean {
  if (!blueprint.entities) {
    return false
  }

  return blueprint.entities.some((entity) => {
    return entityNames.includes(entity.name)
  })
}

function hasAllEntities(
  blueprint: IBlueprint,
  entityNames: IBlueprintEntity["name"][]
): boolean {
  if (!blueprint.entities) {
    return false
  }

  return blueprint.entities.every((entity) => {
    return entityNames.includes(entity.name)
  })
}

function hasEntityWithRecipe(
  blueprint: IBlueprint,
  entityName: IBlueprintEntity["name"],
  recipe: IBlueprintEntity["recipe"]
): boolean {
  if (!blueprint.entities) {
    return false
  }

  return blueprint.entities.some((entity) => {
    return entity.name === entityName && entity.recipe === recipe
  })
}

// TODO: reimplement
// TODO: could be improved to check that the combinator is right next to a belt facing it
// odds are 99% of cases, a combinator with an item indicates input
export function withMarkedInputs(blueprint: IBlueprint): IComputedHeuristic {
  if (!blueprint.entities) {
    return {
      value: false,
      confidence: 1,
    }
  }

  const output = blueprint.entities.some((entity) => {
    return (
      entity.name === "constant-combinator" &&
      entity.control_behavior?.filters.some((filter) => {
        return filter.signal.type === "item"
      })
    )
  })

  return {
    value: output,
    confidence: 1,
  }
}

export function tagsFromHeuristics(blueprint: IBlueprint): string[] {
  const tags: string[] = []

  // Belt tags
  if (hasEntity(blueprint, "transport-belt")) {
    tags.push("/belt/transport belt (yellow)")
  }

  if (hasEntity(blueprint, "fast-transport-belt")) {
    tags.push("/belt/fast transport belt (red)")
  }

  if (hasEntity(blueprint, "express-transport-belt")) {
    tags.push("/belt/express transport belt (blue)")
  }

  // TODO: State tags

  // Meta tags
  if (hasEntity(blueprint, "beacon")) {
    tags.push("/meta/beaconized")
  }

  // Power tags
  if (hasAllEntities(blueprint, ["steam-engine", "boiler"])) {
    tags.push("/power/steam")
  }

  if (hasEntity(blueprint, "nuclear-reactor")) {
    tags.push("/power/nuclear")
  }

  if (
    hasEntityWithRecipe(blueprint, "centrifuge", "kovarex-enrichment-process")
  ) {
    tags.push("/power/kovarex enrichment")
  }

  if (hasAllEntities(blueprint, ["solar-panel", "accumulator"])) {
    tags.push("/power/solar")
  }

  // TODO: Production tags

  // TODO: More train tags
  if (
    hasEntities(blueprint, [
      "straight-rail",
      "curved-rail",
      "train-stop",
      "train-stop",
      "rail-chain-signal",
    ])
  ) {
    tags.push("/train/track")
  }

  return tags
}
