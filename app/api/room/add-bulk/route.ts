export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { roomId, songs } = await req.json()

  const existing = await prisma.roomQueueSong.count({
    where: { roomId }
  })

  if (existing + songs.length > 25) {
    return NextResponse.json({ error: "Queue limit exceeded" }, { status: 400 })
  }

  await prisma.roomQueueSong.createMany({
    data: songs.map((song: any) => ({
      roomId,
      title: song.title,
      youtubeId: song.youtubeId,
      thumbnail: song.thumbnail
    }))
  })

  return NextResponse.json({ success: true })
}