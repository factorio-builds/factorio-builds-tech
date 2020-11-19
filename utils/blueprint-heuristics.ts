import { IBlueprint } from "../types"

interface IComputedHeuristic {
  value: boolean
  confidence: number
}

type THeuristics = Record<string, IComputedHeuristic>

// TODO: could be improved to check that the combinator is right next to a belt facing it
// odds are 99% of cases, a combinator with an item indicates input
export function inputsAreMarked(blueprint: IBlueprint): IComputedHeuristic {
  const output = blueprint.entities.some((entity) => {
    return (
      entity.name === "constant-combinator" &&
      entity.control_behavior.filters.some((filter) => {
        return filter.signal.type === "item"
      })
    )
  })

  return {
    value: output,
    confidence: 1,
  }
}

// can blindly assume that anything with some sort of train piece can be flagged as train
// only exception are train cargos used as a box
function isTrains(blueprint: IBlueprint): IComputedHeuristic {
  const output = blueprint.entities.some((entity) => {
    return (
      entity.name === "straight-rail" ||
      entity.name === "curved-rail" ||
      entity.name === "train-stop" ||
      entity.name === "rail-signal" ||
      entity.name === "rail-chain-signal"
    )
  })

  return {
    value: output,
    confidence: 1,
  }
}

// TODO: review/observe performance over time
export function blueprintHeuristics(blueprint: IBlueprint): THeuristics {
  return {
    isTrains: isTrains(blueprint),
    inputsAreMarked: inputsAreMarked(blueprint),
  }
}
