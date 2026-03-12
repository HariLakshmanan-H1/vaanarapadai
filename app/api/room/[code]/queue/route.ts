export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

/* =======================================================
   Helpers
======================================================= */

async function requireUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null
  return session.user.email
}

async function promoteNextSongIfNeeded(code: string) {
  const room = await prisma.room.findUnique({
    where: { code },
    include: { currentSong: true }
  })

  if (!room) return null

  if (room.currentSongId) return room

  const nextSong = await prisma.roomQueueSong.findFirst({
    where: {
      code,
      played: false
    },
    orderBy: [
      { votes: "desc" },
      { createdAt: "asc" }
    ]
  })

  if (!nextSong) return room

  await prisma.room.update({
    where: { code },
    data: { currentSongId: nextSong.id }
  })

  return {
    ...room,
    currentSongId: nextSong.id,
    currentSong: nextSong
  }
}

/* =======================================================
   GET – Fetch Current Song + Queue
======================================================= */

export async function GET(
  req: NextRequest,
  context: { params: { code: string } | Promise<{ code: string }> }
) {
  const { code } = await context.params
  if (!code)
    return NextResponse.json({ error: "Room code missing" }, { status: 400 })

  const userEmail = await requireUser()
  if (!userEmail)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const room = await promoteNextSongIfNeeded(code)

    if (!room)
      return NextResponse.json({ error: "Room not found" }, { status: 404 })

    const queueSongs = await prisma.roomQueueSong.findMany({
      where: {
        code,
        played: false,
        NOT: room.currentSongId
          ? { id: room.currentSongId }
          : undefined
      },
      include: {
        voteList: {
          where: { userEmail },
          select: { id: true }
        }
      },
      orderBy: [
        { votes: "desc" },
        { createdAt: "asc" }
      ]
    })

    return NextResponse.json({
      currentSong: room.currentSong,
      queue: queueSongs.map(song => ({
        ...song,
        hasVoted: song.voteList.length > 0,
        voteList: undefined
      }))
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch queue" },
      { status: 500 }
    )
  }
}

/* =======================================================
   POST – Add Song
======================================================= */

export async function POST(
  req: NextRequest,
  context: { params: { code: string } | Promise<{ code: string }> }
) {
  const { code } = await context.params

  const userEmail = await requireUser()
  if (!userEmail)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { title, youtubeId, thumbnail } = await req.json()

  if (!title || !youtubeId)
    return NextResponse.json(
      { error: "Missing title or youtubeId" },
      { status: 400 }
    )

  try {
    const roomExists = await prisma.room.findUnique({
      where: { code },
      select: { id: true }
    })

    if (!roomExists)
      return NextResponse.json({ error: "Room not found" }, { status: 404 })

    const count = await prisma.roomQueueSong.count({
      where: { code, played: false }
    })

    if (count >= 25)
      return NextResponse.json({ error: "Queue full" }, { status: 400 })

    const song = await prisma.roomQueueSong.upsert({
      where: {
        code_youtubeId: {
          code,
          youtubeId
        }
      },
      update: {
        played: false,
        votes: 0,
        createdAt: new Date() // reset timestamp so it goes to bottom
      },
      create: { 
        code, 
        title, 
        youtubeId, 
        thumbnail 
      }
    })

    return NextResponse.json(song)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to add song" },
      { status: 500 }
    )
  }
}

/* =======================================================
   PATCH – Vote (One Per User)
======================================================= */

export async function PATCH(
  req: NextRequest,
  context: { params: { code: string } | Promise<{ code: string }> }
) {
  const { code } = await context.params

  const userEmail = await requireUser()
  if (!userEmail)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { songId } = await req.json()
  if (!songId)
    return NextResponse.json(
      { error: "Missing songId" },
      { status: 400 }
    )

  try {
    await prisma.$transaction(async (tx) => {
      const song = await tx.roomQueueSong.findUnique({
        where: { id: songId }
      })

      if (!song || song.code !== code)
        throw new Error("NOT_FOUND")

      try {
        await tx.vote.create({
          data: { userEmail, songId }
        })
      } catch (e: any) {
        // Handle unique constraint violation (P2002) for votes gracefully
        if (e.code === 'P2002') throw new Error("ALREADY_VOTED")
        throw e
      }

      await tx.roomQueueSong.update({
        where: { id: songId },
        data: { votes: { increment: 1 } }
      })
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.message === "ALREADY_VOTED")
      return NextResponse.json(
        { error: "Already voted" },
        { status: 400 }
      )

    if (err.message === "NOT_FOUND")
      return NextResponse.json(
        { error: "Song not found in this room" },
        { status: 404 }
      )

    console.error(err)
    return NextResponse.json(
      { error: "Failed to vote" },
      { status: 500 }
    )
  }
}

/* =======================================================
   DELETE – Leader Skip
======================================================= */

export async function DELETE(
  req: NextRequest,
  context: { params: { code: string } | Promise<{ code: string }> }
) {
  const { code } = await context.params

  const userEmail = await requireUser()
  if (!userEmail)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const room = await prisma.room.findUnique({
      where: { code }
    })

    if (!room)
      return NextResponse.json({ error: "Room not found" }, { status: 404 })

    if (room.leaderEmail !== userEmail)
      return NextResponse.json(
        { error: "Only leader can skip" },
        { status: 403 }
      )

    if (!room.currentSongId)
      return NextResponse.json(
        { error: "No current song" },
        { status: 400 }
      )

    await prisma.$transaction([
      prisma.roomQueueSong.update({
        where: { id: room.currentSongId },
        data: { played: true }
      }),
      prisma.room.update({
        where: { code },
        data: { currentSongId: null }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to skip song" },
      { status: 500 }
    )
  }
}