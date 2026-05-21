import { useAuthStore } from "@/store/authStore";

export const SidebarHeader = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-4 border-b border-[#444]">
      <div className="font-semibold text-[15px] text-white">💬 ChatApp</div>
      <div className="text-xs text-[#888] mt-0.5">@{user?.username}</div>
    </div>
  );
};
