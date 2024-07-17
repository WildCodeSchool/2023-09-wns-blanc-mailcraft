import { Field, InputType } from "type-graphql";
import { Length, IsOptional } from "class-validator";
@InputType()
export class ZoneInput {
  @Field()
  moduleType: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  size?: string;

  @Field()
  templateId: number;
}
