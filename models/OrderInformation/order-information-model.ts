import { Schema, model, models, Document } from "mongoose";

export interface ProductItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
}

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderSchemaModel extends Document {
  email: string;
  products: ProductItem[];
  totalAmount: number;
  shippingDetails: ShippingDetails;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<OrderSchemaModel>(
  {
    email: { type: String, required: true, index: true },
    products: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: false },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      apartment: { type: String, required: false },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Add index for faster queries
OrderSchema.index({ email: 1, createdAt: -1 });

export default models.Order || model<OrderSchemaModel>("Order", OrderSchema);
