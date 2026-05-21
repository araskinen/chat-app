import type { Room } from "@/types";

interface Props {
  room: Room;
  isActive: boolean;
  onSelect: (roomId: string) => void;
}

export const RoomItem = ({ room, isActive, onSelect }: Props) => (
  <button
    onClick={() => onSelect(room._id)}
    className={`w-full text-left px-4 py-2 border-none cursor-pointer text-sm rounded-none ${
      isActive ? "bg-[#3C3489] text-white" : "bg-transparent text-[#B4B2A9]"
    }`}
  >
    # {room.name}
  </button>
);
