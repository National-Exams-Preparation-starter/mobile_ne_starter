import { validate } from "../middlewares/req-validation.middleware";
import { AuthController } from "../controllers/auth.controller";
import {requireRole} from "../middlewares/auth.middleware";
import { Router } from "express";
import { loginSchema } from "../validation/auth-validation";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", validate(loginSchema), AuthController.login);

authRouter.post("/forgot-password", AuthController.forgotPassword);
authRouter.post("/reset-password", AuthController.resetPassword);

authRouter.get("/me", requireRole(), AuthController.getLoggedInUser);

export default authRouter;
