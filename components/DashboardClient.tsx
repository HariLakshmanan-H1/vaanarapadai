"use client"
import { useEffect, useState } from "react"
import NowPlaying from "@/components/NowPlaying"
import QueueList from "@/components/QueueList"
import AddSongForm from "@/components/AddSongForm"
import Header from "@/components/Header"

export default function DashboardClient({ room, isLeader, userEmail }: any) {
  const [queue, setQueue] = useState(room.queue)
  const [activeSong, setActiveSong] = useState<any>(null)

  useEffect(() => {
    if (!activeSong && queue.length > 0) setActiveSong(queue[0])
  }, [queue])

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/room/${room.code}/queue`)
      const data = await res.json()
      setQueue(data.queue)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  async function vote(songId: string) {
    await fetch("/api/room/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId }),
    })
    refresh()
  }

  async function skip() {
    if (!isLeader) return
    await fetch("/api/room/skip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomCode: room.code }),
    })
    refresh()
  }

  async function refresh() {
    const res = await fetch(`/api/room/${room.code}/queue`)
    const data = await res.json()
    setQueue(data.queue)
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div>
        <h1 className="text-4xl font-bold mb-6">{room.name}</h1>
        <Header />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <NowPlaying song={activeSong} onEnd={skip} onStart={() => queue[0] && setActiveSong(queue[0])} isLeader={isLeader} onSkip={skip} />
        </div>

        <div className="flex flex-col gap-4">
          <AddSongForm roomId={room.code} onAdd={refresh} />
          <QueueList songs={queue} onVote={vote} />
        </div>
      </div>
    </main>
  )
}