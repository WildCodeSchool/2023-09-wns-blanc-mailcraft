import { User } from "../entities/user";
import { SocialLink } from "../entities/socialLink";
import * as argon2 from "argon2";
import { UserInput } from "../types/createUserInput";
import { SocialLinkInput } from "../types/createSocialLinkInput";
import { verifyToken } from "./auth.service";

export async function create(userData: UserInput): Promise<string> {
  try {
    const newUser = new User();
    newUser.pseudo = userData.pseudo;
    newUser.firstname = userData.firstname || "";
    newUser.lastname = userData.lastname || "";
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
  return await User.findOneOrFail({
    where: { email },
    relations: ["socialLinks"],
  });
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

export const doesMailAlreadyExist = async (mail: string): Promise<boolean> => {
  const users = await User.find({ select: ["email"] });
  const emailList = users.map((user: User) => user.email);
  return emailList.includes(mail);
};

export async function updateUserName(
  email: string,
  firstname: string,
  lastname: string
): Promise<string> {
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

export async function createSocialLink(
  email: string,
  socialLinkData: SocialLinkInput
): Promise<string> {
  try {
    const user = await User.findOneByOrFail({ email });

    const socialLink = new SocialLink();
    socialLink.facebook = socialLinkData.facebook || "";
    socialLink.twitter = socialLinkData.twitter || "";
    socialLink.linkedin = socialLinkData.linkedin || "";
    socialLink.userId = user.id;

    await socialLink.save();
    return "Social link successfully added";
  } catch (error) {
    console.error("Error adding the social link: ", error);
    throw new Error("Failed to add the social link");
  }
}

export async function updateSocialLink(
  email: string,
  id: number,
  facebook: string,
  twitter: string,
  linkedin: string
): Promise<string> {
  try {
    const user = await User.findOneOrFail({
      where: { email },
      relations: ["socialLinks"],
    });

    if (!user.socialLinks || user.socialLinks.length === 0) {
      throw new Error("No social links found for the user");
    }

    const socialLink = user.socialLinks.find((link) => link.id === id);
    if (!socialLink) {
      throw new Error("Social link not found");
    }

    socialLink.facebook = facebook;
    socialLink.twitter = twitter;
    socialLink.linkedin = linkedin;

    await socialLink.save();
    return "Social link successfully updated";
  } catch (error) {
    console.error("Error updating the social link: ", error);
    throw new Error("Failed to update the social link");
  }
}

export const updateUserTour = async (userId: number): Promise<string> => {
  try {
    const user = await User.findOneByOrFail({ id: userId });

    user.isFirstTourCompleted = true;

    await user.save();

    return "first tour completed";
  } catch (error) {
    console.error("Error updating user tour:", error);
    throw new Error("Unable to update user tour");
  }
};
