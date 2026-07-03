import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { StreamChat } from "stream-chat";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = (session.user as any).id;

        const serverClient = StreamChat.getInstance(
            process.env.NEXT_PUBLIC_STREAM_API_KEY!,
            process.env.STREAM_API_SECRET!
        );

        const token = serverClient.createToken(userId);

        return NextResponse.json({ token, userId });
    } catch (error) {
        console.error("Error generating stream token:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}