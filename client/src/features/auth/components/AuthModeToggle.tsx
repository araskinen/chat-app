interface Props {
  mode: "login" | "register";
  onToggle: () => void;
}

export const AuthModeToggle = ({ mode, onToggle }: Props) => (
  <p className="text-center mt-5 text-[13px] text-[#888]">
    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
    <button
      onClick={onToggle}
      className="bg-transparent border-none text-[#534AB7] cursor-pointer font-medium text-[13px]"
    >
      {mode === "login" ? "Sign up" : "Sign in"}
    </button>
  </p>
);
