"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"

export default function CreateRoomPage() {
  const [loading, setLoading] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [joinLoading, setJoinLoading] = useState(false)
  const router = useRouter()

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-emerald-400 font-sans">
      <Header />

      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] gap-16 px-6">

        {/* 🔥 Create Room */}
        <div className="text-center flex flex-col gap-6">
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="px-10 py-3 bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-2xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.6)] backdrop-blur-sm border border-emerald-600 hover:border-emerald-400 transition-all duration-200 active:scale-95"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>

          {/* 🎵 Access Playlist */}
          <Link
            href="/playlist"
            className="px-10 py-3 bg-gradient-to-tr from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-2xl font-semibold shadow-[0_0_15px_rgba(139,92,246,0.5)] backdrop-blur-sm border border-purple-600 hover:border-purple-400 transition-all duration-200 active:scale-95"
          >
            My Playlist
          </Link>
        </div>

        {/* 🚪 Join Room */}
        <div className="flex flex-col items-center gap-5">
          <input
            type="text"
            placeholder="Enter Room Code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="w-52 sm:w-64 px-5 py-3 rounded-xl bg-slate-800 border-2 border-emerald-600 text-white text-center tracking-widest uppercase placeholder-emerald-300 shadow-inner shadow-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 backdrop-blur-sm"
          />

          <button
            onClick={handleJoinRoom}
            disabled={joinLoading}
            className="px-10 py-3 bg-gradient-to-tr from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl font-semibold shadow-[0_0_15px_rgba(59,130,246,0.5)] backdrop-blur-sm border border-blue-600 hover:border-blue-400 transition-all duration-200 active:scale-95"
          >
            {joinLoading ? "Joining..." : "Join Room"}
          </button>
        </div>
      </div>
    </div>
  )
}