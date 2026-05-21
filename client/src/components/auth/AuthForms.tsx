import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export function AuthForms() {
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
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#555" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        style={{
          padding: "0.6rem 0.75rem",
          borderRadius: 8,
          border: "1px solid #ddd",
          fontSize: 14,
        }}
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f3",
      }}
    >
      <div
        style={{
          width: 360,
          background: "#fff",
          borderRadius: 16,
          padding: "2rem",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ margin: "0 0 0.25rem", fontSize: 22, fontWeight: 500 }}>
          💬 ChatApp
        </h1>
        <p style={{ margin: "0 0 1.5rem", color: "#888", fontSize: 14 }}>
          {mode === "login" ? "Sign in to continue" : "Create your account"}
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {mode === "register" && field("Username", username, setUsername)}
          {field("Email", email, setEmail, "email")}
          {field("Password", password, setPassword, "password")}

          {error && (
            <div
              style={{
                padding: "0.5rem 0.75rem",
                background: "#FCEBEB",
                color: "#A32D2D",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "0.7rem",
              borderRadius: 8,
              border: "none",
              background: "#534AB7",
              color: "#fff",
              fontWeight: 500,
              fontSize: 15,
              cursor: "pointer",
              marginTop: 4,
            }}
          >
            {submitButtonLabel}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: 13,
            color: "#888",
          }}
        >
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              clearError();
            }}
            style={{
              background: "none",
              border: "none",
              color: "#534AB7",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
