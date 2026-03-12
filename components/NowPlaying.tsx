"use client"

import { useEffect, useState, useRef } from "react"
import YouTube from "react-youtube"
import VinylPlayer from "@/components/VinylPlayer"
import { Song } from "@/hooks/useQueue"
import { animateSongEntry } from "@/lib/animations"
import { getPusherClient } from "@/lib/pusherClient"

interface Props {
  song: Song | null
  onEnd: () => void
  roomCode: string
}

export default function NowPlaying({ song, onEnd, roomCode }: Props) {
  const [playerKey, setPlayerKey] = useState(0)
  const [isLeader, setIsLeader] = useState(false)
  const playerRef = useRef<any>(null)

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
      const res = await fetch(`/api/room/${roomCode}`, {
        method: "GET",
        credentials: "include",
      });
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

  // Broadcast sync events to participants (Leader only)
  const broadcastSync = async (action: string, timestamp: number) => {
    if (!isLeader || !song) return

    fetch(`/api/room/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomCode, action, timestamp, videoId: song.youtubeId }),
    }).catch(console.error)
  }

  // Heartbeat interval for the leader
  useEffect(() => {
    if (!isLeader || !playerRef.current) return

    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const time = playerRef.current.getCurrentTime()
        // Only broadcast if the player is actively playing
        if (playerRef.current.getPlayerState() === 1) { // 1 is playing
            broadcastSync("SYNC", time)
        }
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isLeader, song, playerKey])

  useEffect(() => {
    if (isLeader) return

    const channelName = `room-${roomCode}`
    const pusherClient = getPusherClient()
    const channel = pusherClient.subscribe(channelName)

    channel.bind("sync", (data: { action: string, timestamp: number, videoId: string }) => {
      if (!playerRef.current || !song || data.videoId !== song.youtubeId) return

      const currentTime = playerRef.current.getCurrentTime()
      const timeDiff = Math.abs(currentTime - data.timestamp)

      if (data.action === "PLAY") {
        playerRef.current.playVideo()
        if (timeDiff > 2) playerRef.current.seekTo(data.timestamp)
      } else if (data.action === "PAUSE") {
        playerRef.current.pauseVideo()
        if (timeDiff > 2) playerRef.current.seekTo(data.timestamp)
      } else if (data.action === "SYNC") {
        if (timeDiff > 2) {
          playerRef.current.seekTo(data.timestamp)
        }
      }
    })

    return () => {
      pusherClient.unsubscribe(channelName)
    }
  }, [isLeader, roomCode, song, playerKey])


  if (!song) return <div>Queue Empty</div>

  return (
    <div className="relative w-full h-full flex flex-col">

      {/* Vinyl always spins if song exists */}
      {!isLeader && (
        <div className="absolute inset-0 opacity-40 pointer-events-none z-0">
          <VinylPlayer songTitle={song.title} />
        </div>
      )}

      <div
        id="now-playing-container"
        className="relative z-10 flex flex-col space-y-4"
      >
        <h2 className="text-xl font-semibold mb-2">Now Playing</h2>

        {/* 
          Participants get a pointer-events-none container to prevent native 
          interactions un-syncing the state 
        */}
        <div className={!isLeader ? "pointer-events-none" : ""}>
          <YouTube
            key={playerKey}
            videoId={song.youtubeId}
            opts={{ width: "100%", playerVars: { autoplay: 1 } }}
            onReady={(e) => {
              playerRef.current = e.target
            }}
            onPlay={(e) => {
              if (isLeader) broadcastSync("PLAY", e.target.getCurrentTime())
            }}
            onPause={(e) => {
              if (isLeader) broadcastSync("PAUSE", e.target.getCurrentTime())
            }}
            onEnd={() => {
              if (isLeader) handleEnd()
            }}
          />
        </div>

        {isLeader && (
           <button
             onClick={handleEnd}
             className="px-4 py-2 bg-emerald-500 text-slate-900 rounded-lg font-bold mt-4"
           >
             ⊳ Skip to Next
           </button>
        )}
      </div>
    </div>
  )
}