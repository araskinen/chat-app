import { useChatStore } from "@/features/chat/store/chatStore";
import { useMessages } from "@/features/chat/hooks/useMessages";
import { RoomHeader } from "./RoomHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

export const ActiveRoomView = () => {
  const activeRoomId = useChatStore((s) => s.activeRoomId);
  const activeRoom = useChatStore((s) =>
    s.rooms.find((r) => r._id === activeRoomId),
  );
  const { messages, typingUsers, sendMessage, onTyping, error } =
    useMessages(activeRoomId);

  if (!activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center text-faint text-[15px]">
        Select a room to start chatting
      </div>
    );
  }

  return (
    <>
      <RoomHeader room={activeRoom} error={error} />
      <MessageList messages={messages} typingUsers={typingUsers} />
      <MessageInput onSend={sendMessage} onTyping={onTyping} />
    </>
  );
};
