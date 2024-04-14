import { Field, ObjectType, Int } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Template } from "./template";
import { Asset } from "./assets";
import { User } from "./user";
@ObjectType()
@Entity()
export class Folder extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  folderType: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: "timestamp" })
  creationDate?: Date;

  @Field(() => Int)
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.folders)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToMany(() => Template, (template) => template.folders)
  @JoinTable()
  templates: Template[];

  @ManyToMany(() => Asset, (asset) => asset.folders)
  @JoinTable()
  assets: Asset[];
}
