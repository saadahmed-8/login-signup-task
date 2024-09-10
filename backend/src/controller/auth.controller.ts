import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import bcryptjs from "bcryptjs";
import { ErrorHandler } from "../utils/error";
import Jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 12);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User Created Successfully");
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(ErrorHandler(404, "User Not Found!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(ErrorHandler(401, "Invalid Credentials!"));

    const token = Jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET as string
    );
    const userObj = validUser.toObject();
    const { password: pass, ...rest } = userObj;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User Logged Out");
  } catch (error) {
    next(error);
  }
};
