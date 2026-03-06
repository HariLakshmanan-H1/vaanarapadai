import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params   // ✅ MUST await params

    const { songId } = await req.json()

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID required" },
        { status: 400 }
      )
    }

    await prisma.roomQueueSong.update({
      where: { id: songId },
      data: {
        votes: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to vote" },
      { status: 500 }
    )
  }
}