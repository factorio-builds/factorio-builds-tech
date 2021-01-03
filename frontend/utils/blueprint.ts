import pako from "pako"
import { TextDecoder } from "text-encoding"
import {
  IDecodedBlueprintData,
  IDecodedBlueprintBookData,
  IBlueprint,
} from "../types"

const utf8Decoder = new TextDecoder("utf-8")

export function isBook(
  decodedObject: IDecodedBlueprintData | IDecodedBlueprintBookData
): decodedObject is IDecodedBlueprintBookData {
  const book = decodedObject as IDecodedBlueprintBookData
  if (book.blueprint_book !== undefined) {
    return true
  }

  return false
}

// from https://github.com/BlooperDB/factorio-render
// we eventually want to import their lib, but it doesn't seem to build on Node 12
// will look at this later
export function decodeBlueprint(
  blueprintString: string
): IDecodedBlueprintData | IDecodedBlueprintBookData {
  const versionlessString = blueprintString.substr(1)
  const compressed = Buffer.from(versionlessString, "base64")
  const decodedObject = JSON.parse(
    utf8Decoder.decode(pako.inflate(compressed))
  ) as IDecodedBlueprintData | IDecodedBlueprintBookData

  return decodedObject
}

export function isValidBlueprint(blueprintString: string): boolean {
  try {
    decodeBlueprint(blueprintString)

    return true
  } catch {
    return false
  }
}

export function getCountPerItem(blueprint: IBlueprint): Record<string, number> {
  return blueprint.entities.reduce((acc, curr) => {
    const count = acc[curr.name] || 0
    return {
      ...acc,
      [curr.name]: count + 1,
    }
  }, {} as Record<string, number>)
}
