"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useYouTubeMeta } from "@/hooks/useYouTubeMeta";
import Header from "@/components/Header";
import Link from "next/link";
import gsap from "gsap";
import { useRef } from "react";

interface Song {
  id: string;
  title: string;
  thumbnail: string;
  youtubeId: string;
}

export default function PlaylistPage() {
  const { data: session, status } = useSession();
  const leaderEmail = session?.user?.email;
  console.log(session);

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { getMeta, loading: metaLoading, error: metaError } =
    useYouTubeMeta();

  // ===============================
  // GSAP Animations
  // ===============================
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading]);

  // ===============================
  // Fetch Playlist
  // ===============================
  useEffect(() => {
    if (!leaderEmail) return;
    
    async function fetchPlaylist() {
      try {
        const res = await fetch(`/api/playlist/${leaderEmail}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        setSongs(data.songs || []);
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylist();
  }, [leaderEmail]);

  // ===============================
  // Add Song
  // ===============================
  const handleAddToPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderEmail) return;

    const meta = await getMeta(urlInput);

    if (!meta) {
      alert(metaError || "Invalid YouTube URL");
      return;
    }

    try {
      const res = await fetch(`/api/playlist/add-song`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaderEmail,
          title: meta.title,
          youtubeId: meta.videoId,
          thumbnail: meta.thumbnail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSongs(prev => [data.song, ...prev]);
      setUrlInput("");
    } catch (err) {
      console.error("Failed to add song:", err);
      alert("Failed to add song");
    }
  };

  // ===============================
  // Delete Song
  // ===============================
  const handleDeleteSong = async (songId: string) => {
    if (!leaderEmail) return;

    try {
      setDeletingId(songId);

      const res = await fetch("/api/playlist/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          songId,
          leaderEmail: leaderEmail, 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSongs(prev => prev.filter(song => song.id !== songId));
    } catch (err) {
      console.error("Failed to delete song:", err);
      alert("Failed to delete song");
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading") return null;

  return (
    <div className="min-h-screen bg-slate-950 text-emerald-400">
      <Header />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Playlist</h1>

        <div ref={containerRef} className="flex gap-8 flex-col lg:flex-row">
          {/* LEFT: Song Grid */}
          <div className="flex-1">
            {loading ? (
              <p>Loading playlist...</p>
            ) : songs.length === 0 ? (
              <p>No songs in playlist yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {songs.map(song => (
                  <div
                    key={song.id}
                    className="relative bg-slate-900 rounded-lg p-3"
                  >
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-full h-40 object-cover rounded"
                    />

                    <p className="mt-2 text-sm font-medium">
                      {song.title}
                    </p>

                    <button
                      onClick={() => handleDeleteSong(song.id)}
                      disabled={deletingId === song.id}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded disabled:opacity-50"
                    >
                      {deletingId === song.id ? "..." : "✕"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Add Song */}
          <div className="w-80 flex-shrink-0 flex flex-col gap-4">
            <h2 className="text-xl font-semibold">
              Add Song to Playlist
            </h2>

            <form
              onSubmit={handleAddToPlaylist}
              className="flex flex-col gap-3"
            >
              <input
                type="url"
                placeholder="Paste YouTube URL"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                className="p-2 rounded bg-gray-800 text-white"
                required
              />

              {metaError && (
                <p className="text-red-400 text-sm">
                  {metaError}
                </p>
              )}

              <button
                type="submit"
                disabled={metaLoading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded disabled:opacity-50"
              >
                {metaLoading ? "Fetching..." : "Add to Playlist"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/room/create"
            className="px-4 py-2 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition"
          >
            ← Create Room
          </Link>
        </div>
      </div>
    </div>
  );
}