"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus } from "lucide-react";
import { MemberFields, MemberData, emptyMemberData } from "./member-fields";

interface RentalFormProps {
  groupId: string;
}

export function RentalForm({ groupId }: RentalFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [members, setMembers] = useState<MemberData[]>([{ ...emptyMemberData }]);

  const updateMember = (index: number, data: MemberData) => {
    const newMembers = [...members];
    newMembers[index] = data;
    setMembers(newMembers);
  };

  const addMember = () => {
    setMembers([...members, { ...emptyMemberData }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Submit each member as a separate submission
      for (const member of members) {
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupId,
            email: member.email,
            isLeader: false,
            data: member,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit form");
        }
      }

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-semibold">Thank You!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your rental form has been submitted successfully. The Mountain Threads
          team will have your gear ready for pickup.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {members.map((member, index) => (
        <MemberFields
          key={index}
          data={member}
          onChange={(data) => updateMember(index, data)}
          onRemove={() => removeMember(index)}
          showRemove={members.length > 1}
          title={members.length > 1 ? `Person ${index + 1}` : undefined}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addMember}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Another Person
      </Button>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Submitting..." : `Submit ${members.length > 1 ? `${members.length} Forms` : "Form"}`}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By submitting this form, you agree to Mountain Threads&apos; rental terms and conditions.
      </p>
    </form>
  );
}
