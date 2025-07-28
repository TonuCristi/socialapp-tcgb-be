import Post from "@/models/post.model";
import PostPhoto from "@/models/postPhoto.model";
import { Request, Response } from "express";

async function createPost(req: Request, res: Response) {
  try {
    const content = req.body.content;
    const order = JSON.parse(req.body.order);
    const photos = req.files as Express.Multer.File[];

    if (!content && !photos.length) {
      throw new Error(
        "To create a post, please write something or add at least one photo!"
      );
    }

    // Content validation
    if (content && content.length > 500) {
      throw new Error("The content shouldn't have more than 500 characters!");
    }

    // Photos validation
    if (photos && photos.length > 5) {
      throw new Error("You can upload up to 5 files only!");
    }

    const photosMimeType = photos.map((photo) => photo.mimetype);

    if (
      !photosMimeType.includes("image/png") ||
      !photosMimeType.includes("image/jpeg")
    ) {
      throw new Error("Each file must be PNG or JPEG!");
    }

    if (photos.find((photo) => photo.size < 10_000 || photo.size > 5_000_000)) {
      throw new Error("Each file must be between 10KB and 5MB in size!");
    }

    await Post.create({ content });

    for (let i = 0; i < photos.length; i++) {
      const foundPhoto = order.find(
        (orderItem: { index: number; photoName: string }) =>
          photos[i].originalname === orderItem.photoName
      );

      await PostPhoto.create({
        index: foundPhoto.index,
        photo: photos[i].buffer,
      });
    }

    res.status(201).json({
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
