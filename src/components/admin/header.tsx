import { MobileNav } from "@/components/admin/mobile-nav";

interface HeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <header className="flex h-14 lg:h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{description}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
        {action}
      </div>
    </header>
  );
}
