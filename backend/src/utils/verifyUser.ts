import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";
import { ErrorHandler } from "./error.js";

config();

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;
  if (!token) return next(ErrorHandler(401, "Unauthorized"));

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (error: any, user: any) => {
      if (error) return next(ErrorHandler(403, "Forbidden"));

      req.user = user;
      next();
    }
  );
};
