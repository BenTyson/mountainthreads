import Image from "next/image";

interface FormLayoutProps {
  children: React.ReactNode;
  subtitle: string;
}

export function FormLayout({ children, subtitle }: FormLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logos/IconMT.png"
              alt="Mountain Threads"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl font-semibold">Mountain Threads</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mountain Threads. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

interface FormClosedProps {
  message?: string;
}

export function FormClosed({ message }: FormClosedProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">⛷️</span>
        </div>
        <h1 className="text-2xl font-semibold">Form Closed</h1>
        <p className="text-muted-foreground max-w-md">
          {message || "This rental group has been completed. If you believe this is an error, please contact Mountain Threads directly."}
        </p>
      </div>
    </div>
  );
}
