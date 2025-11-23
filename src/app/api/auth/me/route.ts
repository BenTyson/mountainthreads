import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const auth = await getCurrentAdmin();

  if (!auth) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { id: auth.adminId },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!admin) {
    return NextResponse.json(
      { error: "Admin not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ admin });
}
