import { useEffect } from "react";
import { getSocket } from "@/services/socket";
import { useChatStore } from "@/store/chatStore";

/**
 * Registers all Socket.IO event listeners and keeps the Zustand chat store
 * in sync. Mount once at the top of the authenticated layout.
 */
export const useSocket = () => {
  const addMessage = useChatStore((s) => s.addMessage);
  const setTyping = useChatStore((s) => s.setTyping);

  useEffect(() => {
    const socket = getSocket();

    socket.on("message:new", addMessage);

    socket.on("user:typing", ({ username, roomId }) =>
      setTyping(roomId, username, true),
    );
    socket.on("user:stopped-typing", ({ username, roomId }) =>
      setTyping(roomId, username, false),
    );

    socket.on("error", (msg) => console.error("[socket error]", msg));

    return () => {
      socket.off("message:new", addMessage);
      socket.off("user:typing");
      socket.off("user:stopped-typing");
      socket.off("error");
    };
  }, [addMessage, setTyping]);
}
