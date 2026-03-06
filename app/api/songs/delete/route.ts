export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // adjust if needed

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { songId, code } = body

    if (!songId || !code) {
      return NextResponse.json(
        { error: "songId and code are required" },
        { status: 400 }
      )
    }

    // Ensure song exists in THIS room code only
    const song = await prisma.roomQueueSong.findFirst({
      where: {
        id: songId,
        room: {
          code: code,
        },
      },
    })

    if (!song) {
      return NextResponse.json(
        { error: "Song not found in this room" },
        { status: 404 }
      )
    }

    // Delete only that specific song
    await prisma.roomQueueSong.delete({
      where: {
        id: songId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE SONG ERROR:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}