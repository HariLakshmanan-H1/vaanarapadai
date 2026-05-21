
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

        {/* Center Column: Chat Box Placeholder (Future implementation) */}
        <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden group min-h-[400px]">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="font-bold text-slate-100 uppercase tracking-wider text-sm">
                  Room Chat
                </h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold">
                Upcoming
              </span>
            </div>

            {/* Mock Chat Feed to simulate an active, high-fidelity UI */}
            <div className="flex-1 my-4 space-y-3.5 overflow-y-auto pr-1 text-xs select-none opacity-60">
              <div className="text-[10px] text-center text-slate-500 my-2">
                — Conversation started —
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-emerald-400">Hari</span>
                  <span className="text-[9px] text-slate-500">21:28</span>
                </div>
                <div className="bg-slate-950/40 border border-white/5 rounded-2xl rounded-tl-none px-3 py-2 text-slate-300 w-fit max-w-[85%]">
                  Yo! Add some more bass heavy tracks! 🔥
                </div>
              </div>

              <div className="flex flex-col gap-1 items-end">
                <div className="flex items-baseline gap-2 justify-end">
                  <span className="text-[9px] text-slate-500">21:29</span>
                  <span className="font-bold text-amber-400">Lakshmanan</span>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/10 rounded-2xl rounded-tr-none px-3 py-2 text-slate-200 w-fit max-w-[85%]">
                  Just added the new playlist songs. Let's vote them up! 💫
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-400">System Bot</span>
                  <span className="text-[9px] text-slate-500">21:30</span>
                </div>
                <div className="bg-slate-950/20 border border-white/5 rounded-2xl rounded-tl-none px-3 py-2 text-slate-400 italic">
                  💡 Tip: You can vote on songs in the queue to bump them up.
                </div>
              </div>
            </div>

            {/* Glassmorphic Overlay notifying user of upcoming feature */}
            <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-3 text-emerald-400 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-200 text-sm mb-1">Future Chat Box Space</h4>
              <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                Connect and chat in real-time with room members right here!
              </p>
            </div>

            {/* Disabled Input mimicking real chat box */}
            <div className="mt-2 pt-2 border-t border-white/5 flex gap-2 relative z-10 opacity-30">
              <input
                type="text"
                disabled
                placeholder="Chat is coming soon..."
                className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none"
              />
              <button disabled className="bg-emerald-500 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs">
                Send
              </button>
            </div>
          </div>
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