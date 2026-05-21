import { create } from "zustand";
import type { Room, Message } from "@/shared/types";

interface ChatState {
  rooms: Room[];
  activeRoomId: string | null;
  messages: Record<string, Message[]>; // keyed by roomId
  typingUsers: Record<string, string[]>; // roomId → usernames

  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  setActiveRoom: (roomId: string) => void;
  setMessages: (roomId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setTyping: (roomId: string, username: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  activeRoomId: null,
  messages: {},
  typingUsers: {},

  setRooms: (rooms) => set({ rooms }),

  addRoom: (room) => set((s) => ({ rooms: [...s.rooms, room] })),

  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

  setMessages: (roomId, messages) =>
    set((s) => ({ messages: { ...s.messages, [roomId]: messages } })),

  addMessage: (message) =>
    set((s) => {
      const prev = s.messages[message.room] ?? [];
      return {
        messages: { ...s.messages, [message.room]: [...prev, message] },
      };
    }),

  setTyping: (roomId, username, isTyping) =>
    set((s) => {
      const current = s.typingUsers[roomId] ?? [];
      const updated = isTyping
        ? Array.from(new Set([...current, username]))
        : current.filter((u) => u !== username);
      return { typingUsers: { ...s.typingUsers, [roomId]: updated } };
    }),
}));
