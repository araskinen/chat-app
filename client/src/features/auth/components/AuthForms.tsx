import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { AuthHeader } from "./AuthHeader";
import { FormField } from "./FormField";
import { AuthModeToggle } from "./AuthModeToggle";

export const AuthForms = () => {
  const {
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
  } = useAuthForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-[360px] bg-white rounded-2xl p-8 shadow-card">
        <AuthHeader mode={mode} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "register" && (
            <FormField
              label="Username"
              value={username}
              onChange={setUsername}
            />
          )}
          <FormField
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
          />
          <FormField
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
          />

          {error && (
            <div className="px-3 py-2 bg-error-surface text-error rounded-lg text-2xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="py-3 rounded-lg border-none bg-brand text-white font-medium text-[15px] cursor-pointer mt-1"
          >
            {submitLabel}
          </button>
        </form>

        <AuthModeToggle mode={mode} onToggle={handleToggleMode} />
      </div>
    </div>
  );
};
