import { model, Schema, Types } from "mongoose";

export type Post = {
  content: string;
  userId: Types.ObjectId;
  createdAt: string;
};

const postSchema = new Schema<Post>(
  {
    content: { type: String, default: "" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Post = model<Post>("Post", postSchema);

export default Post;
