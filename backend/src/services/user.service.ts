import { User } from "../entities/user";
import * as argon2 from "argon2";
import { UserInput } from "../types/createUserInput";

export async function create(userData: UserInput): Promise<string> {
  try {
    const newUser = new User();
    newUser.pseudo = userData.pseudo;
    newUser.firstname = userData.firstname;
    newUser.lastname = userData.lastname;
    newUser.email = userData.email;
    newUser.hashedPassword = await argon2.hash(userData.password);
    newUser.role = userData.role ? userData.role : "MEMBER"; // si rien n'est spécifié par défaut MEMBER
    newUser.subscriptionType = userData.subscriptionType || "Free"; // si rien n'est spécifié par défaut FREE

    newUser.save();
    return "User successfully created";
  } catch (error) {
    console.error("Error creating the user: ", error);
    throw new Error("Failed to create user");
  }
}

export function getByEmail(email: string): Promise<User> {
  return User.findOneByOrFail({ email });
}

export async function updateUserName(email: string, firstname: string, lastname: string): Promise<string> {
  try {
    const user = await User.findOneByOrFail({ email });
    user.firstname = firstname;
    user.lastname = lastname;
    await user.save();
    return "User name successfully updated";
  } catch (error) {
    console.error("Error updating the user name: ", error);
    throw new Error("Failed to update user name");
  }
}
