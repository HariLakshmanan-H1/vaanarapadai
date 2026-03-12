"use client"

import { useState, useRef } from "react"
import { Song } from "@/hooks/useQueue"
import { useYouTubeMeta } from "@/hooks/useYouTubeMeta"
import { animateFormSubmit, animateInputBlur, animateInputFocus } from "@/lib/animations"

interface Props {
  roomCode: string
  onAdd: (song: Omit<Song, "id" | "votes" | "createdAt" | "played">) => void
}

export default function AddSongForm({ roomCode, onAdd }: Props) {
  const [url, setUrl] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const { getMeta, loading, error } = useYouTubeMeta()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (e.currentTarget instanceof HTMLElement) {
      animateFormSubmit(e.currentTarget)
    }

    if (!url) return

    const meta = await getMeta(url)
    if (!meta) return setFormError("Failed to fetch metadata")

    // Add song
    onAdd({
      code: roomCode,
      title: meta.title,
      youtubeId: meta.videoId,
      thumbnail: meta.thumbnail ?? "",
    })

    setUrl("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card border-emerald-500/30 p-6 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full -mr-12 -mt-12 transition-all group-hover:bg-emerald-500/10" />
      
      <div className="flex items-center gap-2 px-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        <h2 className="text-xs font-black text-white uppercase tracking-[0.4em]">
          Add to Queue
        </h2>
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300 font-medium text-sm pr-10"
          placeholder="YouTube URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={(e) => animateInputFocus(e.currentTarget)}
          onBlur={(e) => animateInputBlur(e.currentTarget)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/30 group-focus-within:text-emerald-500 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9.172a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102 1.101" />
          </svg>
        </div>
      </div>

      {error && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider px-1">{error}</p>}
      {formError && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider px-1">{formError}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl disabled:opacity-50 font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
      >
        {loading ? "Discovering..." : "Add to Library"}
      </button>
    </form>
  )
}