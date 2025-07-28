import { model, Schema } from "mongoose";

export type PostPhoto = {
  photo: Buffer;
  index: number;
};

const postPhotoSchema = new Schema<PostPhoto>(
  {
    photo: Buffer,
    index: Number,
  },
  { timestamps: true }
);

const PostPhoto = model<PostPhoto>("PostPhoto", postPhotoSchema);

export default PostPhoto;
