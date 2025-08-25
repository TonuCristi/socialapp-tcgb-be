import Comment from "@/models/comment.model";
import Like from "@/models/like.model";
import Post from "@/models/post.model";
import PostPhoto from "@/models/postPhoto.model";
import User from "@/models/user.model";
import { verifyJWT } from "@/utils/verifyJWT";
import { Request, Response } from "express";

async function deletePost(req: Request, res: Response) {
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

    await Comment.deleteMany({ postId: foundPost.id });
    await Like.deleteMany({ postId: foundPost.id });
    await PostPhoto.deleteMany({ postId: foundPost.id });
    await Post.findByIdAndDelete(foundPost.id);

    res.status(200).json({
      message: "Comment deleted successfully!",
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

export default deletePost;
