import { AuthService } from "../services/auth.service";
import ApiResponse from "../utils/api-response";
import { NextFunction, Request, Response } from "express";

export class AuthController {
  // register controller
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { username, email, password } = req.body;
      const user = await AuthService.register(username, email, password);
      return ApiResponse.success(
        res,
        user,
        "account created successfully",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  //   login controller
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { email, password } = req.body;
      const { access_token, user } = await AuthService.login(email, password);

      return ApiResponse.success(
        res,
        { user, access_token },
        "logged in successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  //   getting logged in user info
  static async getLoggedInUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // @ts-ignore
      const user = req.user;
      const userInfo = await AuthService.getLoggedInUser(user.id);
      return ApiResponse.success(res, userInfo);
    } catch (error) {
      next(error);
    }
  }

  //   forgot password request code
  static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      return ApiResponse.success(
        res,
        null,
        "reset code sent to your email",
        200
      );
    } catch (error) {
      next(error);
    }
  }

  //   resend password reset code controller
  static async resendPassVeryCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { email } = req.body;
      await AuthService.resendPasswordResetCode(email);
      return ApiResponse.success(
        res,
        null,
        "password reset code resent successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  //   resent password controller
  static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { code, newPassword } = req.body;
      await AuthService.resetPassword(code, newPassword);
      return ApiResponse.success(res, null, "password reset successfully");
    } catch (error) {
      next(error);
    }
  }
}
