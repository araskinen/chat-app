import type { Message } from "@/shared/types";
import { useAuthStore } from "@/features/auth/store/authStore";

interface Props {
  message: Message;
}

export const MessageItem = ({ message: msg }: Props) => {
  const currentUser = useAuthStore((s) => s.user);
  const isOwn = msg.sender._id === currentUser?._id;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-brand-light text-white flex items-center justify-center text-2xs font-medium mr-2 shrink-0">
          {msg.sender.username[0].toUpperCase()}
        </div>
      )}
      <div className="max-w-[70%]">
        {!isOwn && (
          <div className="text-xs text-muted mb-0.5">
            {msg.sender.username}
          </div>
        )}
        <div
          className={`px-3 py-2 text-sm leading-normal ${
            isOwn
              ? "bg-brand text-white rounded-[12px_12px_4px_12px]"
              : "bg-message-bg text-ink rounded-[12px_12px_12px_4px]"
          }`}
        >
          {msg.content}
        </div>
        <div
          className={`text-3xs text-faint mt-0.5 ${isOwn ? "text-right" : "text-left"}`}
        >
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
