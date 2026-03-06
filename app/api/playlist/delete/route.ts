import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { songId, leaderEmail } = body

    if (!songId || !leaderEmail) {
      return NextResponse.json(
        { error: "songId and playlistId are required" },
        { status: 400 }
      )
    }

    const playlist = await prisma.playlist.findFirst({
      where: { leaderEmail },
    })

    const deleted = await prisma.playlistSong.deleteMany({
      where: {
        id: songId,
        playlistId : playlist?.id,
      },
    })

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Song not found in this playlist" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE PLAYLIST SONG ERROR:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}