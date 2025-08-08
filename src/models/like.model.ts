import { model, Schema, Types } from "mongoose";

export type Like = {
  type: "post" | "comment";
  postId: Types.ObjectId;
  commentId: Types.ObjectId;
  userId: Types.ObjectId;
};

const likeSchema = new Schema<Like>(
  {
    type: String,
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Like = model<Like>("Like", likeSchema);

export default Like;
