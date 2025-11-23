"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Archive, Trash2 } from "lucide-react";

interface Group {
  id: string;
  paid: boolean;
  pickedUp: boolean;
  returned: boolean;
  archived: boolean;
}

export function GroupActions({ group }: { group: Group }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateGroup = async (field: string, value: boolean) => {
    setLoading(true);
    try {
      await fetch(`/api/groups/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update group:", error);
    } finally {
      setLoading(false);
    }
  };

  const archiveGroup = async () => {
    if (!confirm("Are you sure you want to archive this group?")) return;
    await updateGroup("archived", true);
    router.push("/groups");
  };

  const deleteGroup = async () => {
    if (!confirm("Are you sure you want to permanently delete this group? This cannot be undone.")) return;
    setLoading(true);
    try {
      await fetch(`/api/groups/${group.id}`, { method: "DELETE" });
      router.push("/groups");
    } catch (error) {
      console.error("Failed to delete group:", error);
      setLoading(false);
    }
  };

  if (group.archived) {
    return (
      <div className="space-y-4">
        <Badge variant="secondary" className="text-sm">
          This group has been archived
        </Badge>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateGroup("archived", false)}
            disabled={loading}
          >
            Restore Group
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={deleteGroup}
            disabled={loading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="paid" className="text-sm font-medium">Paid</Label>
          <Switch
            id="paid"
            checked={group.paid}
            onCheckedChange={(checked) => updateGroup("paid", checked)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="pickedUp" className="text-sm font-medium">Picked Up</Label>
          <Switch
            id="pickedUp"
            checked={group.pickedUp}
            onCheckedChange={(checked) => updateGroup("pickedUp", checked)}
            disabled={loading || !group.paid}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="returned" className="text-sm font-medium">Returned</Label>
          <Switch
            id="returned"
            checked={group.returned}
            onCheckedChange={(checked) => updateGroup("returned", checked)}
            disabled={loading || !group.pickedUp}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={archiveGroup}
          disabled={loading}
          className="text-muted-foreground w-full"
        >
          <Archive className="mr-2 h-4 w-4" />
          Archive Group
        </Button>
      </div>
    </div>
  );
}
