import { supabase } from "@/config/supabase";
import Post from "@/models/post.model";
import PostPhoto from "@/models/postPhoto.model";
import User from "@/models/user.model";
import { verifyJWT } from "@/utils/verifyJWT";
import { Request, Response } from "express";

async function createPost(req: Request, res: Response) {
  try {
    const decoded = verifyJWT(req);

    const userId = decoded.id;

    const postCreator = await User.findById(userId);

    if (!postCreator) {
      throw new Error("User not found!");
    }

    const content = req.body.content;
    const order = JSON.parse(req.body.order);
    const photos = req.files as Express.Multer.File[];

    if (!content && !photos.length) {
      throw new Error(
        "To create a post, please write something or add at least one photo!"
      );
    }

    // Content validation
    if (content && content.length > 2000) {
      throw new Error("The content shouldn't have more than 2000 characters!");
    }

    // Photos validation
    if (photos && photos.length > 5) {
      throw new Error("You can upload up to 5 files only!");
    }

    const photosMimeType = photos.map((photo) => photo.mimetype);

    if (
      photos.length &&
      !(
        photosMimeType.includes("image/png") ||
        photosMimeType.includes("image/jpeg")
      )
    ) {
      throw new Error("Each file must be PNG or JPEG!");
    }

    if (photos.find((photo) => photo.size < 10_000 || photo.size > 5_000_000)) {
      throw new Error("Each file must be between 10KB and 5MB in size!");
    }

    const createdPost = await Post.create({ content, userId });

    const photosWithOrder = [];

    for (let i = 0; i < photos.length; i++) {
      const foundPhoto = order.find(
        (orderItem: { index: number; photoName: string }) =>
          photos[i].originalname === orderItem.photoName
      );

      const { data, error } = await supabase.storage
        .from("photos")
        .upload(`postsPhotos/${createdPost.id}-${i + 1}`, photos[i].buffer, {
          contentType: photos[i].mimetype,
          upsert: false,
        });

      if (error) {
        throw new Error("Something went wrong!");
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(data.path, {
        transform: {
          quality: 60,
        },
      });

      const photo = await PostPhoto.create({
        index: foundPhoto.index,
        photo: `${publicUrl}`,
        postId: createdPost.id,
      });

      photosWithOrder.push({
        _id: photo.id,
        photo: photo.photo,
        index: photo.index,
      });
    }

    res.status(201).json({
      newPost: {
        _id: createdPost.id,
        content: createdPost.content,
        photos: photosWithOrder,
        likesCount: 0,
        commentsCount: 0,
        creatorName: postCreator.username,
        createdAt: createdPost.createdAt,
      },
      message: "Post created successfully!",
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

export default createPost;
