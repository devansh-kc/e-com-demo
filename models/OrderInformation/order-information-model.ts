import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    email: { type: String, required: true },
    products: [
      {
        productId: String,
        title: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingDetails: {
      firstName: String,
      lastName: String,
      address: String,
      apartment: String,
      city: String,
      state: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);
