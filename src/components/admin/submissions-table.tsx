"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, TableIcon, LayoutGrid } from "lucide-react";

interface Submission {
  id: string;
  email: string | null;
  data: unknown;
  createdAt: Date;
}

interface SubmissionsTableProps {
  submissions: Submission[];
}

function SubmissionDetail({ submission }: { submission: Submission }) {
  const data = submission.data as Record<string, unknown>;

  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) {
      return (
        <div className="space-y-2">
          {value.map((item, i) => (
            <Card key={i} className="bg-muted/50">
              <CardContent className="p-3">
                {typeof item === "object" ? (
                  <div className="grid gap-1">
                    {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">
                          {k.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span>{renderValue(v)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  String(item)
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    if (typeof value === "object") {
      return (
        <div className="grid gap-1">
          {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-muted-foreground capitalize">
                {k.replace(/([A-Z])/g, " $1").trim()}:
              </span>
              <span>{renderValue(v)}</span>
            </div>
          ))}
        </div>
      );
    }
    return String(value);
  };

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <h4 className="font-medium capitalize mb-1">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </h4>
          <div className="text-sm">{renderValue(value)}</div>
        </div>
      ))}
    </div>
  );
}

function SubmissionCard({ submission, onView }: { submission: Submission; onView: () => void }) {
  const data = submission.data as Record<string, unknown>;
  const name = data.firstName
    ? `${data.firstName} ${data.lastName || ""}`
    : submission.email || "Anonymous";

  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={onView}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{name}</h4>
            {submission.email && (
              <p className="text-sm text-muted-foreground">{submission.email}</p>
            )}
          </div>
          <Badge variant="secondary">
            {new Date(submission.createdAt).toLocaleDateString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [view, setView] = useState<"table" | "cards">("table");

  if (submissions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No submissions yet. Share the form link with group members.
      </p>
    );
  }

  return (
    <>
      <Tabs value={view} onValueChange={(v) => setView(v as "table" | "cards")}>
        <div className="flex justify-end mb-4">
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="table" className="gap-2">
              <TableIcon className="h-4 w-4" />
              Table
            </TabsTrigger>
            <TabsTrigger value="cards" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Cards
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="table" className="m-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => {
                  const data = submission.data as Record<string, unknown>;
                  const name = data.firstName
                    ? `${data.firstName} ${data.lastName || ""}`
                    : "—";
                  return (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell>{submission.email || "—"}</TableCell>
                      <TableCell>
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="cards" className="m-0">
          <div className="grid gap-4 sm:grid-cols-2">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                onView={() => setSelectedSubmission(submission)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && <SubmissionDetail submission={selectedSubmission} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
