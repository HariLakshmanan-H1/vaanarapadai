export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params   // ✅ CORRECT

  const session = await getServerSession(authOptions)

  
  console.log("SESSION:", session)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

    const room = await prisma.room.findUnique({
    where: { code }
  })

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 })
  }

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 })
  }

  const isLeader = session.user.email === room.leaderEmail

  return NextResponse.json({ isLeader })
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const room = await prisma.room.findUnique({
    where: { code }
  })

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 })
  }

  await prisma.roomQueueSong.create({
    data: {
      code,
      title: body.title,
      youtubeId: body.youtubeId,
      thumbnail: body.thumbnail,
    }
  })

  return NextResponse.json({ success: true })
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { songId } = await req.json()

  try {
    await prisma.$transaction([
      prisma.vote.create({
        data: {
          userEmail: session.user.email,
          songId,
        },
      }),
      prisma.roomQueueSong.update({
        where: { id: songId },
        data: {
          votes: { increment: 1 },
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Already voted" },
        { status: 400 }
      )
    }

    console.error(error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}