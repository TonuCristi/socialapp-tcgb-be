import { model, Schema } from "mongoose";

export type Post = {
  content: String;
};

const postSchema = new Schema<Post>(
  {
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

const Post = model<Post>("Post", postSchema);

export default Post;
