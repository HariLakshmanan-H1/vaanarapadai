"use client"

import { useEffect, useRef } from "react"
import { Song } from "@/hooks/useQueue"
import { animateVoteButton, animateVoteCount, staggerQueueItems } from "@/lib/animations"

interface Props {
  songs: Song[]
  onVote: (id: string) => void
}

export default function QueueList({ songs, onVote }: Props) {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const voteCountRefs = useRef<Map<string, HTMLElement>>(new Map())

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean)
    if (items.length) staggerQueueItems(items as unknown as NodeListOf<Element>)
  }, [songs])

  const handleVote = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    animateVoteButton(e.currentTarget)
    const voteCountEl = voteCountRefs.current.get(id)
    if (voteCountEl) animateVoteCount(voteCountEl)
    onVote(id)
  }

  if (songs.length === 0)
    return (
      <div className="glass-card border-emerald-500/30 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 flex items-center justify-center mb-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
        </div>
        <h2 className="text-xl font-bold text-white mb-1">Queue Empty</h2>
        <p className="text-emerald-400/50 text-xs font-medium uppercase tracking-[0.2em]">Add a vibe to start</p>
      </div>
    )

  return (
    <div className="glass-card border-emerald-500/30 p-6 rounded-3xl shadow-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">
          Up Next <span className="text-emerald-500 ml-2">{songs.length}</span>
        </h2>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-500/30" />
          <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
          <div className="w-1 h-1 rounded-full bg-emerald-500/80" />
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1">
        {songs.map((song, idx) => (
          <div
            key={song.id ?? `song-${idx}`}
            ref={(el) => { itemsRef.current[idx] = el }}
            className="flex justify-between items-center p-3.5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 group"
          >
            <div className="flex-1 min-w-0 pr-4">
              <p className="font-bold text-white truncate text-sm group-hover:text-emerald-400 transition-colors duration-300">
                {song.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest">
                  ★ {song.votes} Votes
                </span>
                {(song as any).hasVoted && (
                   <span className="text-[10px] font-medium text-emerald-400/40 italic">Voted</span>
                )}
              </div>
            </div>

            <button
              onClick={(e) => handleVote(song.id, e)}
              className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-slate-950 rounded-xl transition-all duration-300 border border-emerald-500/20 hover:border-emerald-400 shadow-lg shadow-emerald-500/5"
            >
              <span className="text-lg font-bold">↑</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}