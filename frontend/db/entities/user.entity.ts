import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm"
import { ERole } from "../../types"
import { Build } from "./build.entity"
import { Role } from "./role.entity"

@Entity({ name: "User" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ type: "varchar", nullable: true })
  discordId!: string | null

  @Column("varchar")
  name!: string

  @Column({ type: "varchar", name: "roleName", default: ERole.USER })
  @JoinColumn({ name: "roleName", referencedColumnName: "name" })
  roleName!: ERole

  @ManyToOne("Role", "name", { eager: true })
  role!: Role

  @OneToMany("Build", "owner")
  builds!: Build[]

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: string

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: string
}
