import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pusherServer } from "@/lib/pusher"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { roomCode, action, timestamp, videoId } = await req.json()

    if (!roomCode || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Broadcast the event to the room's channel
    // 'sync' event handles PLAY, PAUSE, and TIMESTAMP syncing
    await pusherServer.trigger(`room-${roomCode}`, "sync", {
      action,
      timestamp,
      videoId,
      leaderEmail: session.user.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error broadcasting sync event:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
