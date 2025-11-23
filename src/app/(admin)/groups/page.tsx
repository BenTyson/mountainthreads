import { Header } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Copy, ExternalLink } from "lucide-react";
import prisma from "@/lib/db";
import Link from "next/link";
import { CreateGroupButton } from "@/components/admin/create-group-button";

async function getGroups() {
  return prisma.group.findMany({
    where: { archived: false },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { submissions: true },
      },
    },
  });
}

export default async function GroupsPage() {
  const groups = await getGroups();

  return (
    <div className="flex flex-col">
      <Header
        title="Groups"
        description="Manage your rental groups"
        action={<CreateGroupButton />}
      />

      <div className="p-6">
        <div className="rounded-lg border border-border bg-white">
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
                      {group._count.submissions}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {group.paid ? (
                          <Badge className="bg-success text-white">Paid</Badge>
                        ) : (
                          <Badge variant="secondary">Unpaid</Badge>
                        )}
                        {group.pickedUp && (
                          <Badge className="bg-primary text-white">Picked Up</Badge>
                        )}
                        {group.returned && (
                          <Badge className="bg-muted-foreground text-white">Returned</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        /group/{group.slug}
                      </code>
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
