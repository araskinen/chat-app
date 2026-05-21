import { useState, type KeyboardEvent } from "react";

interface Props {
  onSend: (content: string) => void;
  onTyping: () => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, onTyping, disabled }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: "0.75rem 1rem",
        borderTop: "1px solid #e5e5e5",
      }}
    >
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onTyping();
        }}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder="Type a message… (Enter to send)"
        rows={1}
        style={{
          flex: 1,
          padding: "0.5rem 0.75rem",
          borderRadius: 8,
          border: "1px solid #ddd",
          resize: "none",
          fontSize: 14,
          fontFamily: "inherit",
          lineHeight: 1.5,
        }}
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        style={{
          padding: "0 1.25rem",
          borderRadius: 8,
          border: "none",
          background: "#534AB7",
          color: "#fff",
          fontWeight: 500,
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        Send
      </button>
    </div>
  );
}
