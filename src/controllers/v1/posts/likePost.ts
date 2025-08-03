import Like from "@/models/like.model";
import Post from "@/models/post.model";
import User from "@/models/user.model";
import { verifyJWT } from "@/utils/verifyJWT";
import { Request, Response } from "express";

async function likePost(req: Request, res: Response) {
  const postId = req.params.postId;

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

    const foundLike = await Like.findOne({
      postId: foundPost.id,
      userId: postCreator.id,
    });

    if (foundLike) {
      await Like.findByIdAndDelete(foundLike.id);

      return res.status(200).json({
        message: "Post unliked successfully!",
      });
    }

    await Like.create({ postId: foundPost.id, userId: postCreator.id });

    res.status(200).json({
      message: "Post liked successfully!",
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

export default likePost;
