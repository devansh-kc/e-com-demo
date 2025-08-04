import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/connection";
import OrderModel from "@/models/OrderInformation/order-information-model";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 }); // latest first

    return NextResponse.json({ orders }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
