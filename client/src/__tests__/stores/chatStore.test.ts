import { describe, it, expect, beforeEach } from "vitest";
import { useChatStore } from "@/features/chat/store/chatStore";
import type { Room, Message } from "@/shared/types";

const mockRoom = (id: string, name: string): Room => ({
  _id: id,
  name,
  createdBy: "u1",
  members: ["u1"],
  createdAt: "2024-01-01",
});

const mockMessage = (id: string, room: string, content: string): Message => ({
  _id: id,
  content,
  sender: {
    _id: "u1",
    username: "alice",
    email: "alice@example.com",
    createdAt: "2024-01-01",
  },
  room,
  createdAt: "2024-01-01T10:00:00Z",
});

beforeEach(() => {
  useChatStore.setState({
    rooms: [],
    activeRoomId: null,
    messages: {},
    typingUsers: {},
  });
});

describe("setRooms", () => {
  it("replaces the rooms array", () => {
    const rooms = [mockRoom("r1", "general"), mockRoom("r2", "random")];
    useChatStore.getState().setRooms(rooms);
    expect(useChatStore.getState().rooms).toEqual(rooms);
  });
});

describe("addRoom", () => {
  it("appends a room to the list", () => {
    useChatStore.getState().setRooms([mockRoom("r1", "general")]);
    useChatStore.getState().addRoom(mockRoom("r2", "random"));
    expect(useChatStore.getState().rooms).toHaveLength(2);
    expect(useChatStore.getState().rooms[1]._id).toBe("r2");
  });
});

describe("setActiveRoom", () => {
  it("updates activeRoomId", () => {
    useChatStore.getState().setActiveRoom("r1");
    expect(useChatStore.getState().activeRoomId).toBe("r1");
  });
});

describe("setMessages", () => {
  it("stores messages keyed by roomId", () => {
    const messages = [mockMessage("m1", "r1", "Hello")];
    useChatStore.getState().setMessages("r1", messages);
    expect(useChatStore.getState().messages["r1"]).toEqual(messages);
  });

  it("does not overwrite messages for other rooms", () => {
    useChatStore
      .getState()
      .setMessages("r1", [mockMessage("m1", "r1", "Hello")]);
    useChatStore
      .getState()
      .setMessages("r2", [mockMessage("m2", "r2", "World")]);
    expect(useChatStore.getState().messages["r1"]).toHaveLength(1);
    expect(useChatStore.getState().messages["r2"]).toHaveLength(1);
  });
});

describe("addMessage", () => {
  it("appends a message to the correct room", () => {
    useChatStore
      .getState()
      .setMessages("r1", [mockMessage("m1", "r1", "First")]);
    useChatStore.getState().addMessage(mockMessage("m2", "r1", "Second"));
    expect(useChatStore.getState().messages["r1"]).toHaveLength(2);
    expect(useChatStore.getState().messages["r1"][1].content).toBe("Second");
  });

  it("creates room message list if it does not exist", () => {
    useChatStore.getState().addMessage(mockMessage("m1", "r1", "First"));
    expect(useChatStore.getState().messages["r1"]).toHaveLength(1);
  });

  it("does not affect messages in other rooms", () => {
    useChatStore
      .getState()
      .setMessages("r2", [mockMessage("m1", "r2", "Other")]);
    useChatStore.getState().addMessage(mockMessage("m2", "r1", "New"));
    expect(useChatStore.getState().messages["r2"]).toHaveLength(1);
  });
});

describe("setTyping", () => {
  it("adds a user to typing list", () => {
    useChatStore.getState().setTyping("r1", "alice", true);
    expect(useChatStore.getState().typingUsers["r1"]).toContain("alice");
  });

  it("removes a user from typing list", () => {
    useChatStore.getState().setTyping("r1", "alice", true);
    useChatStore.getState().setTyping("r1", "alice", false);
    expect(useChatStore.getState().typingUsers["r1"]).not.toContain("alice");
  });

  it("does not add duplicate users", () => {
    useChatStore.getState().setTyping("r1", "alice", true);
    useChatStore.getState().setTyping("r1", "alice", true);
    expect(useChatStore.getState().typingUsers["r1"]).toHaveLength(1);
  });

  it("tracks typing independently per room", () => {
    useChatStore.getState().setTyping("r1", "alice", true);
    useChatStore.getState().setTyping("r2", "bob", true);
    expect(useChatStore.getState().typingUsers["r1"]).toEqual(["alice"]);
    expect(useChatStore.getState().typingUsers["r2"]).toEqual(["bob"]);
  });
});
