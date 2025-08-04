import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/connection";
import ProductDataModel from "@/models/cartItemModel/cart-item-model";

export async function PUT(
  req: NextRequest,
  { params }: Readonly<{ params: Promise<{ id: string }> }>
) {
  await dbConnect();
  const { id } = await params;

  try {
    const data = await req.json();

    const updatedProduct = await ProductDataModel.findOneAndUpdate(
      { productId: id },
      { $set: data },
      { new: true } // return the updated document
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
