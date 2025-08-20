import Comment from "@/models/comment.model";
import Post from "@/models/post.model";
import User from "@/models/user.model";
import { verifyJWT } from "@/utils/verifyJWT";
import { Request, Response } from "express";

async function addPostComment(req: Request, res: Response) {
  const postId = req.params.postId;
  const { content } = req.body;

  try {
    const decoded = verifyJWT(req);

    const userId = decoded.id;

    const postCreator = await User.findById(userId);

    if (!postCreator) {
      throw new Error("User not found!");
    }

    const foundPost = await Post.findById(postId);

    if (!foundPost) {
      throw new Error("Post not found!");
    }

    // Content validation
    if (!content) {
      throw new Error("The content field is required!");
    }

    if (content.length > 2000) {
      throw new Error("The content shouldn't have more than 2000 characters!");
    }

    const createdComment = await Comment.create({
      content,
      postId: foundPost.id,
      userId: postCreator.id,
    });

    const foundComment = await Comment.findById(createdComment.id).select(
      "-updatedAt -__v"
    );

    const newPostComment = {
      _id: foundComment?.id,
      content: foundComment?.content,
      likesCount: 0,
      postId: foundComment?.postId,
      createdAt: foundComment?.createdAt,
      userId: postCreator.id,
      userAvatar: postCreator.avatar,
      userUsername: postCreator.username,
    };

    res.status(200).json({
      newPostComment,
      message: "Comment added successfully!",
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

export default addPostComment;
