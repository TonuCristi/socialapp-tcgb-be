import { model, Schema } from "mongoose";

export type User = {
  username: string;
  email: string;
  birthDate: Date | "";
  password: string;
  bio: string;
  phoneNumber: string;
  avatar: string;
};

const userSchema = new Schema<User>(
  {
    username: { type: String, default: "" },
    email: { type: String, default: "" },
    birthDate: { type: Date, default: "" },
    password: { type: String, default: "" },
    bio: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = model<User>("User", userSchema);

export default User;
