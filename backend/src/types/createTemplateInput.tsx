import { Field, InputType } from "type-graphql";
import { Length, IsOptional } from "class-validator";
@InputType()
export class TemplateInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(0, 255)
  description?: string;

  @Field({ nullable: true })
  templateNature?: string;

  @Field()
  status: string;

  @Field()
  userId: number;
}
