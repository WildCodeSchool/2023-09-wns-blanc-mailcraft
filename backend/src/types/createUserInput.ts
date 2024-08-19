import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { SocialLink } from "../entities/socialLink";
import { SocialLinkInput } from "./createSocialLinkInput";

@InputType()
export class UserInput {
  @Field()
  @Length(1, 30)
  pseudo: string;

  @Field({ nullable: true })
  @Length(1, 30)
  firstname?: string;

  @Field({ nullable: true })
  @Length(1, 30)
  lastname?: string;

  @Field()
  @IsEmail({}, { message: "Invalid email" })
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  subscriptionType?: string;

  @Field(() => [SocialLinkInput], { nullable: true })
  socialLinks?: SocialLink[];
}
