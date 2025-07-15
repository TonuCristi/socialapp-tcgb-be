import User from "@/models/user.model";
import { verifyJWT } from "@/utils/verifyJWT";
import { Request, Response } from "express";

async function getLoggedUser(req: Request, res: Response) {
  try {
    const decoded = verifyJWT(req);

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
