// app/api/room/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createUniqueRoomCode } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Check user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const body = await req.json(); // Currently not using, but available for extra options

    // 2️⃣ Generate a unique public room code
    const code = await createUniqueRoomCode(prisma);
    const name = code; // You can customize this if needed

    // 3️⃣ Create the room with leaderEmail
    const room = await prisma.room.create({
      data: {
        name,
        leaderEmail: userEmail,
        code,
      },
    });

    // 4️⃣ Add leader to RoomParticipant automatically
    await prisma.roomParticipant.create({
      data: {
        code: room.code,
        userEmail,
      },
    });

    // 5️⃣ Return room info
    return NextResponse.json({
      id: room.id,      // internal ID
      code: room.code,  // public room code
      name: room.name,
    });

  } catch (error) {
    console.error("Create Room Error:", error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}