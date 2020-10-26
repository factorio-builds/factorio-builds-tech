import { IUser } from "../types"

export const mockedUsers: IUser[] = [
  {
    id: "101",
    name: "Alice",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "102",
    name: "Bob",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "103",
    name: "Caroline",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "104",
    name: "Dave",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]
