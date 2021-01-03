import { ERole } from "../../../types"
import { User } from "../../entities/user.entity"

export const users: Omit<User, "builds" | "role">[] = [
  {
    name: "Billy Bob",
    id: "c8b15803-1b90-4194-9896-a2869e67deb2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    discordId: null,
    roleName: ERole.USER,
  },
  {
    name: "Mary Sue",
    id: "8358cfb0-2675-4651-a9c2-0d7cf57d6110",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    discordId: null,
    roleName: ERole.USER,
  },
]
