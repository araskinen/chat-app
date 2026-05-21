import { useRooms } from "@/features/chat/hooks/useRooms";
import { SidebarHeader } from "./SidebarHeader";
import { RoomList } from "./RoomList";
import { CreateRoomForm } from "./CreateRoomForm";
import { SidebarFooter } from "./SidebarFooter";

export const RoomSidebar = () => {
  const {
    rooms,
    activeRoomId,
    roomsError,
    handleSelectRoom,
    handleCreateRoom,
  } = useRooms();
  return (
    <aside className="w-60 bg-sidebar text-sidebar-text flex flex-col shrink-0">
      <SidebarHeader />

      {roomsError && (
        <div className="px-4 py-2 bg-red-900/40 text-red-300 text-xs">
          {roomsError}
        </div>
      )}

      <RoomList
        rooms={rooms}
        activeRoomId={activeRoomId}
        onSelectRoom={handleSelectRoom}
      />

      <CreateRoomForm onCreateRoom={handleCreateRoom} />
      <SidebarFooter />
    </aside>
  );
};
