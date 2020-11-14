import { User } from "../db/entities/user.entity"

export const mockedUsers: User[] = [
  {
    id: "101",
    name: "Alice",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "102",
    name: "Bob",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "103",
    name: "Caroline",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "104",
    name: "Dave",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
