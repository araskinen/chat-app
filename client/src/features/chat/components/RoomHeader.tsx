import type { Room } from "@/shared/types";

interface Props {
  room: Room;
  error?: string | null;
}

export const RoomHeader = ({ room, error }: Props) => (
  <>
    <div className="px-4 py-3 border-b border-line font-medium">
      # {room.name}
      {room.description && (
        <span className="font-normal text-2xs text-muted ml-2">
          — {room.description}
        </span>
      )}
    </div>

    {error && (
      <div className="px-4 py-2 bg-error-surface text-error text-sm border-b border-error-border">
        {error}
      </div>
    )}
  </>
);
