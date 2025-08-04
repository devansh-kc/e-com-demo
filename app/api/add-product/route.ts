// /app/api/add-product/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/connection";
import ProductDataModel from "@/models/cartItemModel/cart-item-model";

function generateCustomProductId() {
  const datePart = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PROD-${datePart}-${randomPart}`;
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const data = await req.json();

    const {
      image,
      title,
      price,
      description,
      quantity,
      brand,
      productModel,
      color,
      category,
      discount,
    } = data;

    // Validate required fields
    if (!title || !price || !brand || !productModel || !category) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const productId = generateCustomProductId();

    const newProduct = await ProductDataModel.create({
      image,
      title,
      price,
      description,
      productId, // ✅ auto-generated
      quantity,
      brand,
      productModel,
      color,
      category,
      discount,
    });

    return NextResponse.json({ message: "Product added", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
