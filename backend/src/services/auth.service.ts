import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import * as UserService from "./user.service";
import * as argon2 from "argon2";

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT secret key is not defined.");
  }

  return jwt.verify(token, secret) as JwtPayload;
}
export async function signIn(email: string, password: string) {
  try {
    const userFromDB = await UserService.getByEmail(email);

    if (await verifyPassword(password, userFromDB.hashedPassword)) {
      const token = signJwt({
        email: userFromDB.email,
      });

      return token;
    } else {
      throw new Error();
    }
  } catch (e) {
    throw new Error("Invalid Auth");
  }
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await argon2.verify(hashedPassword, password);
}

export function signJwt(payload: any) {
  if (process.env.JWT_SECRET_KEY === undefined) {
    throw new Error();
  }

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: 60 * 60 * 10,
  });
}
