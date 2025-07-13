import mongoose, { model, Schema } from "mongoose";

export type User = {
  username: String;
  email: String;
  password: String;
};

const userSchema = new Schema<User>(
  {
    username: String,
    email: String,
    password: String,
  },
  { timestamps: true }
);

const User = model<User>("User", userSchema);

export default User;
