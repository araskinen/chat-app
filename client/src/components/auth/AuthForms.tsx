import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export const AuthForms = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (mode === "login") {
      await login({ email, password });
    } else {
      await register({ username, email, password });
    }
  };

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    type = "text",
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-[13px] font-medium text-[#555]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="px-3 py-[0.6rem] rounded-lg border border-[#ddd] text-sm"
      />
    </div>
  );

  let submitButtonLabel = "Create account";
  if (isLoading) {
    submitButtonLabel = "Please wait…";
  } else if (mode === "login") {
    submitButtonLabel = "Sign in";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f3]">
      <div className="w-[360px] bg-white rounded-2xl p-8 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        <h1 className="m-0 mb-1 text-[22px] font-medium">💬 ChatApp</h1>
        <p className="m-0 mb-6 text-[#888] text-sm">
          {mode === "login" ? "Sign in to continue" : "Create your account"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "register" && field("Username", username, setUsername)}
          {field("Email", email, setEmail, "email")}
          {field("Password", password, setPassword, "password")}

          {error && (
            <div className="px-3 py-2 bg-[#FCEBEB] text-[#A32D2D] rounded-lg text-[13px]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="py-[0.7rem] rounded-lg border-none bg-[#534AB7] text-white font-medium text-[15px] cursor-pointer mt-1"
          >
            {submitButtonLabel}
          </button>
        </form>

        <p className="text-center mt-5 text-[13px] text-[#888]">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              clearError();
            }}
            className="bg-transparent border-none text-[#534AB7] cursor-pointer font-medium text-[13px]"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
