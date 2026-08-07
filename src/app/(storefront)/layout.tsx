import { Header } from "@/shared/components/Header";
import { Footer } from "@/shared/components/Footer";

export default function StorefrontLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
