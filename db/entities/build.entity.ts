import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
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

  @Column({ name: "ownerId" })
  ownerId!: string

  @ManyToOne("User", { eager: true })
  @JoinColumn({ name: "ownerId", referencedColumnName: "id" })
  owner!: User

  @Column({ type: "jsonb", nullable: true })
  image!: IImage

  @Column({ type: "integer", default: 0 })
  views!: number

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: string

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: string
}
