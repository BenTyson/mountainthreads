"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Group } from "@/lib/types";

type EditGroupButtonProps = {
  group: Pick<Group, "id" | "name" | "leaderName" | "leaderEmail" | "expectedSize" | "rentalStartDate" | "rentalEndDate" | "skiResort">;
};

function formatDateForInput(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export function EditGroupButton({ group }: EditGroupButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(group.name);
  const [leaderName, setLeaderName] = useState(group.leaderName || "");
  const [leaderEmail, setLeaderEmail] = useState(group.leaderEmail || "");
  const [expectedSize, setExpectedSize] = useState(
    group.expectedSize?.toString() || ""
  );
  const [rentalStartDate, setRentalStartDate] = useState(
    formatDateForInput(group.rentalStartDate)
  );
  const [rentalEndDate, setRentalEndDate] = useState(
    formatDateForInput(group.rentalEndDate)
  );
  const [skiResort, setSkiResort] = useState(group.skiResort || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          leaderName: leaderName || null,
          leaderEmail: leaderEmail || null,
          expectedSize: expectedSize ? parseInt(expectedSize, 10) : null,
          rentalStartDate: rentalStartDate || null,
          rentalEndDate: rentalEndDate || null,
          skiResort: skiResort || null,
        }),
      });

      if (response.ok) {
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update group:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full h-full sm:h-auto sm:max-w-[500px] sm:rounded-lg overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>
              Update group details. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Group Details Section */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Group Details
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Group Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expectedSize">Expected Size</Label>
                  <Input
                    id="expectedSize"
                    type="number"
                    min="1"
                    value={expectedSize}
                    onChange={(e) => setExpectedSize(e.target.value)}
                    placeholder="e.g., 4"
                  />
                </div>
              </div>
            </div>

            {/* Group Leader Section */}
            <div className="border-t pt-4 space-y-4">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Group Leader
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="leaderName">Leader Name</Label>
                  <Input
                    id="leaderName"
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    placeholder="John Tyson"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="leaderEmail">Leader Email</Label>
                  <Input
                    id="leaderEmail"
                    type="email"
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Rental Details Section */}
            <div className="border-t pt-4 space-y-4">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Rental Details
              </p>
              <div className="grid gap-2">
                <Label htmlFor="skiResort">Ski Resort</Label>
                <Input
                  id="skiResort"
                  value={skiResort}
                  onChange={(e) => setSkiResort(e.target.value)}
                  placeholder="e.g., Park City"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="rentalStartDate">Start Date</Label>
                  <Input
                    id="rentalStartDate"
                    type="date"
                    value={rentalStartDate}
                    onChange={(e) => setRentalStartDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rentalEndDate">End Date</Label>
                  <Input
                    id="rentalEndDate"
                    type="date"
                    value={rentalEndDate}
                    onChange={(e) => setRentalEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
