import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Length, IsEmail } from "class-validator";
import { Contact } from "./contactList";
import { Asset } from "./assets";
import { Template } from "./template";
import { Folder } from "./folder";
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @Length(1, 30)
  pseudo: string;

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

  @Column()
  hashedPassword: string;

  @Field()
  @Column()
  subscriptionType: string;

  @Field()
  @CreateDateColumn({ type: "timestamp" }) // crée automatiquement le champ avec la bonne date en base de donnée
  creationDate: Date;

  @Field()
  @Column()
  role: string;

  @OneToMany(() => Contact, (contact) => contact.user)
  @Field(() => [Contact], { nullable: true })
  contacts?: Contact[];

  @OneToMany(() => Asset, (asset) => asset.user)
  @Field(() => [Asset], { nullable: true })
  assets?: Asset[];

  @OneToMany(() => Template, (template) => template.user)
  @Field(() => [Template], { nullable: true })
  templates?: Template[];

  @OneToMany(() => Folder, (folder) => folder.user)
  @Field(() => [Folder], { nullable: true })
  folders: Folder[];
}
