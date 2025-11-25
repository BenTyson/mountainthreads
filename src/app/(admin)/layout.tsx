import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border bg-white py-4 px-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mountain Threads. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
