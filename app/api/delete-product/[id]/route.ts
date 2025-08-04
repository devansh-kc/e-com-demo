import { dbConnect } from "@/lib/connection";
import ProductDataModel from "@/models/cartItemModel/cart-item-model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: Readonly<{ params: Promise<{ id: string }> }>
) {
  await dbConnect();

  const { id } = await params;
  console.log("productid from delete", id);
  try {
    const deletedProduct = await ProductDataModel.findOneAndDelete({
      productId: id,
    });

    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully", product: deletedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
