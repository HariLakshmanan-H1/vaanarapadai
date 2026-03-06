
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
      <div>
        <Link
          href="/room/create"
          className="px-4 py-2 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition"
        >
          ← Create Room
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-[calc(100vh-240px)]">
        <div className="md:col-span-2 flex flex-col">
          <NowPlaying
            song={activeSong}
            roomCode={code as string}
            onEnd={next}
            onStart={handleStart}
          />
        </div>

        <div className="flex flex-col gap-4">
          <AddSongForm roomCode={code as string} onAdd={addSong} />

          <button
            className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded"
            onClick={() => setShowPlaylist(true)}
          >
            View Playlist
          </button>

          <div className="flex-1 min-h-0">
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
      <div>
        
      </div>
    </main>
  );
}