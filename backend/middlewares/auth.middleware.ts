import ApiResponse from "../utils/api-response";
import { JwtService } from "../utils/jwt-service";
import { Request, Response, NextFunction } from "express";

// auth middleware
export const requireRole = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    // verifying the token
    try {
      // verify token
      const payload = JwtService.verifyToken(token, "access");

      // check if payload is valid
      if (!payload) {
        res.status(401).json({ message: "Unauthorized" });
        return
      }

      // Attach the user to the request object
      //@ts-ignore
      req.user = payload;
      next();
    } catch (error) {
      next(error);
    }
  };
};
