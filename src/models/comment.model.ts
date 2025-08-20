import { model, Schema, Types } from "mongoose";

export type Comment = {
  content: string;
  parentId: Types.ObjectId;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: string;
};

const commentSchema = new Schema<Comment>(
  {
    content: String,
    parentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Comment = model<Comment>("Comment", commentSchema);

export default Comment;
