import { useState } from "react"

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)

    if (parsed.searchParams.get("v")) {
      return parsed.searchParams.get("v")
    }

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1)
    }

    return null
  } catch {
    return null
  }
}

export function useYouTubeMeta() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function getMeta(url: string) {
    setError(null)

    const videoId = extractVideoId(url)

    if (!videoId) {
      setError("Invalid YouTube URL")
      return null
    }

    try {
      setLoading(true)

      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      )

      if (!response.ok) throw new Error()

      const data = await response.json()

      return {
        videoId,
        title: data.title,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      }
    } catch {
      setError("Could not fetch video info")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { getMeta, loading, error }
}