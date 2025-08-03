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

async function getUserPosts(req: Request, res: Response) {
  try {
    const decoded = verifyJWT(req);

    const userId = decoded.id;

    const postCreator = await User.findById(userId);

    if (!postCreator) {
      throw new Error("User not found!");
    }

    const offset = req.query.offset ? +req.query.offset : 0;
    const limit = req.query.limit ? +req.query.limit : 0;

    const foundPosts = await Post.find({ userId: postCreator.id })
      .sort({ _id: -1 })
      .skip(offset * limit)
      .limit(limit);

    const postsWithPhotos: PostWithPhoto[] = [];
    for (let i = 0; i < foundPosts.length; i++) {
      const post = foundPosts[i];

      const photos = await PostPhoto.find({ postId: post.id }).select(
        "-createdAt -updatedAt -__v"
      );

      const likesCount = await Like.countDocuments({ postId: post._id });
      const commentsCount = await Comment.countDocuments({ postId: post._id });

      const postPhotos = photos.map((photoItem) => ({
        _id: photoItem._id,
        index: photoItem.index,
        photo: photoItem.photo,
      }));

      const postWithPhoto = {
        _id: post._id,
        content: post.content,
        photos: postPhotos,
        likesCount,
        commentsCount,
        creatorName: postCreator.username,
        createdAt: post.createdAt,
      };

      postsWithPhotos.push(postWithPhoto);
    }

    const postsCount = await Post.countDocuments({ userId: postCreator.id });
    const maxPages = Math.ceil(postsCount / limit);

    res.status(200).json({
      posts: postsWithPhotos,
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

export default getUserPosts;
