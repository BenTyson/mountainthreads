import { notFound } from "next/navigation";
import { Header } from "@/components/admin/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { GroupActions } from "@/components/admin/group-actions";
import { GroupNotes } from "@/components/admin/group-notes";
import { SubmissionsTable } from "@/components/admin/submissions-table";
import { CopyLinkButton } from "@/components/admin/copy-link-button";
import { EditGroupButton } from "@/components/admin/edit-group-button";
import { ArrowLeft, User, Calendar, Mail, MapPin, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getGroup(id: string) {
  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      submissions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return group;
}

export default async function GroupDetailPage({ params }: PageProps) {
  const { id } = await params;
  const group = await getGroup(id);

  if (!group) {
    notFound();
  }

  const leaderFormUrl = `/group/${group.slug}/leader`;
  const memberFormUrl = `/group/${group.slug}`;
  const leaderSubmitted = group.submissions.some((s) => s.isLeader);

  return (
    <div className="flex flex-col">
      <Header
        title={group.name}
        description={group.archived ? "Archived group" : "Active rental group"}
        action={
          <div className="flex items-center gap-2">
            <EditGroupButton group={group} />
            <CopyLinkButton slug={group.slug} type="leader" label="Copy Leader Link" />
            <CopyLinkButton slug={group.slug} type="member" label="Copy Member Link" />
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Back link */}
        <Link
          href="/groups"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Groups
        </Link>

        {/* Submissions - Full Width */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {group.name} ({group.submissions.length}{group.expectedSize ? `/${group.expectedSize}` : ""})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SubmissionsTable submissions={group.submissions} />
          </CardContent>
        </Card>

        {/* Info Cards - Flow in columns */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Leader Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Group Leader
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-medium">{group.leaderName || "Not set"}</p>
                <p className="text-sm text-muted-foreground">{group.leaderEmail || ""}</p>
              </div>
              {leaderSubmitted ? (
                <p className="text-xs text-success font-medium">✓ Leader has submitted</p>
              ) : (
                <p className="text-xs text-warning font-medium">⏳ Awaiting leader submission</p>
              )}
            </CardContent>
          </Card>

          {/* Rental Details Card */}
          {(group.rentalStartDate || group.rentalEndDate || group.skiResort) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Rental Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {group.skiResort && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">{group.skiResort}</span>
                  </div>
                )}
                {group.rentalStartDate && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">
                      {new Date(group.rentalStartDate).toLocaleDateString()}
                      {group.rentalEndDate && ` - ${new Date(group.rentalEndDate).toLocaleDateString()}`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Form Links Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Form Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Link href={leaderFormUrl} target="_blank">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Leader
                  </Button>
                </Link>
                <Link href={memberFormUrl} target="_blank">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Member
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <CopyLinkButton slug={group.slug} type="leader" label="Copy" className="w-full text-xs" />
                <CopyLinkButton slug={group.slug} type="member" label="Copy" className="w-full text-xs" />
              </div>
            </CardContent>
          </Card>

          {/* Group Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Group Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">Created {new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
              {group.emails.length > 0 && (
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    {group.emails.length} member email{group.emails.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupActions group={group} />
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card className="sm:col-span-2 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupNotes groupId={group.id} initialNotes={group.notes || ""} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
