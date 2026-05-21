import { useState } from "react";
import type { Room } from "@/types";
import { useAuthStore } from "@/store/authStore";

interface Props {
  rooms: Room[];
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onCreateRoom: (name: string, description?: string) => void;
  error?: string | null;
}

export const RoomSidebar = ({
  rooms,
  activeRoomId,
  onSelectRoom,
  onCreateRoom,
  error,
}: Props) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [creating, setCreating] = useState(false);
  const [roomName, setRoomName] = useState("");

  const handleCreate = () => {
    if (!roomName.trim()) return;
    onCreateRoom(roomName.trim());
    setRoomName("");
    setCreating(false);
  };

  return (
    <aside className="w-60 bg-[#2C2C2A] text-[#D3D1C7] flex flex-col shrink-0">
      <div className="p-4 border-b border-[#444]">
        <div className="font-semibold text-[15px] text-white">💬 ChatApp</div>
        <div className="text-xs text-[#888] mt-0.5">@{user?.username}</div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-900/40 text-red-300 text-[12px]">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-[1px]">
          Rooms
        </div>
        {rooms.map((room) => (
          <button
            key={room._id}
            onClick={() => onSelectRoom(room._id)}
            className={`w-full text-left px-4 py-2 border-none cursor-pointer text-sm rounded-none ${
              activeRoomId === room._id
                ? "bg-[#3C3489] text-white"
                : "bg-transparent text-[#B4B2A9]"
            }`}
          >
            # {room.name}
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-[#444]">
        {creating ? (
          <div className="flex gap-1.5">
            <input
              autoFocus
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setCreating(false);
              }}
              placeholder="Room name"
              className="flex-1 px-2 py-[0.4rem] rounded-md border border-[#555] bg-[#3d3d3a] text-white text-[13px]"
            />
            <button
              onClick={handleCreate}
              className="px-[0.6rem] py-[0.4rem] rounded-md border-none bg-[#534AB7] text-white cursor-pointer text-[13px]"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="w-full p-2 rounded-md border border-dashed border-[#555] bg-transparent text-[#888] cursor-pointer text-[13px]"
          >
            + New room
          </button>
        )}
      </div>

      <div className="p-3 border-t border-[#444]">
        <button
          onClick={logout}
          className="w-full p-2 rounded-md border-none bg-[#3d3d3a] text-[#aaa] cursor-pointer text-[13px]"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
