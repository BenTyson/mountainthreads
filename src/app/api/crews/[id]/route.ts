import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    const crew = await prisma.crew.update({
      where: { id },
      data: { name: name ?? null },
    });

    return NextResponse.json(crew);
  } catch (error) {
    console.error("Failed to update crew:", error);
    return NextResponse.json(
      { error: "Failed to update crew" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete the crew - submissions will have crewId set to null (onDelete: SetNull)
    await prisma.crew.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete crew:", error);
    return NextResponse.json(
      { error: "Failed to delete crew" },
      { status: 500 }
    );
  }
}
