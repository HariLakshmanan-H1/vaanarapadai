// app/api/playlist/add-song/route.ts
export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { leaderEmail, title, youtubeId, thumbnail } = await req.json()

    if (!leaderEmail || !title || !youtubeId)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })

    // Find or create playlist
    let playlist = await prisma.playlist.findFirst({
      where: { leaderEmail },
    })

    if (!playlist) {
      playlist = await prisma.playlist.create({
        data: { leaderEmail },
      })
    }

    const song = await prisma.playlistSong.create({
      data: {
        playlistId: playlist.id,
        title,
        youtubeId,
        thumbnail,
      },
    })

    return NextResponse.json({ song })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to add song" }, { status: 500 })
  }
}