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
    <div className="flex gap-2 px-4 py-3 border-t border-[#e5e5e5]">
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
        className="flex-1 px-3 py-2 rounded-lg border border-[#ddd] resize-none text-sm leading-normal"
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        className="px-5 rounded-lg border-none bg-[#534AB7] text-white font-medium cursor-pointer text-sm"
      >
        Send
      </button>
    </div>
  );
}
