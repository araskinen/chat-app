import { useEffect, useState } from "react";
import { RoomSidebar } from "@/components/chat/RoomSidebar";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { useSocket } from "@/hooks/useSocket";
import { useMessages } from "@/hooks/useMessages";
import { useChatStore } from "@/store/chatStore";
import { roomsApi, getErrorMessage } from "@/services/api";
import { getSocket } from "@/services/socket";

export function ChatPage() {
  useSocket();

  const { rooms, activeRoomId, setRooms, addRoom, setActiveRoom } =
    useChatStore();
  const { messages, typingUsers, sendMessage, onTyping, error: messagesError } =
    useMessages(activeRoomId);

  const [roomsError, setRoomsError] = useState<string | null>(null);

  useEffect(() => {
    roomsApi
      .list()
      .then(setRooms)
      .catch((err) =>
        setRoomsError(getErrorMessage(err, "Failed to load rooms")),
      );
  }, [setRooms]);

  const handleSelectRoom = (roomId: string) => {
    if (activeRoomId) getSocket().emit("room:leave", activeRoomId);
    setActiveRoom(roomId);
    getSocket().emit("room:join", roomId);
  };

  const handleCreateRoom = async (name: string, description?: string) => {
    try {
      setRoomsError(null);
      const room = await roomsApi.create(name, description);
      addRoom(room);
      handleSelectRoom(room._id);
    } catch (err) {
      setRoomsError(getErrorMessage(err, "Failed to create room"));
    }
  };

  const activeRoom = rooms.find((r) => r._id === activeRoomId);

  return (
    <div className="flex h-screen font-sans">
      <RoomSidebar
        rooms={rooms}
        activeRoomId={activeRoomId}
        onSelectRoom={handleSelectRoom}
        onCreateRoom={handleCreateRoom}
        error={roomsError}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {activeRoom ? (
          <>
            <div className="px-4 py-3 border-b border-[#e5e5e5] font-medium">
              # {activeRoom.name}
              {activeRoom.description && (
                <span className="font-normal text-[13px] text-[#888] ml-2">
                  — {activeRoom.description}
                </span>
              )}
            </div>

            {messagesError && (
              <div className="px-4 py-2 bg-[#FCEBEB] text-[#A32D2D] text-sm border-b border-[#f5c6c6]">
                {messagesError}
              </div>
            )}

            <MessageList messages={messages} typingUsers={typingUsers} />
            <MessageInput onSend={sendMessage} onTyping={onTyping} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#aaa] text-[15px]">
            Select a room to start chatting
          </div>
        )}
      </main>
    </div>
  );
}
