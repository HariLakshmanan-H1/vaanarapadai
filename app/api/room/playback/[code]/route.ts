import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// -----------------------------
// GET → Return playback state
// -----------------------------
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params
  if (!code) return NextResponse.json({ error: "Missing room code" }, { status: 400 })

  let playback = await prisma.roomPlayback.findUnique({ where: { code } })

  if (!playback || !playback.videoId) {
    // No current video → pick next song in queue
    const nextSong = await prisma.song.findFirst({
      where: { code },
      orderBy: { createdAt: "asc" },
    })

    if (!nextSong) return NextResponse.json({ videoId: null, isPlaying: false, currentTime: 0 })

    // Update playback table
    playback = await prisma.roomPlayback.upsert({
      where: { code },
      update: { videoId: nextSong.youtubeId, isPlaying: true, startedAt: BigInt(Date.now()), pausedAt: null },
      create: { code, videoId: nextSong.youtubeId, isPlaying: true },
    })
  }

  const serverNow = Date.now()
  let currentTime = playback.pausedAt ?? 0
  if (playback.isPlaying && playback.startedAt) {
    currentTime = (serverNow - Number(playback.startedAt)) / 1000
  }

  return NextResponse.json({
    videoId: playback.videoId,
    isPlaying: playback.isPlaying,
    currentTime,
  })
}

// -----------------------------
// POST → Update playback state
// -----------------------------
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params
  if (!code) return NextResponse.json({ error: "Missing room code" }, { status: 400 })

  const body = await req.json()
  const { videoId, action, currentTime } = body
  if (!videoId || !action) return NextResponse.json({ error: "Missing videoId or action" }, { status: 400 })

  // Ensure playback record exists
  let playback = await prisma.roomPlayback.findUnique({ where: { code } })
  if (!playback) {
    playback = await prisma.roomPlayback.create({
      data: { code, videoId, isPlaying: false, startedAt: null, pausedAt: null },
    })
  }

  const now = Date.now()
  switch (action) {
    case "PLAY":
      await prisma.roomPlayback.update({
        where: { code },
        data: {
          videoId,
          isPlaying: true,
          startedAt: BigInt(Math.floor(now - (currentTime ?? 0) * 1000)),
          pausedAt: null,
        },
      })
      break

    case "PAUSE":
      await prisma.roomPlayback.update({
        where: { code },
        data: {
          videoId,
          isPlaying: false,
          pausedAt: currentTime ?? 0,
        },
      })
      break

    case "SEEK":
      await prisma.roomPlayback.update({
        where: { code },
        data: {
          videoId,
          isPlaying: true,
          startedAt: BigInt(Math.floor(now - (currentTime ?? 0) * 1000)),
          pausedAt: null,
        },
      })
      break

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}