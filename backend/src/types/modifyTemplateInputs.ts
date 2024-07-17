import { Field, InputType } from "type-graphql";
import { Length, IsOptional } from "class-validator";

export interface TemplateKey {
  [key: string]: string | number;
}

@InputType()
export class TemplateInput {
  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(0, 255)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  templateNature?: string;

  @Field({ nullable: true })
  @IsOptional()
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  userId?: number;
}
