interface Props {
  mode: "login" | "register";
}

export const AuthHeader = ({ mode }: Props) => (
  <>
    <h1 className="m-0 mb-1 text-title font-medium">💬 ChatApp</h1>
    <p className="m-0 mb-6 text-muted text-sm">
      {mode === "login" ? "Sign in to continue" : "Create your account"}
    </p>
  </>
);
