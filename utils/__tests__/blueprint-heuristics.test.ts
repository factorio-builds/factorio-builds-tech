import { IDecodedBlueprintData } from "../../types"
import { decodeBlueprint } from "../blueprint"
import { blueprintHeuristics } from "../blueprint-heuristics"
import {
  highThroughputTrainStationMock,
  markedInputModulesPurpleScienceMock,
  robotsSpeedModulesFactoryMock,
} from "./testdata/blueprintMocks"

describe("blueprint heuristics utils", () => {
  it("flags blueprint inputs as marked", () => {
    const decodedMarkedInputModulesPurpleScienceMock = decodeBlueprint(
      markedInputModulesPurpleScienceMock
    ) as IDecodedBlueprintData
    expect(
      blueprintHeuristics(decodedMarkedInputModulesPurpleScienceMock.blueprint)
    ).toEqual({
      withMarkedInputs: {
        value: true,
        confidence: 1,
      },
      isTrains: {
        value: false,
        confidence: 1,
      },
      withBeacons: {
        value: true, // this particular blueprint has beacons
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
      withMarkedInputs: {
        value: false,
        confidence: 1,
      },
      isTrains: {
        value: true,
        confidence: 1,
      },
      withBeacons: {
        value: false,
        confidence: 1,
      },
    })
  })

  it("flags blueprint with beacons", () => {
    const decodedRobotsSpeedModulesFactoryMock = decodeBlueprint(
      robotsSpeedModulesFactoryMock
    ) as IDecodedBlueprintData
    expect(
      blueprintHeuristics(decodedRobotsSpeedModulesFactoryMock.blueprint)
    ).toEqual({
      withMarkedInputs: {
        value: false,
        confidence: 1,
      },
      isTrains: {
        value: false,
        confidence: 1,
      },
      withBeacons: {
        value: true,
        confidence: 1,
      },
    })
  })
})
