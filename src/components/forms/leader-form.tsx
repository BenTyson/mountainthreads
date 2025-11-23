"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Plus } from "lucide-react";
import { MemberFields, MemberData, emptyMemberData } from "./member-fields";

interface LeaderFormProps {
  groupId: string;
  leaderName?: string;
  leaderEmail?: string;
}

export function LeaderForm({ groupId, leaderName, leaderEmail }: LeaderFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Rental details
  const [rentalStartDate, setRentalStartDate] = useState("");
  const [rentalEndDate, setRentalEndDate] = useState("");
  const [skiResort, setSkiResort] = useState("");

  // Leader's own sizing data (pre-filled with name/email if available)
  const [leaderData, setLeaderData] = useState<MemberData>({
    ...emptyMemberData,
    firstName: leaderName?.split(" ")[0] || "",
    lastName: leaderName?.split(" ").slice(1).join(" ") || "",
    email: leaderEmail || "",
  });

  // Family members
  const [familyMembers, setFamilyMembers] = useState<MemberData[]>([]);

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { ...emptyMemberData }]);
  };

  const updateFamilyMember = (index: number, data: MemberData) => {
    const newMembers = [...familyMembers];
    newMembers[index] = data;
    setFamilyMembers(newMembers);
  };

  const removeFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Submit leader's data (with rental details)
      const leaderResponse = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          email: leaderData.email,
          isLeader: true,
          data: {
            ...leaderData,
            rentalStartDate,
            rentalEndDate,
            skiResort,
          },
        }),
      });

      if (!leaderResponse.ok) {
        throw new Error("Failed to submit leader form");
      }

      // Submit each family member as a separate submission
      for (const member of familyMembers) {
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
          throw new Error("Failed to submit family member form");
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Rental Details Section */}
      <div className="space-y-4 p-4 border rounded-lg bg-background">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Rental Details
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Rental Start Date *</Label>
            <Input
              type="date"
              value={rentalStartDate}
              onChange={(e) => setRentalStartDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Rental Return Date *</Label>
            <Input
              type="date"
              value={rentalEndDate}
              onChange={(e) => setRentalEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Ski Resort *</Label>
          <Input
            placeholder="Enter the name of the ski resort"
            value={skiResort}
            onChange={(e) => setSkiResort(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Leader's Personal Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Your Information (Group Leader)</h3>
        <MemberFields
          data={leaderData}
          onChange={setLeaderData}
          showRemove={false}
        />
      </div>

      {/* Additional People */}
      {familyMembers.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Additional People</h3>
          {familyMembers.map((member, index) => (
            <MemberFields
              key={index}
              data={member}
              onChange={(data) => updateFamilyMember(index, data)}
              onRemove={() => removeFamilyMember(index)}
              showRemove={true}
              title={`Additional Person ${index + 1}`}
              emailRequired={false}
            />
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={addFamilyMember}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Additional Person
      </Button>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading
          ? "Submitting..."
          : `Submit ${familyMembers.length > 0 ? `${familyMembers.length + 1} Forms` : "Form"}`
        }
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By submitting this form, you agree to Mountain Threads&apos; rental terms and conditions.
      </p>
    </form>
  );
}
