import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import type {
  IDecodedBlueprintBookData,
  IDecodedBlueprintData,
  IImage,
  IMetadata,
} from "../../types"
import { User } from "./user.entity"

@Entity({ name: "Build" })
export class Build {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column("varchar")
  name!: string

  @Column("text")
  blueprint!: string

  @Column("text")
  description!: string

  @Column("jsonb")
  json!: IDecodedBlueprintBookData | IDecodedBlueprintData

  @Column("jsonb")
  metadata!: IMetadata

  @ManyToOne(() => User, (user) => user.builds, {
    eager: true,
  })
  @JoinTable()
  owner!: User

  @Column("jsonb")
  image!: IImage

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: string

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: string
}
