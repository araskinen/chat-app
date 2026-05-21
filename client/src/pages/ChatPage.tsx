import { RoomSidebar } from "@/components/chat/RoomSidebar";
import { ActiveRoomView } from "@/components/chat/ActiveRoomView";
import { useSocket } from "@/hooks/useSocket";

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
