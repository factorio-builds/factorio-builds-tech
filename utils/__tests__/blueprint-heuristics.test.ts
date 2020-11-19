import { IDecodedBlueprintData } from "../../types"
import { decodeBlueprint } from "../blueprint"
import { blueprintHeuristics } from "../blueprint-heuristics"
import {
  highThroughputTrainStationMock,
  markedInputModulesPurpleScienceMock,
} from "./testdata/blueprintMocks"

describe("blueprint heuristics utils", () => {
  it("flags blueprint inputs as marked", () => {
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
      isTrains: {
        value: false,
        confidence: 1,
      },
    })
  })

  it("flags blueprint as trains", () => {
    const decodedHighThroughputTrainStationMock = decodeBlueprint(
      highThroughputTrainStationMock
    ) as IDecodedBlueprintData
    expect(
      blueprintHeuristics(decodedHighThroughputTrainStationMock.blueprint)
    ).toEqual({
      inputsAreMarked: {
        value: false,
        confidence: 1,
      },
      isTrains: {
        value: true,
        confidence: 1,
      },
    })
  })
})
