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

  @Authorized()
  @Mutation(() => String)
  async updateUserName(
    @Arg("email") email: string,
    @Arg("firstname") firstname: string,
    @Arg("lastname") lastname: string
  ): Promise<string> {
    try {
      const updateResult = await UserService.updateUserName(email, firstname, lastname);
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
}
