import { Schema, model, models, Document, Types } from "mongoose";

export interface CommentData extends Document {
  productId: Types.ObjectId;
  userId: string;
  userName: string;
  comment: string;
  rating?: number;
}

const CommentSchema = new Schema<CommentData>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "ProductData",
      required: true,
    },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

const CommentModel =
  models.CommentData || model<CommentData>("CommentData", CommentSchema);

export default CommentModel;
