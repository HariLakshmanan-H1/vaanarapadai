"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { StreamChat, Channel as StreamChannel } from "stream-chat";
import {
    Chat,
    Channel,
    Window,
    ChannelHeader,
    MessageList,
    MessageComposer,
    LoadingIndicator
} from "stream-chat-react";

import "stream-chat-react/dist/css/index.css";

interface RoomChatProps {
    roomCode: string
}

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export default function RoomChat({ roomCode }: RoomChatProps) {
    const { data: session } = useSession();
    const [chatClient, setChatClient] = useState<StreamChat | null>(null);
    const [channel, setChannel] = useState<StreamChannel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) return;

        const user = session.user as any;
        const client = StreamChat.getInstance(apiKey);

        const initChat = async () => {
            try {
                const response = await fetch("/api/stream-token");
                const data = await response.json();

                if (data.error) throw new Error(data.error);

                await client.connectUser(
                    {
                        id: user.id,
                        name: user.name || "Anonymous",
                        image: user.image || undefined,
                    },
                    data.token
                );

                const chatChannel = client.channel("livestream", roomCode, {
                    name: `Room: ${roomCode}`,
                });

                await chatChannel.watch();

                setChatClient(client);
                setChannel(chatChannel);
            } catch (error) {
                console.error("Error initialising Stream Chat client", err);
            } finally {
                setLoading(false);
            }
        };

        initChat();

        return () => {
            if (client) {
                client.disconnectUser()
            }
        };
    }, [session, roomCode]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-slate-900/50 rounded-2xl border border-white/10 p-4 min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <LoadingIndicator size={30} />
                    <span className="text-xs text-slate-400">Connecting to Chat...</span>
                </div>
            </div>
        );
    }

    if (!chatClient || !channel) {
        return (
            <div className="flex h-full items-center justify-center bg-slate-900/50 rounded-2xl border border-white/10 p-4 min-h-[400px]">
                <span className="text-xs text-red-400">Failed to connect to chat channel.</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-h-[400px] stream-custom-theme">
            <Chat client={chatClient} theme="str-chat__theme-dark">
                <Channel channel={channel}>
                    <Window>
                        <ChannelHeader title={`Room Chat`} />
                        <MessageList />
                        <MessageComposer />
                    </Window>
                </Channel>
            </Chat>
        </div>
    );
}