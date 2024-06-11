import { Field, InputType } from "type-graphql";
import { Length, IsOptional } from "class-validator";
@InputType()
export class CreateContactInputs {
  @Field()
  firstname: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(0, 255)
  lastname?: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(0, 255)
  profilepic?: string;

  @Field()
  userId: number;
}
