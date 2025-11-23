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
  isLeader: boolean;
  data: unknown;
  createdAt: Date;
}

interface SubmissionsTableProps {
  submissions: Submission[];
}

// Human-readable labels for form fields
const fieldLabels: Record<string, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phone: "Phone",
  clothingType: "Clothing Type",
  youthGender: "Gender",
  shoeSize: "Shoe Size",
  jacketSize: "Jacket Size",
  pantSize: "Pant Size",
  bibSize: "Bib Size",
  gloveSize: "Glove Size",
  goggles: "Goggles",
  helmetSize: "Helmet Size",
  sizingNotes: "Sizing Notes",
  paymentMethod: "Payment Method",
  rentalStartDate: "Rental Start Date",
  rentalEndDate: "Rental End Date",
  skiResort: "Ski Resort",
};

// Field display order
const fieldOrder = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "rentalStartDate",
  "rentalEndDate",
  "skiResort",
  "clothingType",
  "youthGender",
  "shoeSize",
  "jacketSize",
  "pantSize",
  "bibSize",
  "gloveSize",
  "goggles",
  "helmetSize",
  "sizingNotes",
  "paymentMethod",
];

function SubmissionDetail({ submission }: { submission: Submission }) {
  const data = submission.data as Record<string, unknown>;

  const formatValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    // Format clothing type
    if (key === "clothingType") {
      const types: Record<string, string> = {
        mens: "Men's",
        womens: "Women's",
        youth: "Youth",
        toddler: "Toddler",
      };
      return types[value as string] || String(value);
    }
    // Format youth gender
    if (key === "youthGender") {
      const genders: Record<string, string> = {
        boys: "Boys",
        girls: "Girls",
      };
      return genders[value as string] || String(value);
    }
    // Format goggles
    if (key === "goggles") {
      const options: Record<string, string> = {
        standard: "Standard",
        "over-glasses": "Over Glasses",
      };
      return options[value as string] || String(value);
    }
    // Format payment method
    if (key === "paymentMethod") {
      const options: Record<string, string> = {
        individually: "Individually",
        family: "For my family members",
        "entire-group": "Entire Group",
        "someone-else": "Someone Else is Paying for me",
      };
      return options[value as string] || String(value);
    }
    return String(value);
  };

  // Sort entries by field order
  const sortedEntries = Object.entries(data).sort((a, b) => {
    const indexA = fieldOrder.indexOf(a[0]);
    const indexB = fieldOrder.indexOf(b[0]);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Group fields into sections
  const personalFields = ["firstName", "lastName", "email", "phone"];
  const rentalFields = ["rentalStartDate", "rentalEndDate", "skiResort"];
  const sizingFields = [
    "clothingType",
    "youthGender",
    "shoeSize",
    "jacketSize",
    "pantSize",
    "bibSize",
    "gloveSize",
    "goggles",
    "helmetSize",
    "sizingNotes",
  ];
  const paymentFields = ["paymentMethod"];

  const renderSection = (title: string, fields: string[]) => {
    const sectionEntries = sortedEntries.filter(([key]) => fields.includes(key));
    if (sectionEntries.length === 0) return null;

    return (
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </h4>
        <div className="grid gap-2">
          {sectionEntries.map(([key, value]) => {
            const displayValue = formatValue(key, value);
            if (displayValue === "—") return null;
            return (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {fieldLabels[key] || key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className="font-medium">{displayValue}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {submission.isLeader && (
        <Badge className="bg-primary">Group Leader</Badge>
      )}
      {renderSection("Personal Information", personalFields)}
      {renderSection("Rental Details", rentalFields)}
      {renderSection("Sizing Information", sizingFields)}
      {renderSection("Payment", paymentFields)}
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
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{name}</h4>
              {submission.isLeader && (
                <Badge className="bg-primary text-xs">Leader</Badge>
              )}
            </div>
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
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {name}
                          {submission.isLeader && (
                            <Badge className="bg-primary text-xs">Leader</Badge>
                          )}
                        </div>
                      </TableCell>
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
