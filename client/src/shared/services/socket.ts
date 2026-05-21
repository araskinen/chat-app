import { io, Socket } from "socket.io-client";

// ─── Typed event maps ────────────────────────────────────────────────────────

export interface ServerToClientEvents {
  "message:new": (message: import("@/shared/types").Message) => void;
  "user:typing": (payload: { username: string; roomId: string }) => void;
  "user:stopped-typing": (payload: {
    username: string;
    roomId: string;
  }) => void;
  "room:user-joined": (payload: { userId: string; username: string }) => void;
  "room:user-left": (payload: { userId: string; username: string }) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  "room:join": (roomId: string) => void;
  "room:leave": (roomId: string) => void;
  "message:send": (payload: { roomId: string; content: string }) => void;
  "typing:start": (roomId: string) => void;
  "typing:stop": (roomId: string) => void;
}

// ─── Singleton ───────────────────────────────────────────────────────────────

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      autoConnect: false,
      auth: { token: localStorage.getItem("token") },
    });
  }
  return socket;
};

export const connectSocket = (token: string) => {
  const s = getSocket();
  s.auth = { token };
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
