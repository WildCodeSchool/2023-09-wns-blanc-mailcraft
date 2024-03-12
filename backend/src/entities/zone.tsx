import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { Template } from "./template";

@ObjectType()
@Entity()
export class Zone extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  moduleType: string; // texte / logo / image

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  size: number;

  @Field()
  @Column()
  templateId: number;

  @ManyToOne(() => Template, (template) => template.zones)
  @JoinColumn({ name: "templateId" })
  template: Template;
}
