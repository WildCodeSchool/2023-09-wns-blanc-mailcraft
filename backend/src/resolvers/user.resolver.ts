import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/user";
import * as UserService from "../services/user.service";
import * as AuthService from "../services/auth.service";
import { UserInput } from "../types/createUserInput";
import { SocialLinkInput } from "../types/createSocialLinkInput";

@Resolver(User)
export class UserResolver {
  @Authorized()
  @Query(() => User)
  getMe(@Ctx() context: { user: User }): User {
    return context.user;
  }

  @Mutation(() => String)
  async signUp(@Arg("userData") userData: UserInput): Promise<string> {
    try {
      const creationResult = await UserService.create(userData);
      return creationResult;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  @Mutation(() => String)
  async signIn(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<String> {
    try {
      return AuthService.signIn(email, password);
    } catch (e) {
      throw new Error("Invalid Auth");
    }
  }

  @Authorized()
  @Mutation(() => String)
  async updateUserName(
    @Arg("email") email: string,
    @Arg("firstname") firstname: string,
    @Arg("lastname") lastname: string
  ): Promise<string> {
    try {
      const updateResult = await UserService.updateUserName(
        email,
        firstname,
        lastname
      );
      return updateResult;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  @Mutation(() => Boolean)
  async verifyPassword(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<boolean> {
    const user = await UserService.getByEmail(email);
    return AuthService.verifyPassword(password, user.hashedPassword);
  }

  @Mutation(() => String)
  async resetPassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string
  ): Promise<string> {
    try {
      return await UserService.resetPassword(token, newPassword);
    } catch (error) {
      console.error("Error resetting password:", error);
      throw new Error("Failed to reset password");
    }
  }

  @Mutation(() => String)
  async doesMailAlreadyExist(@Arg("mail") mail: string): Promise<boolean> {
    try {
      return await UserService.doesMailAlreadyExist(mail);
    } catch (error) {
      console.error("Error evaluating mail", error);
      throw new Error("Failed to check user mail");
    }
  }

  @Mutation(() => String)
  async createUserLinks(
    @Arg("email") email: string,
    @Arg("socialLinkData") socialLinkData: SocialLinkInput
  ): Promise<string> {
    try {
      return await UserService.createSocialLink(email, socialLinkData);
    } catch (error) {
      console.error("Error adding social link: ", error);
      throw new Error("Failed to add social link");
    }
  }

  @Mutation(() => String)
  async updateUserLinks(
    @Arg("email") email: string,
    @Arg("id") id: number,
    @Arg("facebook") facebook: string,
    @Arg("twitter") twitter: string,
    @Arg("linkedin") linkedin: string
  ): Promise<string> {
    try {
      const updateSocialLink = await UserService.updateSocialLink(
        email,
        id,
        facebook,
        twitter,
        linkedin
      );
      return updateSocialLink;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  @Mutation(() => String)
  async updateUserTour(@Arg("userId") userId: number): Promise<string> {
    try {
      return await UserService.updateUserTour(userId);
    } catch (error) {
      console.error("Error updating user tour: ", error);
      throw new Error("Failed to update user tour");
    }
  }
}
