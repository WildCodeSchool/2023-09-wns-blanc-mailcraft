import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { Zone } from "./zone";

@ObjectType()
@Entity()
export class SubZone extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  order: number;

  @Field()
  @Column()
  moduleType: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  width: string;

  @Field(() => [String], { nullable: true })
  @Column({ type: "simple-array", nullable: true })
  links: string[];

  @Field()
  @Column()
  zoneId: number;

  @ManyToOne(() => Zone, (zone: Zone) => zone.subZones, { onDelete: "CASCADE" })
  @JoinColumn({ name: "zoneId" })
  zone: Zone;
}
