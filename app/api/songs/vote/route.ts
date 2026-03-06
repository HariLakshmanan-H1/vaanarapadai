import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code, title, youtubeId } = await req.json()

    if (!code || !title || !youtubeId) {
      return NextResponse.json(
        { error: "code, title and youtubeId required" },
        { status: 400 }
      )
    }

    const room = await prisma.room.findUnique({
      where: { code }
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const count = await prisma.roomQueueSong.count({
      where: { code }
    })

    if (count >= 25) {
      return NextResponse.json(
        { error: "Queue limit reached (25 songs)" },
        { status: 400 }
      )
    }

    const song = await prisma.roomQueueSong.create({
      data: {
        code,
        title,
        youtubeId
      }
    })

    return NextResponse.json(song)
  } catch (error) {
    console.error("Add song error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}