"use client";

interface Props {
  title: string;
  thumbnail: string;
  onDelete?: () => void; // optional for future use
}

export default function PlaylistSongTile({
  title,
  thumbnail,
  onDelete,
}: Props) {
  return (
    <div className="group bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-emerald-500/20 transition duration-300 flex flex-col">

      {/* Thumbnail */}
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Optional Delete Button (only if passed) */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
          >
            Delete
          </button>
        )}
      </div>

      {/* Title */}
      <div className="p-4 flex-1 flex items-center">
        <h4 className="text-sm text-white font-semibold line-clamp-2">
          {title}
        </h4>
      </div>
    </div>
  );
}