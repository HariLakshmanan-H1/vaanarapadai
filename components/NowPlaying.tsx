"use client"

import { useEffect, useState, useRef } from "react"
import YouTube from "react-youtube"
import VinylPlayer from "@/components/VinylPlayer"
import { Song } from "@/hooks/useQueue"
import { animateSongEntry } from "@/lib/animations"

interface Props {
  song: Song | null
  onEnd: () => void
  roomCode: string
}

export default function NowPlaying({ song, onEnd, roomCode }: Props) {
  const [playerKey, setPlayerKey] = useState(0)
  const [isLeader, setIsLeader] = useState(false)

  const previousSongId = useRef<string | null>(null)

  // Only remount if actual song changes
  useEffect(() => {
    if (!song) return

    if (previousSongId.current !== song.id) {
      previousSongId.current = song.id
      setPlayerKey((prev) => prev + 1)

      const container = document.getElementById("now-playing-container")
      if (container) animateSongEntry(container)
    }
  }, [song])

  // Check leader
  useEffect(() => {
    const checkLeader = async () => {
      const res = await fetch(`/api/room/${roomCode}`)
      const data = await res.json()
      console.log(data);
      setIsLeader(data.isLeader)
    }

    checkLeader()
  }, [roomCode])

  const handleEnd = async () => {
    if (!song || !isLeader) return

    await fetch("/api/songs/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId: song.id, code: roomCode }),
    })

    onEnd()
  }

  if (!song) return <div>Queue Empty</div>

  return (
    <div className="relative w-full h-full flex flex-col">

      {/* Vinyl always spins if song exists */}
      {!isLeader && (
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <VinylPlayer songTitle={song.title} />
        </div>
      )}

      <div
        id="now-playing-container"
        className="relative z-10 flex flex-col space-y-4"
      >
        <h2 className="text-xl font-semibold mb-2">Now Playing</h2>

        {isLeader && (
          <>
            <YouTube
              key={playerKey}
              videoId={song.youtubeId}
              opts={{ width: "100%", playerVars: { autoplay: 1 } }}
              onEnd={handleEnd}
            />

            <button
              onClick={handleEnd}
              className="px-4 py-2 bg-emerald-500 text-slate-900 rounded-lg font-bold mt-4"
            >
              ⊳ Skip to Next
            </button>
          </>
        )}
      </div>
    </div>
  )
}