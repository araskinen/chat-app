import type { Room } from "@/types";

interface Props {
  room: Room;
  error?: string | null;
}

export const RoomHeader = ({ room, error }: Props) => (
  <>
    <div className="px-4 py-3 border-b border-[#e5e5e5] font-medium">
      # {room.name}
      {room.description && (
        <span className="font-normal text-[13px] text-[#888] ml-2">
          — {room.description}
        </span>
      )}
    </div>

    {error && (
      <div className="px-4 py-2 bg-[#FCEBEB] text-[#A32D2D] text-sm border-b border-[#f5c6c6]">
        {error}
      </div>
    )}
  </>
);
