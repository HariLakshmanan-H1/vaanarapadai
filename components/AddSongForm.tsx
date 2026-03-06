"use client"

import { useState, useRef } from "react"
import { Song } from "@/hooks/useQueue"
import { useYouTubeMeta } from "@/hooks/useYouTubeMeta"

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

    if (!url) return

    const meta = await getMeta(url)
    if (!meta) return setFormError("Failed to fetch metadata")

    // Add song
    onAdd({
      roomCode,
      title: meta.title,
      youtubeId: meta.videoId,
      thumbnail: meta.thumbnail ?? "",
    })

    setUrl("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500 p-4 rounded-lg space-y-3 shadow-2xl shadow-emerald-500/20"
    >
      <h2 className="text-lg font-black text-emerald-400 uppercase tracking-wider">
        ► Add Song
      </h2>

      <input
        ref={inputRef}
        className="w-full bg-slate-700 border-2 border-emerald-500 p-2 rounded-lg text-white placeholder-slate-400 focus:outline-none font-medium text-sm"
        placeholder="Paste YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}
      {formError && <p className="text-red-400 text-xs">{formError}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg disabled:opacity-50 font-black text-sm uppercase"
      >
        {loading ? "Fetching..." : "Add"}
      </button>
    </form>
  )
}