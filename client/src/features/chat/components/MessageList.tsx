import { useEffect, useRef } from "react";
import type { Message } from "@/shared/types";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";

interface Props {
  messages: Message[];
  typingUsers: string[];
}

export const MessageList = ({ messages, typingUsers }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
      {messages.map((msg) => (
        <MessageItem key={msg._id} message={msg} />
      ))}
      <TypingIndicator typingUsers={typingUsers} />
      <div ref={bottomRef} />
    </div>
  );
};
