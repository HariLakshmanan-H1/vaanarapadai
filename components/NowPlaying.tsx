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
  const hasSyncedRef = useRef<boolean>(false)

  // Only remount if actual song changes
  useEffect(() => {
    if (!song) return

    if (previousSongId.current !== song.id) {
      previousSongId.current = song.id
      hasSyncedRef.current = false
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
      body: JSON.stringify({ 
        roomCode, 
        action, 
        timestamp, 
        videoId: song.youtubeId,
        sentAt: Date.now() 
      }),
    }).catch(console.error)
  }

  // Heartbeat interval for the leader (every 10 seconds to avoid over-seeking)
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
    }, 10000)

    return () => clearInterval(interval)
  }, [isLeader, song?.id, playerKey])

  useEffect(() => {
    if (isLeader) return

    const channelName = `room-${roomCode}`
    const pusherClient = getPusherClient()
    const channel = pusherClient.subscribe(channelName)

    channel.bind("sync", (data: { action: string, timestamp: number, videoId: string, sentAt?: number }) => {
      if (!playerRef.current || !song || data.videoId !== song.youtubeId) return

      const currentTime = playerRef.current.getCurrentTime()
      
      // Directly use the leader's video timestamp. Pusher latency is negligible (50-200ms),
      // which is far better than using unsynchronized system clocks for latency calculations.
      const adjustedTarget = data.timestamp
      
      const timeDiff = Math.abs(currentTime - adjustedTarget)

      // Only sync if the difference exceeds our threshold:
      // - 1.5s for initial join/playback command to allow smooth load-in.
      // - 3s for background heartbeats to prevent stuttering from minor network drift.
      const threshold = hasSyncedRef.current ? 3 : 1.5

      if (data.action === "PLAY") {
        playerRef.current.playVideo()
        if (timeDiff > threshold) playerRef.current.seekTo(adjustedTarget, true)
        hasSyncedRef.current = true
      } else if (data.action === "PAUSE") {
        playerRef.current.pauseVideo()
        if (timeDiff > threshold) playerRef.current.seekTo(adjustedTarget, true)
      } else if (data.action === "SYNC") {
        if (timeDiff > threshold) {
          playerRef.current.seekTo(adjustedTarget, true)
          hasSyncedRef.current = true
        }
      }
    })

    return () => {
      pusherClient.unsubscribe(channelName)
    }
  }, [isLeader, roomCode, song?.id, playerKey])


  if (!song) {
    return (
      <div className="relative w-full h-full min-h-[300px] flex flex-col items-center justify-center">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
          <VinylPlayer songTitle="Waiting for songs..." />
        </div>
        <div className="relative z-10 text-slate-400 font-medium text-lg">
          Queue Empty. Add a song to start!
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full flex flex-col items-start">
      <div
        id="now-playing-container"
        className="relative z-10 flex flex-col space-y-4 w-full"
      >
        <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wider border-b border-emerald-500/20 pb-2">
          Now Playing
        </h2>

        {/* YouTube Miniplayer Container */}
        <div className="flex flex-col space-y-3 w-full max-w-[360px]">
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-slate-950/60 shadow-2xl transition-all duration-300 hover:border-emerald-500/30 hover:shadow-emerald-500/5">
            {/* Aspect Video Container */}
            <div className={`relative aspect-video w-full ${!isLeader ? "pointer-events-none" : ""}`}>
              <YouTube
                key={playerKey}
                videoId={song.youtubeId}
                opts={{ 
                  playerVars: { 
                    autoplay: 1,
                    modestbranding: 1,
                    rel: 0,
                    controls: 1
                  } 
                }}
                className="w-full h-full"
                iframeClassName="w-full h-full object-cover"
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
            
            {/* Info bar on the player simulating a miniplayer description overlay */}
            <div className="p-3 bg-slate-900/90 border-t border-white/5 flex flex-col gap-0.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-slate-200 text-sm truncate flex-1" title={song.title}>
                  {song.title}
                </h3>
                <span className="flex-shrink-0 flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Now Playing • YouTube Video
              </p>
            </div>
          </div>

          {/* Skip Button matching the exact width of the player */}
          {isLeader && (
            <button
              onClick={handleEnd}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-950/20 active:scale-[0.98] flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>⊳ Skip to Next</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}