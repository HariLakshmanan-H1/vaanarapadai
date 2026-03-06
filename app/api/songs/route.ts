export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma";

export async function GET() {
  const songs = await prisma.song.findMany({
    orderBy: { createdAt: "asc" },
  });
  return new Response(JSON.stringify(songs), { status: 200 });
}

export async function POST(req: Request) {
  const { title, youtubeId } = await req.json();
  const song = await prisma.song.create({
    data: { title, youtubeId },
  });
  return new Response(JSON.stringify(song), { status: 201 });
}