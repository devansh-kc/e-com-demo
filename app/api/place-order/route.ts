import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/connection";
import ProductDataModel from "@/models/userInformationmodel/user-informationn-model";
import OrderModel from "@/models/OrderInformation/order-information-model";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email, products, shippingDetails } = await req.json();

    if (!email || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // eslint-disable-next-line prefer-const, @typescript-eslint/no-explicit-any
    let orderItems: any[] = [];
    let totalAmount = 0;

    for (const item of products) {
      const { productId, quantity } = item;

      const product = await ProductDataModel.findOne({ productId: productId });

      if (!product) {
        return NextResponse.json(
          { message: `Product not found: ${productId}` },
          { status: 404 }
        );
      }

      if (product.quantity < quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for ${product.title}` },
          { status: 400 }
        );
      }

      await ProductDataModel.updateOne(
        { productId },
        { $inc: { quantity: -quantity } }
      );

      orderItems.push({
        productId,
        title: product.title,
        quantity,
        price: product.price,
        image: product.image,
      });

      totalAmount += product.price * quantity;
    }

    const order = await OrderModel.create({
      email,
      products: orderItems,
      totalAmount,
      shippingDetails,
      status: "pending",
    });

    return NextResponse.json(
      { message: "Order placed successfully", order },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
