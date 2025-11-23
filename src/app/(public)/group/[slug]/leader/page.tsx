import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { LeaderForm } from "@/components/forms/leader-form";

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
      leaderName: true,
      leaderEmail: true,
    },
  });
  return group;
}

export default async function LeaderFormPage({ params }: PageProps) {
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">MT</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Mountain Threads</h1>
              <p className="text-sm text-muted-foreground">Group Leader Form</p>
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
              As the group leader, please provide the rental details and your sizing information below.
              You can also add family members to your submission.
            </p>
          </div>

          <LeaderForm
            groupId={group.id}
            leaderName={group.leaderName || undefined}
            leaderEmail={group.leaderEmail || undefined}
          />
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
