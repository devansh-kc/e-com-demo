import ProductDetailsCard from "@/components/product-detail-component/product-detail";

export default async function UserPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params; // Access the 'id' parameter
  const res = await fetch(`https://fakestoreapi.in/api/products/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const { product: detailPageData } = await res.json();

  // If no new products, stop further loading

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ProductDetailsCard product={detailPageData} />;
}
