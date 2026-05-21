import { useAuthStore } from "@/features/auth/store/authStore";

export const SidebarFooter = () => {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="p-3 border-t border-[#444]">
      <button
        onClick={logout}
        className="w-full p-2 rounded-md border-none bg-[#3d3d3a] text-[#aaa] cursor-pointer text-[13px]"
      >
        Sign out
      </button>
    </div>
  );
};
