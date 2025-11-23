"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export function CreateGroupButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [emails, setEmails] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          leaderName,
          leaderEmail,
          emails: emails
            .split(/[,\n]/)
            .map((e) => e.trim())
            .filter((e) => e),
        }),
      });

      if (response.ok) {
        const group = await response.json();
        setOpen(false);
        setName("");
        setLeaderName("");
        setLeaderEmail("");
        setEmails("");
        router.refresh();
        router.push(`/groups/${group.id}`);
      }
    } catch (error) {
      console.error("Failed to create group:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a rental group with a leader and invite members.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Tyson Family"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Group Leader (Primary Contact)</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="leaderName">Leader Name *</Label>
                  <Input
                    id="leaderName"
                    placeholder="John Tyson"
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="leaderEmail">Leader Email *</Label>
                  <Input
                    id="leaderEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid gap-2">
                <Label htmlFor="emails">Other Member Emails (optional)</Label>
                <Textarea
                  id="emails"
                  placeholder="Enter email addresses, one per line or comma-separated"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Additional group members. You can add more later.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name || !leaderName || !leaderEmail}>
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
