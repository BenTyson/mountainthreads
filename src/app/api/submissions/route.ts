import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface SubmissionData {
  rentalStartDate?: string;
  rentalEndDate?: string;
  skiResort?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      groupId,
      email,
      isLeader = false,
      data,
      // Crew-related fields
      crewId,
      crewName,
      isCrewLeader = false,
      paysSeparately = false,
    } = body;

    if (!groupId || !data) {
      return NextResponse.json(
        { error: "Group ID and form data are required" },
        { status: 400 }
      );
    }

    // Verify group exists and is not archived
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { id: true, archived: true },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    if (group.archived) {
      return NextResponse.json(
        { error: "This group is no longer accepting submissions" },
        { status: 400 }
      );
    }

    // If this is a leader submission, update group's rental details
    if (isLeader) {
      const submissionData = data as SubmissionData;
      await prisma.group.update({
        where: { id: groupId },
        data: {
          rentalStartDate: submissionData.rentalStartDate
            ? new Date(submissionData.rentalStartDate)
            : undefined,
          rentalEndDate: submissionData.rentalEndDate
            ? new Date(submissionData.rentalEndDate)
            : undefined,
          skiResort: submissionData.skiResort || undefined,
        },
      });
    }

    // Handle crew assignment
    let finalCrewId = crewId;

    // If no crewId provided but we're creating a new submission, create a new crew
    if (!finalCrewId && (isCrewLeader || crewName)) {
      const crew = await prisma.crew.create({
        data: {
          groupId,
          name: crewName || null,
        },
      });
      finalCrewId = crew.id;
    }

    const submission = await prisma.formSubmission.create({
      data: {
        groupId,
        crewId: finalCrewId || null,
        email: email || null,
        isLeader,
        isCrewLeader,
        paysSeparately,
        data,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Failed to create submission:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
