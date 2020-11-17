import { Entity, OneToMany, PrimaryColumn } from "typeorm"
import { ERole } from "../../types"
import { User } from "./user.entity"

@Entity({ name: "Role" })
export class Role {
  @PrimaryColumn({ type: "enum", enum: ERole, default: ERole.USER })
  name!: ERole

  @OneToMany("User", "role")
  users!: User[]
}
