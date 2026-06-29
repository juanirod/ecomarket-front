import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { CartCountProvider } from "@/lib/cart-count-context";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartCountProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartCountProvider>
  );
}
