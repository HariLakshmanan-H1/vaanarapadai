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
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500 p-6 rounded-lg shadow-2xl shadow-emerald-500/20">
        <h2 className="text-2xl font-black text-emerald-400 uppercase tracking-wider mb-4 drop-shadow-lg">
          ◈ Queue
        </h2>
        <p className="text-emerald-300 text-lg font-semibold">No songs waiting...</p>
      </div>
    )

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500 p-4 rounded-lg shadow-2xl shadow-emerald-500/20 h-full flex flex-col">
      <h2 className="text-lg font-black text-emerald-400 uppercase tracking-wider mb-3 drop-shadow-lg flex-shrink-0">
        ◈ Queue ({songs.length})
      </h2>

      <div className="space-y-2 overflow-y-auto flex-1">
        {songs.map((song, idx) => (
          <div
            key={song.id ?? `song-${idx}`}
            ref={(el) => (itemsRef.current[idx] = el)}
            className="flex justify-between items-center p-2 bg-gradient-to-r from-slate-800 to-slate-700 border-2 border-emerald-500/60 rounded-lg hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/30 transition-all group"
          >
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate text-base group-hover:text-emerald-300 transition-colors">
                {song.title}
              </p>
              <p
                ref={(el) => el && voteCountRefs.current.set(song.id, el)}
                className="text-emerald-300 text-xs font-semibold mt-0.5"
              >
                ★ {song.votes}
              </p>
            </div>

            <button
              onClick={(e) => handleVote(song.id, e)}
              className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-900 rounded-lg transition-all font-black uppercase tracking-wide border border-emerald-400 hover:border-emerald-300 shadow-lg shadow-emerald-500/40 text-xs ml-2 flex-shrink-0"
            >
              ↑
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}