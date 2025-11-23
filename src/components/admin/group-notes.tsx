"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface GroupNotesProps {
  groupId: string;
  initialNotes: string;
}

export function GroupNotes({ groupId, initialNotes }: GroupNotesProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges = notes !== initialNotes;

  const saveNotes = async () => {
    setSaving(true);
    try {
      await fetch(`/api/groups/${groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Add notes about this group..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        className="resize-none"
      />
      {hasChanges && (
        <Button size="sm" onClick={saveNotes} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Notes"}
        </Button>
      )}
    </div>
  );
}
