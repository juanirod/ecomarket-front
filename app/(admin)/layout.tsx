import Link from "next/link";
import { Package, ClipboardList, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

 
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30 p-6 flex flex-col gap-6 justify-between">
        <div className="flex items-center gap-2 font-display font-semibold">
          <Leaf className="h-5 w-5 text-primary" strokeWidth={1.75} />
          Admin Panel
        </div>
        <nav className="flex flex-col h-full gap-1">
          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            <Package className="h-4 w-4" strokeWidth={1.75} />
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            <ClipboardList className="h-4 w-4" strokeWidth={1.75} />
            Orders
          </Link>
        </nav>

        <Button variant={"destructive"} >Logout</Button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
