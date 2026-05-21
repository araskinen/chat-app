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
    <div className="p-3 border-t border-sidebar-border">
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
            className="flex-1 px-2 py-1.5 rounded-md border border-subtle bg-sidebar-input text-white text-2xs"
          />
          <button
            onClick={handleCreate}
            className="px-2.5 py-1.5 rounded-md border-none bg-brand text-white cursor-pointer text-2xs"
          >
            +
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="w-full p-2 rounded-md border border-dashed border-subtle bg-transparent text-muted cursor-pointer text-2xs"
        >
          + New room
        </button>
      )}
    </div>
  );
};
