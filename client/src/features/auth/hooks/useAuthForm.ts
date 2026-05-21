import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";

export const useAuthForm = () => {
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

  const handleToggleMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    clearError();
  };

  const submitLabel = isLoading
    ? "Please wait…"
    : mode === "login"
      ? "Sign in"
      : "Create account";

  return {
    mode,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    submitLabel,
    handleSubmit,
    handleToggleMode,
  };
};
