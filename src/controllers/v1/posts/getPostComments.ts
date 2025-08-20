import Comment from "@/models/comment.model";
import User from "@/models/user.model";
import { Request, Response } from "express";

async function getPostComments(req: Request, res: Response) {
  const { postId } = req.params;

  try {
    const offset = req.query.offset ? +req.query.offset : 0;
    const limit = req.query.limit ? +req.query.limit : 0;

    const foundComments = await Comment.find({ postId })
      .sort({ _id: -1 })
      .skip(offset * limit)
      .limit(limit);

    const comments = [];

    for (let i = 0; i < foundComments.length; i++) {
      const foundComment = foundComments[i];

      const foundUser = await User.findById(foundComment.userId).select(
        "-email -birthDate -password -bio -phoneNumber -createdAt -updatedAt -__v"
      );

      const comment = {
        _id: foundComment.id,
        content: foundComment.content,
        likesCount: 0,
        postId: foundComment.postId,
        createdAt: foundComment.createdAt,
        userId: foundUser?.id,
        userAvatar: foundUser?.avatar,
        userUsername: foundUser?.username,
      };

      comments.push(comment);
    }

    const commentsCount = await Comment.countDocuments({ postId });
    const maxPages = Math.ceil(commentsCount / limit);

    res.status(200).json({
      comments,
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

export default getPostComments;
