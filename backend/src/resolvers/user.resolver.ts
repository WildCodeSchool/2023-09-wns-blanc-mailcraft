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

  @Mutation(() => User)
  async signUp(@Arg("userData") userData: UserInput): Promise<User> {
    const userFromDB = await UserService.create(userData);
    return userFromDB;
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
}
