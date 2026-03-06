// app/api/playlist/[leaderEmail]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: { leaderEmail: string } | Promise<{ leaderEmail: string }> }
) {
  // ✅ unwrap the promise
  const params = await context.params;
  const { leaderEmail } = params;

  if (!leaderEmail) {
    return NextResponse.json({ error: "Leader email required" }, { status: 400 });
  }

  try {
    const playlist = await prisma.playlist.findFirst({
      where: { leaderEmail },
      include: { songs: { orderBy: { createdAt: "desc" } } },
    });

    if (!playlist) return NextResponse.json({ songs: [] });

    return NextResponse.json({ songs: playlist.songs });
  } catch (err) {
    console.error("Fetch Playlist Error:", err);
    return NextResponse.json({ error: "Failed to fetch playlist" }, { status: 500 });
  }
}