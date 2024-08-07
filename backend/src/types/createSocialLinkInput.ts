import { Field, InputType } from "type-graphql";

@InputType()
export class SocialLinkInput {
  @Field({ nullable: true })
  facebook: string;

  @Field({ nullable: true })
  twitter: string;

  @Field({ nullable: true })
  linkedin: string;
}
