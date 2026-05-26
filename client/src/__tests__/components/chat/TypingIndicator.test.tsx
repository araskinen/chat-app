import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TypingIndicator } from "@/features/chat/components/TypingIndicator";

describe("TypingIndicator", () => {
  it("renders nothing when no users are typing", () => {
    const { container } = render(<TypingIndicator typingUsers={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows "is typing…" for a single user', () => {
    render(<TypingIndicator typingUsers={["alice"]} />);
    expect(screen.getByText(/alice is typing…/)).toBeInTheDocument();
  });

  it('shows "are typing…" for multiple users', () => {
    render(<TypingIndicator typingUsers={["alice", "bob"]} />);
    expect(screen.getByText(/alice, bob are typing…/)).toBeInTheDocument();
  });

  it("lists all typing users separated by commas", () => {
    render(<TypingIndicator typingUsers={["alice", "bob", "carol"]} />);
    expect(screen.getByText(/alice, bob, carol/)).toBeInTheDocument();
  });
});
