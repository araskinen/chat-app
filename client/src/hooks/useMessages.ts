import { useEffect, useRef, useCallback, useState } from "react";
import { messagesApi, getErrorMessage } from "@/services/api";
import { getSocket } from "@/services/socket";
import { useChatStore } from "@/store/chatStore";

const TYPING_DEBOUNCE_MS = 1500;

export const useMessages = (roomId: string | null) => {
  const messages = useChatStore((s) =>
    roomId ? (s.messages[roomId] ?? []) : [],
  );
  const setMessages = useChatStore((s) => s.setMessages);
  const typingUsers = useChatStore((s) =>
    roomId ? (s.typingUsers[roomId] ?? []) : [],
  );
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;
    setError(null);
    messagesApi
      .list(roomId)
      .then((msgs) => setMessages(roomId, msgs))
      .catch((err) => setError(getErrorMessage(err, "Failed to load messages")));
  }, [roomId, setMessages]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!roomId || !content.trim()) return;
      getSocket().emit("message:send", { roomId, content: content.trim() });
    },
    [roomId],
  );

  const onTyping = useCallback(() => {
    if (!roomId) return;
    const socket = getSocket();
    socket.emit("typing:start", roomId);

    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit("typing:stop", roomId);
    }, TYPING_DEBOUNCE_MS);
  }, [roomId]);

  return { messages, typingUsers, sendMessage, onTyping, error };
}
