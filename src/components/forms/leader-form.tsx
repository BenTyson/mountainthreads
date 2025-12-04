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
  const [crewName, setCrewName] = useState("");

  // Leader's own sizing data (pre-filled with name/email if available)
  const [leaderData, setLeaderData] = useState<MemberData>({
    ...emptyMemberData,
    firstName: leaderName?.split(" ")[0] || "",
    lastName: leaderName?.split(" ").slice(1).join(" ") || "",
    email: leaderEmail || "",
  });

  // Crew members (previously called "family members")
  const [crewMembers, setCrewMembers] = useState<MemberData[]>([]);

  const addCrewMember = () => {
    setCrewMembers([...crewMembers, { ...emptyMemberData }]);
  };

  const updateCrewMember = (index: number, data: MemberData) => {
    const newMembers = [...crewMembers];
    newMembers[index] = data;
    setCrewMembers(newMembers);
  };

  const removeCrewMember = (index: number) => {
    setCrewMembers(crewMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Submit leader's data (with rental details) - this creates the crew
      const leaderResponse = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          email: leaderData.email,
          isLeader: true,
          isCrewLeader: true,
          crewName: crewName || null,
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

      const leaderSubmission = await leaderResponse.json();
      const crewId = leaderSubmission.crewId;

      // Submit each crew member as a separate submission in the same crew
      for (const member of crewMembers) {
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupId,
            email: member.email,
            isLeader: false,
            crewId, // Assign to the same crew as the leader
            paysSeparately: member.paysSeparately ?? false,
            data: member,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit crew member form");
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Ski Resort</Label>
            <Input
              placeholder="e.g., Park City, Deer Valley"
              value={skiResort}
              onChange={(e) => setSkiResort(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Crew Name</Label>
            <Input
              placeholder="e.g., Smith Family (optional)"
              value={crewName}
              onChange={(e) => setCrewName(e.target.value)}
            />
          </div>
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

      {/* My Crew */}
      {crewMembers.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">My Crew</h3>
          {crewMembers.map((member, index) => (
            <MemberFields
              key={index}
              data={member}
              onChange={(data) => updateCrewMember(index, data)}
              onRemove={() => removeCrewMember(index)}
              showRemove={true}
              title={`Crew Member ${index + 1}`}
              emailRequired={false}
              isCrewMember={true}
            />
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={addCrewMember}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add to My Crew
      </Button>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading
          ? "Submitting..."
          : `Submit ${crewMembers.length > 0 ? `${crewMembers.length + 1} Forms` : "Form"}`
        }
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By submitting this form, you agree to Mountain Threads&apos; rental terms and conditions.
      </p>
    </form>
  );
}
