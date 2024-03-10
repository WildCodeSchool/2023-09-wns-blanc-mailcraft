import { User } from "../entities/user";
import * as argon2 from "argon2";
import { UserInput } from "../types/createUserInput";

export async function create(userData: UserInput): Promise<User> {
  const newUser = new User();
  newUser.pseudo = userData.pseudo;
  newUser.firstname = userData.firstname;
  newUser.lastname = userData.lastname;
  newUser.email = userData.email;
  newUser.hashedPassword = await argon2.hash(userData.password);
  newUser.role = userData.role ? userData.role : "MEMBER"; // si rien n'est spécifié par défaut MEMBER
  newUser.subscriptionType = userData.subscriptionType || "Free"; // si rien n'est spécifié par défaut FREE
  return newUser.save();
}

export function getByEmail(email: string): Promise<User> {
  return User.findOneByOrFail({ email });
}
