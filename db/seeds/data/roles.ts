import { ERole } from "../../../types"
import { Role } from "../../entities/role.entity"

export const roles: Omit<Role, "users">[] = [
  {
    name: ERole.USER,
  },
  {
    name: ERole.ADMIN,
  },
]
