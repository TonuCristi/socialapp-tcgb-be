import config from "@/config/config";
import User from "@/models/user.model";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

async function getLoggedUser(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token as string, config.JWT_SECRET as string);

    if (!(decoded && typeof decoded !== "string")) {
      throw new Error("Invalid JWT!");
    }

    const userId = decoded.id;
    const foundUser = await User.findById(userId).select(
      "-password -createdAt -updatedAt -__v"
    );

    if (!foundUser) {
      throw new Error("User not found!");
    }

    res.status(201).json({
      user: foundUser,
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

export default getLoggedUser;
