import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar className="hidden lg:flex" />
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border bg-white py-2 lg:py-4 px-4 lg:px-6">
          <p className="text-center text-xs lg:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mountain Threads. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
