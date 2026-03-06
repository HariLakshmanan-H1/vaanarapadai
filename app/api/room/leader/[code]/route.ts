// app/api/room/leader/[code]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: { code: string } | Promise<{ code: string }> }
) {
  const params = await context.params;
  const { code } = params;

  if (!code) return NextResponse.json({ error: "Room code required" }, { status: 400 });

  try {
    // Find the participant with this room code (any participant)
    const room = await prisma.room.findUnique({
      where: { code },
    });

    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    // The leader email comes from room.leaderEmail
    const leaderEmail = room.leaderEmail;

    return NextResponse.json({ leaderEmail });
  } catch (err) {
    console.error("Fetch Room Leader Error:", err);
    return NextResponse.json({ error: "Failed to fetch leader" }, { status: 500 });
  }
}