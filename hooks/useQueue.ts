"use client"

import { useState, useEffect, useCallback } from "react"

export interface Song {
  id: string
  code: string
  title: string
  youtubeId: string
  votes: number
  createdAt: number
  played: boolean
}

function sortQueue(songs: Song[]): Song[] {
  return [...songs].sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes
    return a.createdAt - b.createdAt
  })
}

export function useQueue(code: string) {
  const [activeSong, setActiveSong] = useState<Song | null>(null)
  const [queue, setQueue] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // -----------------------------
  // Fetch Queue (DB Source of Truth)
  // -----------------------------
  const fetchQueue = useCallback(async () => {
  if (!code) return

  try {
    setLoading(true)

    const res = await fetch(`/api/room/${code}/queue`)
    const data = await res.json()

    if (!res.ok) throw new Error(data.error)

    const { currentSong, queue } = data

    const normalizedQueue = sortQueue(
      queue.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt).getTime(),
        played: s.played ?? false,
      }))
    )

    setActiveSong(
      currentSong
        ? {
            ...currentSong,
            createdAt: new Date(currentSong.createdAt).getTime(),
            played: currentSong.played ?? false,
          }
        : null
    )

    setQueue(normalizedQueue)
    setError(null)
  } catch (err: any) {
    setError(err.message || "Failed to load queue")
  } finally {
    setLoading(false)
  }
}, [code])

  // -----------------------------
  // Initial Fetch
  // -----------------------------
  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  // -----------------------------
  // Optional Polling (3s sync)
  // -----------------------------
  useEffect(() => {
    if (!code) return

    const interval = setInterval(fetchQueue, 3000)
    return () => clearInterval(interval)
  }, [code, fetchQueue])

  // -----------------------------
  // Add Song (DB → Refetch)
  // -----------------------------
  async function addSong(
    song: Omit<Song, "id" | "votes" | "createdAt" | "played">
  ) {
    await fetch(`/api/room/${code}/queue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(song),
    })

    await fetchQueue()
  }

  // -----------------------------
  // Vote (DB → Refetch)
  // -----------------------------
  async function vote(id: string) {
    await fetch(`/api/room/${code}/queue`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId: id }),
    })

    await fetchQueue()
  }

  // -----------------------------
  // Next Song (Leader Delete → Refetch)
  // -----------------------------
  async function next() {
    if (!activeSong) return

    await fetch(`/api/room/${code}/queue`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId: activeSong.id }),
    })

    await fetchQueue()
  }

  return {
    queue,
    activeSong,
    addSong,
    vote,
    next,
    loading,
    error,
    fetchQueue,      // useful if NowPlaying needs manual sync
    setActiveSong,   // keep this only if truly necessary
  }
}