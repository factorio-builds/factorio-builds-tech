import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { Build } from "./build.entity"

@Entity({ name: "User" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column("varchar")
  name!: string

  @OneToMany(() => Build, (build) => build.owner)
  builds!: Build[]

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: string

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: string
}
