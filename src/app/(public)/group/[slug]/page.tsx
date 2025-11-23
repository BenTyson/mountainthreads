import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { RentalForm } from "@/components/forms/rental-form";
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
    return <FormClosed />;
  }

  return (
    <FormLayout subtitle="Gear Rental Form">
      <div className="bg-white rounded-lg border border-border p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">{group.name}</h2>
          <p className="text-sm text-muted-foreground">
            Please fill out the form below to complete your rental reservation.
          </p>
        </div>

        <RentalForm groupId={group.id} />
      </div>
    </FormLayout>
  );
}
