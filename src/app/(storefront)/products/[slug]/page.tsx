import { ProductDetail } from "@/features/products/components/ProductDetail";

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-10">
      <ProductDetail slug={slug} />
    </div>
  );
}
