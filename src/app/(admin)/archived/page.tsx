import { Header } from "@/components/admin/header";
import { StatusIcons } from "@/components/admin/status-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getArchivedGroups() {
  return prisma.group.findMany({
    where: { archived: true },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { submissions: true },
      },
    },
  });
}

export default async function ArchivedPage() {
  const groups = await getArchivedGroups();

  return (
    <div className="flex flex-col">
      <Header
        title="Archived Groups"
        description="Completed rentals and past groups"
      />

      <div className="p-6">
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Archived Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No archived groups yet.
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
                      {group._count.submissions}
                    </TableCell>
                    <TableCell>
                      <StatusIcons
                        paid={group.paid}
                        pickedUp={group.pickedUp}
                        returned={group.returned}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(group.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/groups/${group.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
