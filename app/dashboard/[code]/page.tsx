
//app/dashboard/[code]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueue } from "@/hooks/useQueue";
import AddSongForm from "@/components/AddSongForm";
import QueueList from "@/components/QueueList";
import NowPlaying from "@/components/NowPlaying";
import Image from "next/image";
import PlaylistFloating from "@/components/PlaylistFloating";
import Link from "next/link";
import Header from "@/components/Header";
import RoomChat from "@/components/RoomChat";

export default function DashboardPage() {
  const { code } = useParams();
  const { queue, activeSong, addSong, next, vote, setActiveSong } = useQueue(code as string);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Auto-set first song if none playing
  useEffect(() => {
    if (!activeSong && queue.length > 0) {
      setActiveSong(queue[0]);
    }
  }, [queue]);

  const handleStart = () => {
    if (queue.length > 0) setActiveSong(queue[0]);
  };

  const handleAddToQueue = (song: any) => {
    addSong({ ...song, roomId: code });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <Header />
      <div className="mb-6">
        <Link
          href="/room/create"
          className="px-4 py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition text-sm font-semibold flex items-center gap-2 w-fit"
        >
          <span>← Create Room</span>
        </Link>
      </div>

      {/* 3-Column Grid on desktop (lg screen sizes and above) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[calc(100vh-220px)] items-start">

        {/* Left Column: YouTube Miniplayer */}
        <div className="flex flex-col h-full">
          <NowPlaying
            song={activeSong}
            roomCode={code as string}
            onEnd={next}
          />
        </div>

        {/* Center Column */}
        <div className="flex flex-col h-full self-stretch">
          <RoomChat roomCode={code as string} />
        </div>

        {/* Right Column: Add to Queue & Active Queue */}
        <div className="flex flex-col gap-4 h-full">
          <AddSongForm roomCode={code as string} onAdd={addSong} />

          <button
            className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 font-bold border border-emerald-500/20 rounded-xl transition cursor-pointer text-xs"
            onClick={() => setShowPlaylist(true)}
          >
            View Playlist
          </button>

          <div className="flex-1 min-h-[250px] lg:min-h-0 overflow-hidden">
            <QueueList songs={queue} onVote={vote} />
          </div>
        </div>

      </div>

      {showPlaylist && (
        <PlaylistFloating
          roomCode={code as string}
          onAddToQueue={handleAddToQueue}
          onClose={() => setShowPlaylist(false)}
        />
      )}
    </main>
  );
}