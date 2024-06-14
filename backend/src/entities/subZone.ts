import { Field, ObjectType } from "type-graphql";
import { Zone } from "./zone";
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
export class SubZone extends BaseEntity {
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
  size: string;

  @Field()
  @Column()
  zoneId: number;

  @ManyToOne(() => Zone, (zone: Zone) => zone.subZones, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "zoneId" })
  zone: Zone;
}
