import UpdateProductForm from "@/components/update-product-form/update-product-form";

export default async function UpdateProductPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;

  return <UpdateProductForm id={id} />;
}
