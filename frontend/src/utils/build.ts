import { IBlueprintPayload, IBookPayload, IFullPayload } from "../types/models"

export function isBook(payload: IFullPayload): payload is IBookPayload {
  return payload.type === "blueprint-book"
}

export function countEntities(
  entities?: IBlueprintPayload["entities"] | IBlueprintPayload["tiles"]
): number {
  if (!entities) {
    return 0
  }

  return Object.keys(entities).reduce((acc, curr) => {
    return acc + entities[curr]
  }, 0)
}
