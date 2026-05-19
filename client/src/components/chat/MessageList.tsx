import { useEffect, useRef } from "react";
import type { Message } from "@/types";
import { useAuthStore } from "@/store/authStore";

interface Props {
  messages: Message[];
  typingUsers: string[];
}

export function MessageList({ messages, typingUsers }: Props) {
  const currentUser = useAuthStore((s) => s.user);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {messages.map((msg) => {
        const isOwn = msg.sender._id === currentUser?._id;
        return (
          <div
            key={msg._id}
            style={{
              display: "flex",
              justifyContent: isOwn ? "flex-end" : "flex-start",
            }}
          >
            {!isOwn && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#7F77DD",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 500,
                  marginRight: 8,
                  flexShrink: 0,
                }}
              >
                {msg.sender.username[0].toUpperCase()}
              </div>
            )}
            <div style={{ maxWidth: "70%" }}>
              {!isOwn && (
                <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>
                  {msg.sender.username}
                </div>
              )}
              <div
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: isOwn
                    ? "12px 12px 4px 12px"
                    : "12px 12px 12px 4px",
                  background: isOwn ? "#534AB7" : "#f0f0f0",
                  color: isOwn ? "#fff" : "#222",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {msg.content}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#aaa",
                  marginTop: 2,
                  textAlign: isOwn ? "right" : "left",
                }}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        );
      })}

      {typingUsers.length > 0 && (
        <div style={{ fontSize: 12, color: "#888", fontStyle: "italic" }}>
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
          typing…
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
