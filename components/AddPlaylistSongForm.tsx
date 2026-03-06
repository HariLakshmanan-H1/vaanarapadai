"use client"

import { useState } from "react"
import { useYouTubeMeta } from "@/hooks/useYouTubeMeta"

export default function AddPlaylistSongForm({ playlistId }: { playlistId: string }) {
  const [url, setUrl] = useState("")
  const [preview, setPreview] = useState<any>(null)
  const { getMeta, loading, error } = useYouTubeMeta()

  async function handlePreview() {
    const meta = await getMeta(url)
    if (meta) setPreview(meta)
  }

  async function handleAdd() {
    if (!preview) return

    await fetch("/api/playlist/add-song", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlistId,
        ...preview
      })
    })

    setPreview(null)
    setUrl("")
    location.reload()
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL"
          className="flex-1 p-2 bg-slate-900 rounded"
        />
        <button
          onClick={handlePreview}
          className="bg-blue-600 px-4 rounded"
        >
          Preview
        </button>
      </div>

      {loading && <p>Fetching metadata...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {preview && (
        <div className="flex gap-4 items-center bg-slate-800 p-3 rounded">
          <img src={preview.thumbnail} className="w-24 rounded" />
          <div>
            <p>{preview.title}</p>
            <button
              onClick={handleAdd}
              className="mt-2 bg-emerald-600 px-3 py-1 rounded"
            >
              Add to Playlist
            </button>
          </div>
        </div>
      )}
    </div>
  )
}