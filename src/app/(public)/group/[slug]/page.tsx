import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/db";
import { RentalForm } from "@/components/forms/rental-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getGroup(slug: string) {
  const group = await prisma.group.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      archived: true,
    },
  });
  return group;
}

export default async function PublicFormPage({ params }: PageProps) {
  const { slug } = await params;
  const group = await getGroup(slug);

  if (!group) {
    notFound();
  }

  if (group.archived) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⛷️</span>
          </div>
          <h1 className="text-2xl font-semibold">Form Closed</h1>
          <p className="text-muted-foreground max-w-md">
            This rental group has been completed. If you believe this is an error,
            please contact Mountain Threads directly.
          </p>
        </div>
      </div>
    );
  }

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
              <p className="text-sm text-muted-foreground">Gear Rental Form</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-border p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">{group.name}</h2>
            <p className="text-sm text-muted-foreground">
              Please fill out the form below to complete your rental reservation.
            </p>
          </div>

          <RentalForm groupId={group.id} />
        </div>
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
