import User from "@/models/user.model";
import { verifyJWT } from "@/utils/verifyJWT";
import { Request, Response } from "express";

async function getUsers(req: Request, res: Response) {
  const { search } = req.query;

  try {
    const decoded = verifyJWT(req);

    const userId = decoded.id;

    const offset = req.query.offset ? +req.query.offset : 0;
    const limit = req.query.limit ? +req.query.limit : 0;

    const foundUsers = await User.find({
      username: { $regex: search, $options: "i" },
      _id: { $ne: userId },
    })
      .skip(offset * limit)
      .limit(limit)
      .select(
        "-email -birthDate -password -bio -phoneNumber -createdAt -updatedAt -__v"
      );

    res.status(200).json({
      users: foundUsers,
      nextPage: offset + 1,
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

export default getUsers;
