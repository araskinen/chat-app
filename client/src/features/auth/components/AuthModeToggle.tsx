interface Props {
  mode: "login" | "register";
  onToggle: () => void;
}

export const AuthModeToggle = ({ mode, onToggle }: Props) => (
  <p className="text-center mt-5 text-2xs text-muted">
    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
    <button
      onClick={onToggle}
      className="bg-transparent border-none text-brand cursor-pointer font-medium text-2xs"
    >
      {mode === "login" ? "Sign up" : "Sign in"}
    </button>
  </p>
);
