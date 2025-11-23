import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { groupId, email, data } = body;

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

    const submission = await prisma.formSubmission.create({
      data: {
        groupId,
        email: email || null,
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
