import User from "@/models/user.model";
import { verifyJWT } from "@/utils/verifyJWT";
import { Request, Response } from "express";
import { isStrongPassword } from "validator";
import bcrypt from "bcrypt";

async function changePassword(req: Request, res: Response) {
  const { newPassword, confirmPassword, oldPassword } = req.body;

  try {
    const decoded = verifyJWT(req);

    const userId = decoded.id;

    const foundUser = await User.findById(userId);

    if (!foundUser) {
      throw new Error("User not found!");
    }

    if (!newPassword) {
      throw new Error("The new password field is required!");
    }

    if (!confirmPassword) {
      throw new Error("The confirm password field is required!");
    }

    if (!oldPassword) {
      throw new Error("The old password field is required!");
    }

    if (!isStrongPassword(newPassword)) {
      throw new Error("New password not strong enough!");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Passwords don't match!");
    }

    const isOldPasswordChecked = bcrypt.compareSync(
      oldPassword,
      `${foundUser.password}`
    );

    if (!isOldPasswordChecked) {
      throw new Error("The old password is incorrect!");
    }

    const isNewPasswordChecked = bcrypt.compareSync(
      newPassword,
      `${foundUser.password}`
    );

    if (isNewPasswordChecked) {
      throw new Error(
        "The new password matches the old one. Choose a new one!"
      );
    }

    // Password hash
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    await User.findByIdAndUpdate(foundUser.id, { password: hashedPassword });

    res.status(201).json({
      message: "Password changed successfully!",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      console.log("Error message:", error.message);
    } else {
      console.log("An unknown error occurred:", error);
    }
  }
}

export default changePassword;
