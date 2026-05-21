import { useAuthStore } from "@/features/auth/store/authStore";

export const SidebarFooter = () => {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="p-3 border-t border-sidebar-border">
      <button
        onClick={logout}
        className="w-full p-2 rounded-md border-none bg-sidebar-input text-faint cursor-pointer text-2xs"
      >
        Sign out
      </button>
    </div>
  );
};
