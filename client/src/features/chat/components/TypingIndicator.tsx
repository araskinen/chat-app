interface Props {
  typingUsers: string[];
}

export const TypingIndicator = ({ typingUsers }: Props) => {
  if (typingUsers.length === 0) return null;

  return (
    <div className="text-xs text-[#888] italic">
      {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing…
    </div>
  );
};
