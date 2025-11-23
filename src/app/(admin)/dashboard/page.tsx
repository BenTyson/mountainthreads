import { Header } from "@/components/admin/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, Clock, Archive } from "lucide-react";
import prisma from "@/lib/db";
import Link from "next/link";

async function getStats() {
  const [
    totalGroups,
    activeGroups,
    archivedGroups,
    pendingPayment,
    pendingPickup,
    totalSubmissions,
    recentGroups,
  ] = await Promise.all([
    prisma.group.count(),
    prisma.group.count({ where: { archived: false } }),
    prisma.group.count({ where: { archived: true } }),
    prisma.group.count({ where: { archived: false, paid: false } }),
    prisma.group.count({ where: { archived: false, paid: true, pickedUp: false } }),
    prisma.formSubmission.count(),
    prisma.group.findMany({
      where: { archived: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    }),
  ]);

  return {
    totalGroups,
    activeGroups,
    archivedGroups,
    pendingPayment,
    pendingPickup,
    totalSubmissions,
    recentGroups,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="flex flex-col">
      <Header
        title="Dashboard"
        description="Overview of your rental groups"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Groups
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGroups}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalSubmissions} total submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Payment
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayment}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ready for Pickup
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPickup}</div>
              <p className="text-xs text-muted-foreground">
                Paid, not picked up
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Archived
              </CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.archivedGroups}</div>
              <p className="text-xs text-muted-foreground">
                Completed rentals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground">No groups yet. Create your first group to get started.</p>
              ) : (
                stats.recentGroups.map((group) => (
                  <Link
                    key={group.id}
                    href={`/groups/${group.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {group._count.submissions} submission{group._count.submissions !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {group.paid ? (
                        <Badge variant="default" className="bg-success">Paid</Badge>
                      ) : (
                        <Badge variant="secondary">Unpaid</Badge>
                      )}
                      {group.pickedUp && (
                        <Badge variant="default" className="bg-primary">Picked Up</Badge>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
