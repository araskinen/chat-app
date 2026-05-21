interface Props {
  disabled?: boolean;
  onClick: () => void;
}

export const SendButton = ({ disabled, onClick }: Props) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-5 rounded-lg border-none bg-[#534AB7] text-white font-medium cursor-pointer text-sm disabled:opacity-50"
  >
    Send
  </button>
);
