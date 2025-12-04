"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Plus, User, Users, ArrowLeft, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberFields, MemberData, emptyMemberData } from "./member-fields";

interface LeaderFormProps {
  groupId: string;
  leaderName?: string;
  leaderEmail?: string;
}

type FormMode = "select" | "individual" | "crew";

export function LeaderForm({ groupId, leaderName, leaderEmail }: LeaderFormProps) {
  const [formMode, setFormMode] = useState<FormMode>("select");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showCrewInfo, setShowCrewInfo] = useState(false);

  // Rental details
  const [rentalStartDate, setRentalStartDate] = useState("");
  const [rentalEndDate, setRentalEndDate] = useState("");
  const [skiResort, setSkiResort] = useState("");
  const [crewName, setCrewName] = useState("");

  // Members (first one is pre-filled with leader info if available)
  const [members, setMembers] = useState<MemberData[]>([{
    ...emptyMemberData,
    firstName: leaderName?.split(" ")[0] || "",
    lastName: leaderName?.split(" ").slice(1).join(" ") || "",
    email: leaderEmail || "",
  }]);

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

  const resetForm = () => {
    setFormMode("select");
    setCrewName("");
    setMembers([{
      ...emptyMemberData,
      firstName: leaderName?.split(" ")[0] || "",
      lastName: leaderName?.split(" ").slice(1).join(" ") || "",
      email: leaderEmail || "",
    }]);
    setError("");
  };

  const handleSubmitIndividual = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          email: members[0].email,
          isLeader: true,
          data: {
            ...members[0],
            rentalStartDate,
            rentalEndDate,
            skiResort,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCrew = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First member is the crew leader - submit them first to create the crew
      const firstMember = members[0];
      const leaderResponse = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          email: firstMember.email,
          isLeader: true,
          isCrewLeader: true,
          crewName: crewName || null,
          data: {
            ...firstMember,
            rentalStartDate,
            rentalEndDate,
            skiResort,
          },
        }),
      });

      if (!leaderResponse.ok) {
        throw new Error("Failed to submit form");
      }

      const leaderSubmission = await leaderResponse.json();
      const crewId = leaderSubmission.crewId;

      // Submit remaining members as crew members
      for (let i = 1; i < members.length; i++) {
        const member = members[i];
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupId,
            email: member.email,
            isLeader: false,
            crewId,
            paysSeparately: member.paysSeparately ?? false,
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

  // Rental Details Section (shared between individual and crew modes)
  const RentalDetailsSection = () => (
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
        <Label>Ski Resort</Label>
        <Input
          placeholder="e.g., Park City, Deer Valley (optional)"
          value={skiResort}
          onChange={(e) => setSkiResort(e.target.value)}
        />
      </div>
    </div>
  );

  // Success state
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

  // Mode selection screen
  if (formMode === "select") {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Are you filling out this form for...</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setFormMode("individual")}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                <User className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Just Myself</h3>
              <p className="text-sm text-muted-foreground">
                I&apos;m filling out my own rental form
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setFormMode("crew")}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">My Crew / Family</h3>
              <p className="text-sm text-muted-foreground">
                I&apos;m filling out forms for multiple people
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Members of a crew often pay together and have their gear packed in the same bag.
        </p>
      </div>
    );
  }

  // Individual form
  if (formMode === "individual") {
    return (
      <form onSubmit={handleSubmitIndividual} className="space-y-6">
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Change
        </button>

        <RentalDetailsSection />

        <MemberFields
          data={members[0]}
          onChange={(data) => updateMember(0, data)}
          showRemove={false}
          emailRequired={true}
          isCrewMember={false}
        />

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Submitting..." : "Submit Gear Specs"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By submitting this form, you agree to Mountain Threads&apos; rental terms and conditions.
        </p>
      </form>
    );
  }

  // Crew form
  return (
    <form onSubmit={handleSubmitCrew} className="space-y-6">
      <button
        type="button"
        onClick={resetForm}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Change
      </button>

      <RentalDetailsSection />

      {/* Crew Name field */}
      <div className="space-y-2 p-4 border rounded-lg bg-background">
        <div className="flex items-center">
          <Label>Crew Name</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-foreground"
            onClick={() => setShowCrewInfo(true)}
            title="What's a crew?"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
        <Input
          placeholder="e.g., Smith Family (optional)"
          value={crewName}
          onChange={(e) => setCrewName(e.target.value)}
        />
      </div>

      {/* Crew Info Dialog */}
      <Dialog open={showCrewInfo} onOpenChange={setShowCrewInfo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Groups vs Crews</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium">What&apos;s a Group?</p>
              <p className="text-muted-foreground">
                A group is everyone traveling together on the same trip — like a scout troop,
                school outing, or company retreat.
              </p>
            </div>
            <div>
              <p className="font-medium">What&apos;s a Crew?</p>
              <p className="text-muted-foreground">
                A crew is a smaller unit within a group — typically a family or group of friends
                who pay together and want their gear packed in the same bag.
              </p>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Example:</span> A scout troop (the group)
                might have several families (crews) traveling together. Each family fills out
                their own crew form.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* First person (crew leader) */}
      <MemberFields
        data={members[0]}
        onChange={(data) => updateMember(0, data)}
        showRemove={false}
        emailRequired={true}
        isCrewMember={false}
      />

      {/* Additional crew members */}
      {members.slice(1).map((member, index) => (
        <MemberFields
          key={index + 1}
          data={member}
          onChange={(data) => updateMember(index + 1, data)}
          onRemove={() => removeMember(index + 1)}
          showRemove={true}
          title={`Crew Member ${index + 1}`}
          emailRequired={false}
          isCrewMember={true}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addMember}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add to My Crew
      </Button>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Submitting..." : "Submit Gear Specs"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By submitting this form, you agree to Mountain Threads&apos; rental terms and conditions.
      </p>
    </form>
  );
}
