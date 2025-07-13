import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "@/models/user.model";
import { isEmail } from "validator";
import generateJWT from "@/utils/generateJWT";

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    // Email validation
    if (!email) {
      throw new Error("The email field is required!");
    }

    if (!isEmail(email)) {
      throw new Error("Invalid email!");
    }

    // Password validation
    if (!password) {
      throw new Error("The password field is required!");
    }

    const foundUserByEmail = await User.findOne({ email });

    // Check if user exists
    if (!foundUserByEmail) {
      throw new Error("User not found!");
    }

    const isPasswordChecked = bcrypt.compareSync(
      password,
      `${foundUserByEmail.password}`
    );

    // Check if the password matches
    if (!isPasswordChecked) {
      throw new Error("The email or password you entered is incorrect.");
    }

    const token = generateJWT({ id: foundUserByEmail.id }, "1d");

    res.status(201).json({
      token,
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

export default login;
