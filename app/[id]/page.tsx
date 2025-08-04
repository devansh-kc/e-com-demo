import ProductDetailsCard from "@/components/product-detail-component/product-detail";
import { headers } from "next/headers";

export default async function UserPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;

  const head = await headers();
  const host = head.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/fetch-product-data/${id}`);

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch products");
  }

  const { product: detailPageData } = await res.json();

  return <ProductDetailsCard product={detailPageData} />;
}
