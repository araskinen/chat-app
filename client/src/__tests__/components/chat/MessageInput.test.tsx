import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageInput } from "@/features/chat/components/MessageInput";

const onSend = vi.fn();
const onTyping = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("MessageInput", () => {
  it("renders a textarea and send button", () => {
    render(<MessageInput onSend={onSend} onTyping={onTyping} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onTyping when user types", async () => {
    render(<MessageInput onSend={onSend} onTyping={onTyping} />);
    await userEvent.type(screen.getByRole("textbox"), "H");
    expect(onTyping).toHaveBeenCalled();
  });

  it("calls onSend with the trimmed message on button click", async () => {
    render(<MessageInput onSend={onSend} onTyping={onTyping} />);
    await userEvent.type(screen.getByRole("textbox"), "  Hello world  ");
    await userEvent.click(screen.getByRole("button"));
    expect(onSend).toHaveBeenCalledWith("  Hello world  ");
  });

  it("clears the textarea after sending", async () => {
    render(<MessageInput onSend={onSend} onTyping={onTyping} />);
    const textarea = screen.getByRole("textbox");
    await userEvent.type(textarea, "message");
    await userEvent.click(screen.getByRole("button"));
    expect((textarea as HTMLTextAreaElement).value).toBe("");
  });

  it("does not call onSend when input is empty", async () => {
    render(<MessageInput onSend={onSend} onTyping={onTyping} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not call onSend for whitespace-only input", async () => {
    render(<MessageInput onSend={onSend} onTyping={onTyping} />);
    await userEvent.type(screen.getByRole("textbox"), "   ");
    await userEvent.click(screen.getByRole("button"));
    expect(onSend).not.toHaveBeenCalled();
  });

  it("sends message on Enter key press", async () => {
    render(<MessageInput onSend={onSend} onTyping={onTyping} />);
    const textarea = screen.getByRole("textbox");
    await userEvent.type(textarea, "hello");
    await userEvent.keyboard("{Enter}");
    expect(onSend).toHaveBeenCalledWith("hello");
  });

  it("does not send on Shift+Enter", async () => {
    render(<MessageInput onSend={onSend} onTyping={onTyping} />);
    await userEvent.type(screen.getByRole("textbox"), "hello");
    await userEvent.keyboard("{Shift>}{Enter}{/Shift}");
    expect(onSend).not.toHaveBeenCalled();
  });

  it("disables textarea and button when disabled prop is true", () => {
    render(<MessageInput onSend={onSend} onTyping={onTyping} disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
