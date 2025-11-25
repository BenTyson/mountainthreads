import { Header } from "@/components/admin/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Clock, Archive, CalendarDays, ArrowRight } from "lucide-react";
import prisma from "@/lib/db";
import Link from "next/link";
import { StatusIcons } from "@/components/admin/status-icons";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

async function getStats() {
  const now = new Date();
  const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const [
    activeGroups,
    archivedGroups,
    pendingPayment,
    pendingPickup,
    totalSubmissions,
    upcomingGroups,
  ] = await Promise.all([
    prisma.group.count({ where: { archived: false } }),
    prisma.group.count({ where: { archived: true } }),
    prisma.group.count({ where: { archived: false, paid: false } }),
    prisma.group.count({ where: { archived: false, paid: true, pickedUp: false } }),
    prisma.formSubmission.count(),
    prisma.group.findMany({
      where: {
        archived: false,
        rentalStartDate: {
          gte: now,
          lte: fourteenDaysFromNow,
        },
      },
      orderBy: { rentalStartDate: "asc" },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    }),
  ]);

  return {
    activeGroups,
    archivedGroups,
    pendingPayment,
    pendingPickup,
    totalSubmissions,
    upcomingGroups,
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
        {/* Stats Grid - Compact */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.activeGroups}</p>
              </div>
              <Users className="h-5 w-5 text-primary" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Unpaid</p>
                <p className="text-2xl font-bold">{stats.pendingPayment}</p>
              </div>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Ready</p>
                <p className="text-2xl font-bold">{stats.pendingPickup}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Archived</p>
                <p className="text-2xl font-bold">{stats.archivedGroups}</p>
              </div>
              <Archive className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Upcoming Groups */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4" />
              Upcoming Groups (Next 2 Weeks)
            </CardTitle>
            <Link href="/groups">
              <Button variant="outline" size="sm" className="gap-2">
                View All Groups
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.upcomingGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No groups departing in the next 2 weeks.
              </p>
            ) : (
              <div className="space-y-2">
                {stats.upcomingGroups.map((group) => (
                  <Link
                    key={group.id}
                    href={`/groups/${group.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center bg-primary/10 rounded px-2 py-1 min-w-[50px]">
                        <p className="text-xs text-muted-foreground">
                          {group.rentalStartDate ? new Date(group.rentalStartDate).toLocaleDateString("en-US", { month: "short" }) : ""}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {group.rentalStartDate ? new Date(group.rentalStartDate).getDate() : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {group._count.submissions}{group.expectedSize ? `/${group.expectedSize}` : ""} people
                        </p>
                      </div>
                    </div>
                    <StatusIcons
                      paid={group.paid}
                      pickedUp={group.pickedUp}
                      returned={group.returned}
                      size="sm"
                    />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
