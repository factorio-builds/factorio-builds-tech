import pako from "pako"
import { TextDecoder } from "text-encoding"
import {
  IDecodedBlueprintData,
  IDecodedBlueprintBookData,
  IBlueprintBook,
  IBlueprint,
} from "../types"

const utf8Decoder = new TextDecoder("utf-8")

function isBook(
  decodedObject: IDecodedBlueprintData | IDecodedBlueprintBookData
) {
  if ((decodedObject as IDecodedBlueprintBookData).blueprint_book) {
    return true
  }

  return false
}

// from https://github.com/BlooperDB/factorio-render
// we eventually want to import their lib, but it doesn't seem to build on Node 12
// will look at this later
export function decodeBlueprint(
  blueprintString: string
): IBlueprint | IBlueprintBook {
  const versionlessString = blueprintString.substr(1)
  const compressed = Buffer.from(versionlessString, "base64")
  const decodedObject = JSON.parse(utf8Decoder.decode(pako.inflate(compressed)))

  if (isBook(decodedObject)) {
    return decodedObject.blueprint_book as IBlueprintBook
  }

  return decodedObject.blueprint as IBlueprint
}
