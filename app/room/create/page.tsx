"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import gsap from "gsap"
import { useEffect, useRef } from "react"

export default function CreateRoomPage() {
  const [loading, setLoading] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [joinLoading, setJoinLoading] = useState(false)
  const router = useRouter()

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Select the direct children (the Create section and Join section)
    const elements = containerRef.current.children

    gsap.fromTo(
      elements,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      }
    )
  }, [])

  // 🎯 Create Room
  const handleCreateRoom = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/room/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "dummy" }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to create room")
        return
      }

      router.push(`/dashboard/${data.code}`)
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // 🚪 Join Room
  const handleJoinRoom = () => {
    const formatted = joinCode.trim().toUpperCase()

    if (formatted.length !== 6) {
      alert("Room code must be 6 characters")
      return
    }

    setJoinLoading(true)
    router.push(`/dashboard/${formatted}`)
  }

  return (
    <div className="min-h-screen bg-transparent text-white font-sans">
      <Header />

      <div ref={containerRef} className="flex flex-col items-center justify-center h-[calc(100vh-80px)] gap-12 px-6 relative z-10">

        {/* 🔥 Create Room Section */}
        <div className="glass-panel p-10 rounded-[40px] border-emerald-500/20 shadow-2xl flex flex-col items-center gap-8 max-w-md w-full text-center">
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-[0.4em] text-emerald-500">Host Room</h2>
            <p className="text-white/40 text-xs font-medium">Start a new synchronized session</p>
          </div>

          <div className="flex flex-col w-full gap-4">
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
            >
              {loading ? "Initializing..." : "Create New Room"}
            </button>

            <Link
              href="/playlist"
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest border border-white/10 transition-all duration-300 text-center"
            >
              Open My Playlist
            </Link>
          </div>
        </div>

        {/* 🚪 Join Room Section */}
        <div className="w-full max-w-xs flex flex-col items-center gap-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ROOM CODE"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-center tracking-[0.5em] font-black placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-2xl border border-emerald-500/0 pointer-events-none group-focus-within:border-emerald-500/20 transition-all" />
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={joinLoading}
            className="px-12 py-3 bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-white rounded-full font-black uppercase text-[10px] tracking-widest transition-all duration-300 transform hover:scale-105"
          >
            {joinLoading ? "Connecting..." : "Enter Room"}
          </button>
        </div>
      </div>
    </div>
  )
}