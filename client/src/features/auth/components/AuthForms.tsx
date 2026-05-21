import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { AuthHeader } from "./AuthHeader";
import { FormField } from "./FormField";
import { AuthModeToggle } from "./AuthModeToggle";

export const AuthForms = () => {
  const {
    mode,
    username, setUsername,
    email, setEmail,
    password, setPassword,
    isLoading,
    error,
    submitLabel,
    handleSubmit,
    handleToggleMode,
  } = useAuthForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f3]">
      <div className="w-[360px] bg-white rounded-2xl p-8 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        <AuthHeader mode={mode} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "register" && (
            <FormField label="Username" value={username} onChange={setUsername} />
          )}
          <FormField label="Email" value={email} onChange={setEmail} type="email" />
          <FormField label="Password" value={password} onChange={setPassword} type="password" />

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
            {submitLabel}
          </button>
        </form>

        <AuthModeToggle mode={mode} onToggle={handleToggleMode} />
      </div>
    </div>
  );
};
