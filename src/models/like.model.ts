import { model, Schema, Types } from "mongoose";

export type Like = {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
};

const likeSchema = new Schema<Like>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Like = model<Like>("Like", likeSchema);

export default Like;
