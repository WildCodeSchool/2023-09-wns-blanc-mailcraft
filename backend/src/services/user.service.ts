import { User } from "../entities/user";
import * as argon2 from "argon2";
import { UserInput } from "../types/createUserInput";
import { verifyToken } from "./auth.service";
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

export async function getByEmail(email: string): Promise<User> {
  return await User.findOneByOrFail({ email });
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<string> {
  try {
    const decoded = verifyToken(token) as { email: string };
    const email = decoded.email;
    console.log(`User mail is ${email}`);

    const user = await getByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    user.hashedPassword = await argon2.hash(newPassword);
    await user.save();

    return "Password updated successfully";
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error("Failed to update password");
  }
}
