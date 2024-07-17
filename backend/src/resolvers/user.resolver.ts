import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/user";
import * as UserService from "../services/user.service";
import * as AuthService from "../services/auth.service";
import { UserInput } from "../types/createUserInput";

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
}
