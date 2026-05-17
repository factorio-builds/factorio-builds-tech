import uniq from "lodash/uniq"
import { IBlueprint, IBlueprintBook, IBlueprintEntity } from "../types"
import { isBlueprintItem } from "./blueprint"

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

const EARLY_GAME_ENTITIES = [
  "assembling-machine-1",
  "steam-engine",
  "transport-belt",
]
const MID_GAME_ENTITIES = [
  "assembling-machine-2",
  "fast-transport-belt",
  "pumpjack",
]
const LATE_GAME_ENTITIES = [
  "assembling-machine-3",
  "nuclear-reactor",
  "beacon",
  "express-transport-belt",
]
const END_GAME_ENTITIES = ["rocket-silo"]

function parse(blueprint: IBlueprint): string[] {
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

  if (
    hasEntities(blueprint, EARLY_GAME_ENTITIES) &&
    !hasEntities(blueprint, [
      ...MID_GAME_ENTITIES,
      ...LATE_GAME_ENTITIES,
      ...END_GAME_ENTITIES,
    ])
  ) {
    tags.push("/state/early game")
  }

  if (
    hasEntities(blueprint, MID_GAME_ENTITIES) &&
    !hasEntities(blueprint, [...LATE_GAME_ENTITIES, ...END_GAME_ENTITIES])
  ) {
    tags.push("/state/mid game")
  }

  if (
    hasEntities(blueprint, LATE_GAME_ENTITIES) &&
    !hasEntities(blueprint, END_GAME_ENTITIES)
  ) {
    tags.push("/state/late game")
  }

  if (hasEntities(blueprint, END_GAME_ENTITIES)) {
    tags.push("/state/end game (megabase)")
  }

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

export function tagsFromHeuristics(
  blueprintOrBook: IBlueprint | IBlueprintBook
): string[] {
  if (blueprintOrBook.item === "blueprint") {
    const tags = parse(blueprintOrBook)

    return uniq(tags)
  }

  const tags = blueprintOrBook.blueprints
    .map((bp) => {
      if (!isBlueprintItem(bp)) {
        return []
      }
      return parse(bp.blueprint)
    })
    .reduce((acc, curr) => [...acc, ...curr], [])

  return uniq(tags)
}
