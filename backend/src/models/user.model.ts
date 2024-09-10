import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

// Create the schema
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png",
    },
  },
  { timestamps: true }
);

// Create the model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
