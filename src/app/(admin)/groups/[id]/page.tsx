import { notFound } from "next/navigation";
import { Header } from "@/components/admin/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { GroupActions } from "@/components/admin/group-actions";
import { GroupNotes } from "@/components/admin/group-notes";
import { SubmissionsTable } from "@/components/admin/submissions-table";
import { CopyLinkButton } from "@/components/admin/copy-link-button";
import { ArrowLeft, User, Calendar, Mail, MapPin, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
            <CopyLinkButton slug={group.slug} type="leader" label="Copy Leader Link" />
            <CopyLinkButton slug={group.slug} type="member" label="Copy Member Link" />
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Back link */}
        <Link
          href="/groups"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Groups
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submissions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  Submissions ({group.submissions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SubmissionsTable submissions={group.submissions} />
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <GroupActions group={group} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leader Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Group Leader
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{group.leaderName || "Not set"}</p>
                  <p className="text-sm text-muted-foreground">{group.leaderEmail || ""}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Leader Form URL:</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                    {leaderFormUrl}
                  </code>
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
                <CardHeader>
                  <CardTitle>Rental Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {group.skiResort && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Resort</p>
                        <p className="text-sm text-muted-foreground">{group.skiResort}</p>
                      </div>
                    </div>
                  )}
                  {group.rentalStartDate && (
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Rental Period</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(group.rentalStartDate).toLocaleDateString()}
                          {group.rentalEndDate && ` - ${new Date(group.rentalEndDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Form Links Card */}
            <Card>
              <CardHeader>
                <CardTitle>Form Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Member Form URL:</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                    {memberFormUrl}
                  </code>
                </div>
                <div className="flex gap-2">
                  <Link href={leaderFormUrl} target="_blank" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Leader Form
                    </Button>
                  </Link>
                  <Link href={memberFormUrl} target="_blank" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Member Form
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Group Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {group.emails.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Member Emails</p>
                      <div className="space-y-1 mt-1">
                        {group.emails.map((email, i) => (
                          <p key={i} className="text-sm text-muted-foreground">
                            {email}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes Card */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <GroupNotes groupId={group.id} initialNotes={group.notes || ""} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
