import { Schema, model, models, Document } from "mongoose";

export interface ProductData extends Document {
  image: string;
  title: string;
  price: number;
  description?: string;
  productId: string;
  quantity: number;
  brand: string;
  productModel: string;
  color?: string;
  category: string;
  discount?: number;
}

const ProductDataSchema = new Schema<ProductData>(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    productId: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, default: 1 },
    brand: { type: String, required: true },
    productModel: { type: String, required: true },
    color: { type: String, required: false },
    category: { type: String, required: true },
    discount: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

// ✅ This prevents the "Cannot overwrite model" error
const ProductDataModel =
  models.ProductData || model<ProductData>("ProductData", ProductDataSchema);

export default ProductDataModel;
