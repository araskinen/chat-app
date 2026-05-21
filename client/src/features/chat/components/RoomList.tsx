import type { Room } from "@/shared/types";
import { RoomItem } from "./RoomItem";

interface Props {
  rooms: Room[];
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export const RoomList = ({ rooms, activeRoomId, onSelectRoom }: Props) => (
  <div className="flex-1 overflow-y-auto py-2">
    <div className="px-4 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-[1px]">
      Rooms
    </div>
    {rooms.map((room) => (
      <RoomItem
        key={room._id}
        room={room}
        isActive={activeRoomId === room._id}
        onSelect={onSelectRoom}
      />
    ))}
  </div>
);
