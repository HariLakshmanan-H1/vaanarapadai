"use client";

interface Props {
  title: string;
  thumbnail: string;
  onAdd: () => void;
}

export default function SongTile({ title, thumbnail, onAdd }: Props) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col">

      <img
        src={thumbnail}
        alt={title}
        className="w-full h-40 object-cover"
      />

      <div className="p-3 flex flex-col gap-2 flex-1">
        <h4 className="text-sm text-white font-semibold line-clamp-2">
          {title}
        </h4>

        <button
          onClick={onAdd}
          className="mt-auto bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-1 px-3 rounded transition"
        >
          Add to Queue
        </button>
      </div>
    </div>
  );
}