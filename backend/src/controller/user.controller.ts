import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import User, { IUser } from "../models/user.model"; // Assuming you have a User model and IUser interface
import { ErrorHandler } from "../utils/error";

interface CustomRequest extends Request {
  user?: { id: string };
}

export const updateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.id !== req.params.id)
    return next(ErrorHandler(401, "You can update only your own account!"));

  try {
    const updateFields: Partial<IUser> = {
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
    };

    if (req.body.password) {
      updateFields.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return next(ErrorHandler(404, "User not found"));
    }

    const { password, ...others } = updatedUser.toObject();
    res.status(200).json(others);
  } catch (error) {
    next(ErrorHandler(500, "Internal server error"));
  }
};
