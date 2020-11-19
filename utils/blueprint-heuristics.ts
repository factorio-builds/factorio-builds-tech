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
        return filter.signal.type
      })
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
    inputsAreMarked: inputsAreMarked(blueprint),
  }
}
