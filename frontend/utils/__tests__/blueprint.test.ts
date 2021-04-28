import { IDecodedBlueprintData } from "../../types"
import { decodeBlueprint, getCountPerItem, isBook, isValidBlueprint } from "../blueprint"
import {
  yellowBeltBlueprintMock,
  redBeltBlueprintMock,
  beltBookMock,
  robotsSpeedModulesFactoryMock,
} from "./testdata/blueprintMocks"

describe("blueprint utils", () => {
  it("returns true if it is a book", () => {
    const decodedBook = decodeBlueprint(beltBookMock)
    expect(isBook(decodedBook)).toEqual(true)
  })

  it("returns false if not a book", () => {
    const decodedYellowBeltBP = decodeBlueprint(yellowBeltBlueprintMock)
    const decodedRedBeltBP = decodeBlueprint(redBeltBlueprintMock)
    expect(isBook(decodedYellowBeltBP)).toEqual(false)
    expect(isBook(decodedRedBeltBP)).toEqual(false)
  })

  it("returns true on a valid blueprint", () => {
    expect(isValidBlueprint(yellowBeltBlueprintMock)).toEqual(true)
    expect(isValidBlueprint(redBeltBlueprintMock)).toEqual(true)
    expect(isValidBlueprint(beltBookMock)).toEqual(true)
  })

  it("returns false on an invalid blueprint", () => {
    expect(isValidBlueprint(beltBookMock.slice(1))).toEqual(false)
    expect(isValidBlueprint("asdf")).toEqual(false)
  })

  it("returns count of items", () => {
    const decodedRobotsSpeedModulesFactory = decodeBlueprint(robotsSpeedModulesFactoryMock) as IDecodedBlueprintData
    expect(getCountPerItem(decodedRobotsSpeedModulesFactory.blueprint)).toEqual({
      "assembling-machine-3": 18,
      beacon: 25,
      "fast-inserter": 36,
      "logistic-chest-buffer": 16,
      "logistic-chest-requester": 18,
      "steel-chest": 2,
      substation: 4,
    })
  })
})
