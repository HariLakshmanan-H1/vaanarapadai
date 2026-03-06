// app/dashboard/[code]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueue } from "@/hooks/useQueue";
import AddSongForm from "@/components/AddSongForm";
import QueueList from "@/components/QueueList";
import NowPlaying from "@/components/NowPlaying";
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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 text-emerald-300">
      <Header />

      {/* Back to Create Room */}
      <div className="mb-6">
        <Link
          href="/room/create"
          className="inline-block px-4 py-2 border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-2xl shadow-md shadow-emerald-500/30 transition-all duration-200"
        >
          ← Create Room
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
        {/* Now Playing */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <NowPlaying
            song={activeSong}
            roomCode={code as string}
            onEnd={next}
            onStart={handleStart}
          />
        </div>

        {/* Queue & Add Song */}
        <div className="flex flex-col gap-5">
          <AddSongForm 
            roomCode={code as string} 
            onAdd={addSong} 
            className="rounded-2xl shadow-lg shadow-emerald-500/30 backdrop-blur-sm border border-emerald-500"
          />

          <button
            onClick={() => setShowPlaylist(true)}
            className="bg-gradient-to-tr from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white py-2 rounded-2xl shadow-md shadow-emerald-500/40 transition-transform duration-150 active:scale-95"
          >
            View Playlist
          </button>

          <div className="flex-1 min-h-0">
            <QueueList songs={queue} onVote={vote} className="rounded-xl shadow-inner shadow-slate-900/50" />
          </div>
        </div>
      </div>

      {/* Floating Playlist */}
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