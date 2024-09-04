import { Field, InputType } from "type-graphql";

@InputType()
export class SubZoneInput {
  // [key: string]: string | number | null | string[] | undefined;

  @Field()
  order: number;

  @Field()
  moduleType: string;

  @Field()
  content: string;

  @Field()
  width: string;

  @Field(() => [String], { nullable: true })
  links?: string[];

  @Field()
  zoneId: number;
}
