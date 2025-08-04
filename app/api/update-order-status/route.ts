// /app/api/update-order-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/connection";
import OrderModel from "@/models/OrderInformation/order-information-model";

export async function PATCH(req: NextRequest) {
  await dbConnect();

  try {
    const { orderId, status } = await req.json();

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order updated", order: updatedOrder });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating order", error },
      { status: 500 }
    );
  }
}
