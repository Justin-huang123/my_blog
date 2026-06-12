"use server";

import { createSession, deleteSession, verifyPassword } from "@/lib/auth";
import { redirect } from "next/navigation";

// ====== 登录处理 ======
// 注意：useActionState 会把 prevState 作为第一个参数，formData 作为第二个
// prevState: 上次返回的 { error: string }
// formData: 表单提交的数据
export async function login(
  prevState: { error: string },
  formData: FormData
) {
  const password = formData.get("password") as string;

  // 验证密码
  if (!password || !(await verifyPassword(password))) {
    return { error: "密码错误，请重试。" };
  }

  // 密码正确 → 创建会话 → 跳转到后台首页
  await createSession();
  redirect("/admin");
}

// ====== 退出登录 ======
export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
