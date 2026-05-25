import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

const mockAddMessage = vi.fn();
const mockSetTyping = vi.fn();

vi.mock("@/features/chat/store/chatStore", () => ({
  useChatStore: vi.fn((selector?: (s: Record<string, unknown>) => unknown) => {
    const state = { addMessage: mockAddMessage, setTyping: mockSetTyping };
    return typeof selector === "function" ? selector(state) : state;
  }),
}));

const mockOn = vi.fn();
const mockOff = vi.fn();
const mockSocket = { on: mockOn, off: mockOff };

vi.mock("@/shared/services/socket", () => ({
  getSocket: vi.fn(() => mockSocket),
}));

const { useSocket } = await import("@/features/chat/hooks/useSocket");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useSocket", () => {
  it("registers message:new listener on mount", () => {
    renderHook(() => useSocket());
    const call = mockOn.mock.calls.find((c) => c[0] === "message:new");
    expect(call).toBeDefined();
    expect(call![1]).toBe(mockAddMessage);
  });

  it("registers user:typing listener on mount", () => {
    renderHook(() => useSocket());
    const call = mockOn.mock.calls.find((c) => c[0] === "user:typing");
    expect(call).toBeDefined();
  });

  it("registers user:stopped-typing listener on mount", () => {
    renderHook(() => useSocket());
    const call = mockOn.mock.calls.find((c) => c[0] === "user:stopped-typing");
    expect(call).toBeDefined();
  });

  it("user:typing handler calls setTyping with isTyping=true", () => {
    renderHook(() => useSocket());
    const handler = mockOn.mock.calls.find((c) => c[0] === "user:typing")![1];
    handler({ username: "alice", roomId: "r1" });
    expect(mockSetTyping).toHaveBeenCalledWith("r1", "alice", true);
  });

  it("user:stopped-typing handler calls setTyping with isTyping=false", () => {
    renderHook(() => useSocket());
    const handler = mockOn.mock.calls.find(
      (c) => c[0] === "user:stopped-typing",
    )![1];
    handler({ username: "alice", roomId: "r1" });
    expect(mockSetTyping).toHaveBeenCalledWith("r1", "alice", false);
  });

  it("removes all listeners on unmount", () => {
    const { unmount } = renderHook(() => useSocket());
    unmount();
    expect(mockOff).toHaveBeenCalledWith("message:new", mockAddMessage);
    expect(mockOff).toHaveBeenCalledWith("user:typing");
    expect(mockOff).toHaveBeenCalledWith("user:stopped-typing");
    expect(mockOff).toHaveBeenCalledWith("error");
  });
});
