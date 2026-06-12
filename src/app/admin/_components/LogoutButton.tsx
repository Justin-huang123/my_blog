"use client";

import { logout } from "@/actions/auth";

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="text-sm text-red-500 hover:text-red-700 transition-colors"
    >
      退出登录
    </button>
  );
}
