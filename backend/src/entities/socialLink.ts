import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Field, ObjectType, Int } from "type-graphql";
  import { User } from "./user";

  @ObjectType()
  @Entity()
  export class SocialLink extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;
  
    @Field()
    @Column({nullable : true})
    facebook: string;
  
    @Field()
    @Column({nullable : true})
    twitter: string;
  
    @Field()
    @Column({nullable : true})
    linkedin: string;

    @Field()
    @Column()
    userId: number;
  
    @ManyToOne(() => User, (user) => user.socialLinks)
    @JoinColumn({ name: "userId" })
    user: User;
  };
  