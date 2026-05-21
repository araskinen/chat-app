import { useState } from "react";

interface Props {
  onCreateRoom: (name: string) => void;
}

export const CreateRoomForm = ({ onCreateRoom }: Props) => {
  const [creating, setCreating] = useState(false);
  const [roomName, setRoomName] = useState("");

  const handleCreate = () => {
    if (!roomName.trim()) return;
    onCreateRoom(roomName.trim());
    setRoomName("");
    setCreating(false);
  };

  return (
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
  );
};
