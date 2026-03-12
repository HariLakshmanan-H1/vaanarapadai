"use client"
import { useEffect, useState } from "react"
import NowPlaying from "@/components/NowPlaying"
import QueueList from "@/components/QueueList"
import AddSongForm from "@/components/AddSongForm"
import Header from "@/components/Header"
import gsap from "gsap"
import { useRef } from "react"

export default function DashboardClient({ room, isLeader, userEmail }: any) {
  const [queue, setQueue] = useState(room.queue)
  const [activeSong, setActiveSong] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activeSong && queue.length > 0) setActiveSong(queue[0])
  }, [queue])

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
        }
      )
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/room/${room.code}/queue`)
      const data = await res.json()
      setQueue(data.queue)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  async function vote(songId: string) {
    // Optimistic Update
    setQueue((prevQueue: any[]) =>
      prevQueue
        .map((s) => (s.id === songId ? { ...s, votes: s.votes + 1, hasVoted: true } : s))
        .sort((a, b) => {
          if (b.votes !== a.votes) return b.votes - a.votes
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })
    )

    try {
      const res = await fetch("/api/room/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
      })

      if (!res.ok) {
        // Simple rollback if error
        refresh()
      }
    } catch (error) {
       refresh()
    }
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
    <main ref={containerRef} className="min-h-screen bg-transparent p-6 text-white space-y-6 relative z-10">
      <div>
        <h1 className="text-4xl font-bold mb-6">{room.name}</h1>
        <Header />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <NowPlaying song={activeSong} onEnd={skip} roomCode={room.code} />
        </div>

        <div className="flex flex-col gap-4">
          <AddSongForm roomCode={room.code} onAdd={refresh} />
          <QueueList songs={queue} onVote={vote} />
        </div>
      </div>
    </main>
  )
}