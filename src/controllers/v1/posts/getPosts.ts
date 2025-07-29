import Post from "@/models/post.model";
import PostPhoto from "@/models/postPhoto.model";
import { Request, Response } from "express";
import { Types } from "mongoose";

type PostWithPhoto = {
  content: string;
  postPhotos: {
    _id: Types.ObjectId;
    index: number;
    photo: string;
  }[];
  userId: Types.ObjectId;
};

async function getPosts(req: Request, res: Response) {
  try {
    const offset = req.query.offset ? +req.query.offset : 0;
    const limit = req.query.limit ? +req.query.limit : 0;

    const foundPosts = await Post.find({})
      .skip(offset * limit)
      .limit(limit);

    const postsWithPhotos: PostWithPhoto[] = [];
    for (let i = 0; i < foundPosts.length; i++) {
      const post = foundPosts[i];

      const photos = await PostPhoto.find({ postId: post.id }).select(
        "-postId -createdAt -updatedAt -__v"
      );

      const postPhotos = photos.map((photoItem) => ({
        _id: photoItem._id,
        index: photoItem.index,
        photo: photoItem.photo,
      }));

      const postWithPhoto = {
        content: post.content,
        postPhotos,
        userId: post.userId,
      };

      postsWithPhotos.push(postWithPhoto);
    }

    res.status(200).json({ posts: postsWithPhotos });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      console.log("Error message:", error.message);
    } else {
      console.log("An unknown error occurred:", error);
    }
  }
}

export default getPosts;
