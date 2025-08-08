import Comment from "@/models/comment.model";
import Like from "@/models/like.model";
import Post from "@/models/post.model";
import PostPhoto from "@/models/postPhoto.model";
import User from "@/models/user.model";
import { verifyJWT } from "@/utils/verifyJWT";
import { Request, Response } from "express";
import { Types } from "mongoose";

type PostWithPhoto = {
  _id: Types.ObjectId;
  content: string;
  photos: {
    _id: Types.ObjectId;
    index: number;
    photo: string;
  }[];
  likesCount: number;
  commentsCount: number;
  creatorName: string;
};

async function getPostLikes(req: Request, res: Response) {
  const { postId } = req.params;

  try {
    const offset = req.query.offset ? +req.query.offset : 0;
    const limit = req.query.limit ? +req.query.limit : 0;

    const foundLikes = await Like.find({ postId })
      .skip(offset * limit)
      .limit(limit);

    const likes = [];

    for (let i = 0; i < foundLikes.length; i++) {
      const like = foundLikes[i];

      const foundUser = await User.findById(like.userId).select(
        "-email -birthDate -password -bio -phoneNumber -createdAt -updatedAt -__v"
      );

      likes.push(foundUser);
    }

    const likesCount = await Like.countDocuments({ postId });
    const maxPages = Math.ceil(likesCount / limit);

    res.status(200).json({
      likes,
      nextPage: maxPages - 1 > offset ? offset + 1 : null,
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

export default getPostLikes;
