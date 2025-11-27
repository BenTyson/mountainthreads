import { Header } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusIcons } from "@/components/admin/status-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import Link from "next/link";
import { CreateGroupButton } from "@/components/admin/create-group-button";
import { ArchiveGroupButton } from "@/components/admin/archive-group-button";
import { GroupFilters } from "@/components/admin/group-filters";
import { Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sort?: string;
  }>;
}

async function getGroups(search?: string, status?: string, sort?: string) {
  // Build where clause
  const where: Prisma.GroupWhereInput = { archived: false };

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (status === "unpaid") {
    where.paid = false;
  } else if (status === "paid") {
    where.paid = true;
    where.pickedUp = false;
  } else if (status === "picked-up") {
    where.pickedUp = true;
    where.returned = false;
  } else if (status === "returned") {
    where.returned = true;
  }

  // Build orderBy clause
  let orderBy: Prisma.GroupOrderByWithRelationInput = { createdAt: "desc" };

  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "name-asc") {
    orderBy = { name: "asc" };
  } else if (sort === "name-desc") {
    orderBy = { name: "desc" };
  } else if (sort === "departure") {
    orderBy = { rentalStartDate: "asc" };
  }

  const groups = await prisma.group.findMany({
    where,
    orderBy,
    include: {
      _count: {
        select: { submissions: true },
      },
    },
  });

  // Sort by submissions count (can't do this in Prisma directly)
  if (sort === "submissions") {
    groups.sort((a, b) => b._count.submissions - a._count.submissions);
  }

  return groups;
}

export default async function GroupsPage({ searchParams }: PageProps) {
  const { search, status, sort } = await searchParams;
  const groups = await getGroups(search, status, sort);

  return (
    <div className="flex flex-col">
      <Header
        title="Groups"
        description="Manage your rental groups"
        action={<CreateGroupButton />}
      />

      <div className="p-4 sm:p-6">
        <GroupFilters />

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Form Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No groups yet. Create your first group to get started.
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <Link
                        href={`/groups/${group.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {group.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {group._count.submissions}{group.expectedSize ? `/${group.expectedSize}` : ""}
                    </TableCell>
                    <TableCell>
                      <StatusIcons
                        paid={group.paid}
                        pickedUp={group.pickedUp}
                        returned={group.returned}
                      />
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        /group/{group.slug}
                      </code>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/groups/${group.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        <ArchiveGroupButton groupId={group.id} groupName={group.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {groups.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No groups yet. Create your first group to get started.
              </CardContent>
            </Card>
          ) : (
            groups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Link
                        href={`/groups/${group.id}`}
                        className="font-medium text-base hover:text-primary"
                      >
                        {group.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        Submissions: {group._count.submissions}{group.expectedSize ? `/${group.expectedSize}` : ""}
                      </p>
                    </div>
                    <StatusIcons
                      paid={group.paid}
                      pickedUp={group.pickedUp}
                      returned={group.returned}
                    />
                  </div>

                  <div className="mb-3">
                    <code className="text-xs bg-muted px-2 py-1 rounded block w-fit">
                      /group/{group.slug}
                    </code>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/groups/${group.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <ArchiveGroupButton groupId={group.id} groupName={group.name} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
