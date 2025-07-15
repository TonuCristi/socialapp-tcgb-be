import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "@/models/user.model";
import { isEmail, isStrongPassword } from "validator";
import generateJWT from "@/utils/generateJWT";

async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;

  try {
    // Username validation
    if (!username) {
      throw new Error("The username field is required!");
    }

    if (username.length > 30) {
      throw new Error("The username shouldn't have more than 30 characters!");
    }

    const foundUserByUsername = await User.findOne({ username });

    if (foundUserByUsername) {
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

    if (foundUserByEmail) {
      throw new Error("This email is already registered!");
    }

    // Password validation
    if (!password) {
      throw new Error("The password field is required!");
    }

    if (!isStrongPassword(password)) {
      throw new Error("Password not strong enough!");
    }

    // Password hash
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create the user
    const user = await User.create({ ...req.body, password: hashedPassword });

    const token = generateJWT({ id: user.id }, "1d");

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

export default register;
