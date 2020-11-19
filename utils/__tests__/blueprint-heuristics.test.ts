import { IDecodedBlueprintData } from "../../types"
import { decodeBlueprint } from "../blueprint"
import { blueprintHeuristics } from "../blueprint-heuristics"
import { markedInputModulesPurpleScienceMock } from "./testdata/blueprintMocks"

describe("blueprint heuristics utils", () => {
  it("returns true if inputs are marked", () => {
    const decodedMarkedInputModulesPurpleScienceMock = decodeBlueprint(
      markedInputModulesPurpleScienceMock
    ) as IDecodedBlueprintData
    expect(
      blueprintHeuristics(decodedMarkedInputModulesPurpleScienceMock.blueprint)
    ).toEqual({
      inputsAreMarked: {
        value: true,
        confidence: 1,
      },
    })
  })
})
