"use client";

import { useEffect, useState } from "react";
import SongTile from "./SongTile";
import { useYouTubeMeta } from "@/hooks/useYouTubeMeta";

interface Song {
  id: string;
  title: string;
  thumbnail: string;
  youtubeId: string;
}

interface Props {
  roomCode: string;
  onClose: () => void;

  // This ONLY adds to queue when user clicks a tile
  onAddToQueue: (song: {
    roomCode: string;
    title: string;
    youtubeId: string;
    thumbnail: string;
  }) => void;
}

export default function PlaylistFloating({
  roomCode,
  onClose,
  onAddToQueue,
}: Props) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [leaderEmail, setLeaderEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState("");

  const { getMeta, loading: metaLoading, error: metaError } =
    useYouTubeMeta();

  // 1️⃣ Fetch room leader
  useEffect(() => {
    async function fetchLeader() {
      try {
        const res = await fetch(`/api/room/leader/${roomCode}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        setLeaderEmail(data.leaderEmail);
      } catch (err) {
        console.error("Failed to fetch leader:", err);
      }
    }

    fetchLeader();
  }, [roomCode]);

  // 2️⃣ Fetch playlist songs
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

  // 3️⃣ Add song ONLY to Playlist (DB)
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

      // Update local playlist UI
      setSongs(prev => [data.song, ...prev]);
      setUrlInput("");
    } catch (err) {
      console.error("Failed to add song:", err);
      alert("Failed to add song to playlist");
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start pt-24">
      <div className="bg-slate-900 rounded-xl p-6 w-11/12 max-w-6xl shadow-xl relative flex gap-6">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white font-bold px-3 py-1 bg-red-600 rounded"
        >
          Close
        </button>

        {/* LEFT: Playlist Songs */}
        <div className="flex-1 overflow-y-auto max-h-[80vh]">
          {songs.length === 0 ? (
            <p className="text-emerald-400">
              No songs in playlist yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {songs.map(song => (
                <SongTile
                  key={song.id}
                  title={song.title}
                  thumbnail={song.thumbnail}
                  onAdd={() =>
                    onAddToQueue({
                      roomCode,
                      title: song.title,
                      youtubeId: song.youtubeId,
                      thumbnail: song.thumbnail,
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Add Song Form */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-3">
          <h3 className="text-lg font-bold text-emerald-400">
            Add Song to Playlist
          </h3>

          <form
            onSubmit={handleAddToPlaylist}
            className="flex flex-col gap-2"
          >
            <input
              type="url"
              placeholder="Paste YouTube URL"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white"
              required
            />

            {metaError && (
              <p className="text-red-400 text-xs">
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
    </div>
  );
}