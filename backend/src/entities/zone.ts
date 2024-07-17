import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { Template } from "./template";
import { SubZone } from "./subZone";

@ObjectType()
@Entity()
export class Zone extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  order: number;

  @Field(() => [SubZone])
  @OneToMany(() => SubZone, (subZone: SubZone) => subZone.zone)
  subZones: SubZone[];

  @Field()
  @Column()
  templateId: number;

  @ManyToOne(() => Template, (template: Template) => template.zones, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "templateId" })
  template: Template;
}
