import { prisma } from "../prisma";
import { emailVerificationTemplate } from "../templates/email-verification";
import { passwordResetTemplate } from "../templates/password-reset";
import { sendEmail } from "../utils/email-service";
import { JwtService } from "../utils/jwt-service";
import { comparePassword, hashPassword } from "../utils/password-hash";
import { generateRandomCode } from "../utils/usable-funcs";
import { isBefore, addMinutes } from "date-fns";

export class AuthService {
  // register service
  static async register(
    username:string,
    email: string,
    password: string
  ) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("User already exists");
    }

    // hashing the password
    const hashed = await hashPassword(password);

    // creating a new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed
      },
    });

    return user;
  }

  // login user
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username:true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // compare password
    if (!(await comparePassword(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    // generating tokens
    const access_token = JwtService.signToken(
      { id: user.id },
      "access"
    );

    return { access_token, user };
  }

  // getting logged in user
  static async getLoggedInUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username:true,
        email: true,
      },
    });
    if (!user) {
      throw new Error("user information not found");
    }
    return user;
  }

  // forgot password
  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const passwordResetCode = generateRandomCode();
    const passwordResetCodeExpiry = addMinutes(new Date(), 15);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetCode,
        passwordResetCodeExpiry,
      },
    });

    await sendEmail({
      to: user.email,
      subject: "Password reset code",
      html: passwordResetTemplate(user.username, passwordResetCode),
    });
  }

  // resend forgot password code
  static async resendPasswordResetCode(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new Error("User not found");

    const passwordResetCode = generateRandomCode();
    const passwordResetCodeExpiry = addMinutes(new Date(), 15);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetCode,
        passwordResetCodeExpiry,
      },
    });

    await sendEmail({
      to: user.email,
      subject: "Password reset code",
      html: passwordResetTemplate(user.username, passwordResetCode),
    });
  }

  // reset Password
  static async resetPassword(code: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: { passwordResetCode: code },
    });

    if (
      !user ||
      !user.passwordResetCodeExpiry ||
      isBefore(user.passwordResetCodeExpiry, new Date())
    ) {
      throw new Error("Invalid or expired reset code.");
    }

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        passwordResetCode: null,
        passwordResetCodeExpiry: null,
      },
    });
  }
}
