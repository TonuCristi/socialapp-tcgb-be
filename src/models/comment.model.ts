import { model, Schema, Types } from "mongoose";

export type Comment = {
  content: string;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
};

const commentSchema = new Schema<Comment>(
  {
    content: String,
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Comment = model<Comment>("Comment", commentSchema);

export default Comment;
