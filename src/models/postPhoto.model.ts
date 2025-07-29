import { model, Schema, Types } from "mongoose";

export type PostPhoto = {
  photo: string;
  index: number;
  postId: Types.ObjectId;
};

const postPhotoSchema = new Schema<PostPhoto>(
  {
    photo: String,
    index: Number,
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

const PostPhoto = model<PostPhoto>("PostPhoto", postPhotoSchema);

export default PostPhoto;
