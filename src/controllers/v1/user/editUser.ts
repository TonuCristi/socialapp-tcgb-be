import User from "@/models/user.model";
import { verifyJWT } from "@/utils/verifyJWT";
import { Request, Response } from "express";
import { isEmail, isDate, isMobilePhone } from "validator";

async function editUser(req: Request, res: Response) {
  const { username, email, birthDate, phoneNumber } = req.body;

  try {
    const decoded = verifyJWT(req);

    const userId = decoded.id;
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      throw new Error("User not found!");
    }

    // Username validation
    if (!username) {
      throw new Error("The username field is required!");
    }

    if (username.length > 30) {
      throw new Error("The username shouldn't have more than 30 characters!");
    }

    const foundUserByUsername = await User.findOne({ username });

    if (foundUserByUsername && foundUser.id !== foundUserByUsername.id) {
      throw new Error("This username is already taken!");
    }

    // Email validation
    if (!email) {
      throw new Error("The email field is required!");
    }

    if (!isEmail(email)) {
      throw new Error("Invalid email!");
    }

    const foundUserByEmail = await User.findOne({ email });

    if (foundUserByEmail && foundUser.id !== foundUserByEmail.id) {
      throw new Error("This email is already registered!");
    }

    // // Birth date validation
    if (!birthDate) {
      throw new Error("The birth date field is required!");
    }

    if (!isDate(birthDate)) {
      throw new Error("Invalid birth date!");
    }

    // Phone number validation
    if (!phoneNumber) {
      throw new Error("The phone number field is required!");
    }

    if (!isMobilePhone(phoneNumber)) {
      throw new Error("Invalid phone number!");
    }

    await User.findByIdAndUpdate(foundUser.id, {
      ...req.body,
    });

    const editedUser = await User.findById(foundUser.id).select(
      "-createdAt -updatedAt -__v"
    );

    res.status(201).json({
      editedUser,
      message: "Profile edited successfully!",
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

export default editUser;
