import { Field, InputType } from "type-graphql";

@InputType()
export class SubZoneInput {
  @Field()
  moduleType: string;

  @Field()
  content: string;

  @Field()
  size: string;

  @Field()
  zoneId: number;
}
