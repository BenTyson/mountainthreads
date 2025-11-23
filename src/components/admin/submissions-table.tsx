"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, TableIcon, LayoutGrid, Pencil, Trash2 } from "lucide-react";
import {
  CLOTHING_TYPES,
  SHOE_SIZES,
  JACKET_SIZES,
  PANT_SIZES,
  BIB_SIZES,
  GLOVE_SIZES,
  GOGGLE_OPTIONS,
  HELMET_SIZES,
  YOUTH_GENDERS,
  usesPants,
  type ClothingType,
} from "@/lib/form-options";

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

function SubmissionCard({
  submission,
  onView,
  onEdit,
  onDelete
}: {
  submission: Submission;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const data = submission.data as Record<string, unknown>;
  const name = data.firstName
    ? `${data.firstName} ${data.lastName || ""}`
    : submission.email || "Anonymous";

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="cursor-pointer" onClick={onView}>
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
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onView} title="View details">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit} title="Edit submission">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              title="Delete submission"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EditSubmissionForm({
  editData,
  setEditData,
}: {
  editData: Record<string, unknown>;
  setEditData: (data: Record<string, unknown>) => void;
}) {
  const clothingType = (editData.clothingType as ClothingType) || "mens";
  const showPants = clothingType && usesPants(clothingType);
  const showBibs = clothingType && !usesPants(clothingType);
  const isYouth = clothingType === "youth";

  const updateField = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>First Name</Label>
          <Input
            value={(editData.firstName as string) || ""}
            onChange={(e) => updateField("firstName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input
            value={(editData.lastName as string) || ""}
            onChange={(e) => updateField("lastName", e.target.value)}
          />
        </div>
      </div>

      {/* Clothing Type & Gender */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Clothing Type</Label>
          <Select
            value={(editData.clothingType as string) || ""}
            onValueChange={(v) => updateField("clothingType", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {CLOTHING_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Gender {!isYouth && <span className="text-muted-foreground text-xs">(Youth only)</span>}</Label>
          <Select
            value={(editData.youthGender as string) || ""}
            onValueChange={(v) => updateField("youthGender", v)}
            disabled={!isYouth}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isYouth ? "Select gender" : "N/A"} />
            </SelectTrigger>
            <SelectContent>
              {YOUTH_GENDERS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Jacket & Shoe */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Jacket Size</Label>
          <Select
            value={(editData.jacketSize as string) || ""}
            onValueChange={(v) => updateField("jacketSize", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {JACKET_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Shoe Size</Label>
          <Select
            value={(editData.shoeSize as string) || ""}
            onValueChange={(v) => updateField("shoeSize", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {clothingType && SHOE_SIZES[clothingType]?.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pants/Bibs & Gloves */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{showBibs ? "Bib Size" : "Pant Size"}</Label>
          {showPants && (
            <Select
              value={(editData.pantSize as string) || ""}
              onValueChange={(v) => updateField("pantSize", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {PANT_SIZES.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {showBibs && (
            <Select
              value={(editData.bibSize as string) || ""}
              onValueChange={(v) => updateField("bibSize", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {(clothingType === "youth" || clothingType === "toddler") &&
                  BIB_SIZES[clothingType]?.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="space-y-2">
          <Label>Glove Size</Label>
          <Select
            value={(editData.gloveSize as string) || ""}
            onValueChange={(v) => updateField("gloveSize", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {clothingType && GLOVE_SIZES[clothingType]?.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Helmet & Goggles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Helmet Size</Label>
          <Select
            value={(editData.helmetSize as string) || ""}
            onValueChange={(v) => updateField("helmetSize", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {clothingType && HELMET_SIZES[clothingType]?.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Goggles</Label>
          <Select
            value={(editData.goggles as string) || ""}
            onValueChange={(v) => updateField("goggles", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {GOGGLE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const router = useRouter();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [deletingSubmission, setDeletingSubmission] = useState<Submission | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [view, setView] = useState<"table" | "cards">("table");
  const [loading, setLoading] = useState(false);

  const handleEdit = (submission: Submission) => {
    setEditingSubmission(submission);
    setEditData(submission.data as Record<string, unknown>);
  };

  const handleSaveEdit = async () => {
    if (!editingSubmission) return;
    setLoading(true);
    try {
      await fetch(`/api/submissions/${editingSubmission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: editData }),
      });
      setEditingSubmission(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to update submission:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSubmission) return;
    setLoading(true);
    try {
      await fetch(`/api/submissions/${deletingSubmission.id}`, {
        method: "DELETE",
      });
      setDeletingSubmission(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete submission:", error);
    } finally {
      setLoading(false);
    }
  };

  const clothingTypes: Record<string, string> = {
    mens: "Men's",
    womens: "Women's",
    youth: "Youth",
    toddler: "Toddler",
  };

  const genderTypes: Record<string, string> = {
    boys: "Boys",
    girls: "Girls",
  };

  const gogglesTypes: Record<string, string> = {
    standard: "Std",
    "over-glasses": "OTG",
  };

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
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Jacket</TableHead>
                  <TableHead>Pants</TableHead>
                  <TableHead>Bibs</TableHead>
                  <TableHead>Shoe</TableHead>
                  <TableHead>Gloves</TableHead>
                  <TableHead>Helmet</TableHead>
                  <TableHead>Goggles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => {
                  const data = submission.data as Record<string, unknown>;
                  const name = data.firstName
                    ? `${data.firstName} ${data.lastName || ""}`
                    : "—";
                  const clothingType = data.clothingType
                    ? clothingTypes[data.clothingType as string] || String(data.clothingType)
                    : "—";
                  const gender = data.youthGender
                    ? genderTypes[data.youthGender as string] || String(data.youthGender)
                    : "—";
                  const goggles = data.goggles
                    ? gogglesTypes[data.goggles as string] || String(data.goggles)
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
                      <TableCell>{clothingType}</TableCell>
                      <TableCell>{gender}</TableCell>
                      <TableCell>{(data.jacketSize as string) || "—"}</TableCell>
                      <TableCell>{(data.pantSize as string) || "—"}</TableCell>
                      <TableCell>{(data.bibSize as string) || "—"}</TableCell>
                      <TableCell>{(data.shoeSize as string) || "—"}</TableCell>
                      <TableCell>{(data.gloveSize as string) || "—"}</TableCell>
                      <TableCell>{(data.helmetSize as string) || "—"}</TableCell>
                      <TableCell>{goggles}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(submission)}
                            title="Edit submission"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingSubmission(submission)}
                            title="Delete submission"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
                onEdit={() => handleEdit(submission)}
                onDelete={() => setDeletingSubmission(submission)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && <SubmissionDetail submission={selectedSubmission} />}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingSubmission} onOpenChange={() => setEditingSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Submission</DialogTitle>
          </DialogHeader>
          {editingSubmission && (
            <EditSubmissionForm editData={editData} setEditData={setEditData} />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSubmission(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingSubmission} onOpenChange={() => setDeletingSubmission(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this submission? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
