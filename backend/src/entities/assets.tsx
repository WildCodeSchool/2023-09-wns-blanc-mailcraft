import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType, Int } from "type-graphql";
import { User } from "./user";
import { Folder } from "./folder";
@ObjectType()
@Entity()
export class Asset extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  assetType: string;

  @Field()
  @Column()
  assetContent: string;

  @Field()
  @Column({ type: "timestamp" })
  creationDate: Date;

  @Field(() => Int)
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.assets)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToMany(() => Folder, (folder) => folder.assets)
  folders: Folder[];
}
