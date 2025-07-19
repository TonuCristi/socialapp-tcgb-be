import User from "@/models/user.model";
import { verifyJWT } from "@/utils/verifyJWT";
import { Request, Response } from "express";

async function editUserBio(req: Request, res: Response) {
  const { bio } = req.body;

  try {
    const decoded = verifyJWT(req);

    const userId = decoded.id;
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      throw new Error("User not found!");
    }

    if (!bio) {
      throw new Error("The bio field is required!");
    }

    if (bio.length > 150) {
      throw new Error("The bio shouldn't have more than 150 characters!");
    }

    await User.findByIdAndUpdate(foundUser.id, { bio });

    res.status(201).json({
      bio,
      message: "Profile bio edited successfully!",
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

export default editUserBio;
