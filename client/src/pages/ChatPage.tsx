import { RoomSidebar } from "@/features/chat/components/RoomSidebar";
import { ActiveRoomView } from "@/features/chat/components/ActiveRoomView";
import { useSocket } from "@/features/chat/hooks/useSocket";

export const ChatPage = () => {
  useSocket();

  return (
    <div className="flex h-screen font-sans">
      <RoomSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ActiveRoomView />
      </main>

    </div>
  );
}
