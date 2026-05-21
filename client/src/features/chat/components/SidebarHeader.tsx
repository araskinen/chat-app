import { useAuthStore } from "@/features/auth/store/authStore";

export const SidebarHeader = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-4 border-b border-sidebar-border">
      <div className="font-semibold text-[15px] text-white">💬 ChatApp</div>
      <div className="text-xs text-muted mt-0.5">@{user?.username}</div>
    </div>
  );
};
