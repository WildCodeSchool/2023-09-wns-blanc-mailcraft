import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Zone } from "./zone";
import { Folder } from "./folder";
import { User } from "./user";
@ObjectType()
@Entity()
export class Template extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 255 })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  templateNature: string; // genre de template (mail marketing etc...)

  @Field()
  @CreateDateColumn({ type: "timestamp" }) // crée automatiquement le champ avec la bonne date en base de donnée
  creationDate: Date;

  @Field()
  @Column()
  status: string; // brouillon etc

  @Field()
  @Column()
  userId: number;

  @OneToMany(() => Zone, (zone) => zone.template)
  @Field(() => [Zone])
  zones: Zone[];

  @ManyToMany(() => Folder, (folder) => folder.templates)
  folders: Folder[];

  @ManyToOne(() => User, (user) => user.templates)
  @JoinColumn({ name: "userId" })
  user: User;
}
