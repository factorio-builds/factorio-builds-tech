import pako from "pako"
// TextEncoder/TextDecoder are native in browsers since 2019 and Node since 11.
import {
  IDecodedBlueprintData,
  IDecodedBlueprintBookData,
  IBlueprint,
  TBookItem,
  IBookItemBlueprint,
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

export function isBlueprintItem(item: TBookItem): item is IBookItemBlueprint {
  const blueprintItem = item as IBookItemBlueprint
  if (blueprintItem.blueprint !== undefined) {
    return true
  }

  return false
}

// from https://github.com/BlooperDB/factorio-render
// we eventually want to import their lib, but it doesn't seem to build on Node 12
// will look at this later
function base64ToBytes(b64: string): Uint8Array {
  // Browser-safe (atob) base64 → Uint8Array. Avoids the Node-only Buffer.
  const binary = typeof atob === "function" ? atob(b64) : ""
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
  return out
}

export function decodeBlueprint(
  blueprintString: string
): IDecodedBlueprintData | IDecodedBlueprintBookData {
  const versionlessString = blueprintString.substr(1)
  const compressed = base64ToBytes(versionlessString)
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
  if (!blueprint.entities) {
    return {}
  }

  return blueprint.entities.reduce((acc, curr) => {
    const count = acc[curr.name] || 0
    return {
      ...acc,
      [curr.name]: count + 1,
    }
  }, {} as Record<string, number>)
}
