import { Field, ObjectType, Int } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Length, IsEmail } from "class-validator";
import { User } from "./user";

@ObjectType()
@Entity()
export class Contact extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @Length(1, 30)
  firstname: string;

  @Field()
  @Column()
  @Length(1, 30)
  lastname: string;

  @Field()
  @Column()
  @IsEmail({}, { message: "Invalid email" })
  email: string;

  @Field(() => Int)
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.contacts)
  @JoinColumn({ name: "userId" })
  user: User;
}
