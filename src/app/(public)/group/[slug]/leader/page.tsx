import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { LeaderForm } from "@/components/forms/leader-form";
import { FormLayout, FormClosed } from "@/components/forms/form-layout";

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
    return <FormClosed />;
  }

  return (
    <FormLayout subtitle="Group Leader Form">
      <div className="bg-white rounded-lg border border-border p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">{group.name}</h2>
          <p className="text-sm text-muted-foreground">
            As the group leader, please provide the rental details and your sizing information below.
            You can also manually add additional people (family members, children, etc) here rather than sending them a separate form link.
          </p>
        </div>

        <LeaderForm
          groupId={group.id}
          leaderName={group.leaderName || undefined}
          leaderEmail={group.leaderEmail || undefined}
        />
      </div>
    </FormLayout>
  );
}
