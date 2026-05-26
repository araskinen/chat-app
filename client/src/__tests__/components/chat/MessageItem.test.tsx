import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Message } from "@/shared/types";

const mockCurrentUser = {
  _id: "u1",
  username: "alice",
  email: "alice@example.com",
  createdAt: "2024-01-01",
};

vi.mock("@/features/auth/store/authStore", () => ({
  useAuthStore: vi.fn((selector?: (s: Record<string, unknown>) => unknown) => {
    const state = { user: mockCurrentUser };
    return typeof selector === "function" ? selector(state) : state;
  }),
}));

const { MessageItem } = await import("@/features/chat/components/MessageItem");

const ownMessage: Message = {
  _id: "m1",
  content: "Hello there!",
  sender: mockCurrentUser,
  room: "r1",
  createdAt: "2024-06-15T14:30:00Z",
};

const otherMessage: Message = {
  _id: "m2",
  content: "Hey back!",
  sender: {
    _id: "u2",
    username: "bob",
    email: "bob@example.com",
    createdAt: "2024-01-01",
  },
  room: "r1",
  createdAt: "2024-06-15T14:31:00Z",
};

describe("MessageItem", () => {
  it("renders message content", () => {
    render(<MessageItem message={ownMessage} />);
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
  });

  it("shows sender username for messages from others", () => {
    render(<MessageItem message={otherMessage} />);
    expect(screen.getByText("bob")).toBeInTheDocument();
  });

  it("does not show sender username for own messages", () => {
    render(<MessageItem message={ownMessage} />);
    expect(screen.queryByText("alice")).not.toBeInTheDocument();
  });

  it("shows avatar initials for messages from others", () => {
    render(<MessageItem message={otherMessage} />);
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("renders a timestamp", () => {
    render(<MessageItem message={ownMessage} />);
    // The exact format depends on locale, but something should be rendered
    const timeEl = document.querySelector(".text-3xs");
    expect(timeEl).toBeInTheDocument();
    expect(timeEl!.textContent).not.toBe("");
  });
});
