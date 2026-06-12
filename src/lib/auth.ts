import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 把 SESSION_SECRET 从文本转成二进制密钥（jose 库要求的格式）
const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

// ====== 创建会话（登录成功后调用）======
// 生成一个 JWT，里面写 { admin: true }，有效期 24 小时
export async function createSession() {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })   // 用什么算法签名
    .setIssuedAt()                           // 签发时间
    .setExpirationTime("24h")                // 24 小时后过期
    .sign(secret);                           // 用密钥签名

  // 把 token 写入 Cookie
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,   // JS 读不到，防 XSS 攻击
    secure: process.env.NODE_ENV === "production", // 生产环境只走 HTTPS
    sameSite: "lax",  // 防止跨站请求伪造
    maxAge: 60 * 60 * 24, // Cookie 有效期：24 小时（单位：秒）
    path: "/",        // 整个网站都带这个 Cookie
  });
}

// ====== 获取当前会话（每个请求都会调用）======
// 返回 { admin: true } 或 null
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload; // { admin: true }
  } catch {
    // token 过期或被人篡改 → 返回 null
    return null;
  }
}

// ====== 删除会话（退出登录）======
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// ====== 鉴权守卫：没登录就跳到登录页 ======
// 在所有需要保护的页面最开头调用
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
}

// ====== 验证管理员密码 ======
// 密码存在环境变量 ADMIN_PASSWORD 中，不依赖数据库
export async function verifyPassword(password: string): Promise<boolean> {
  const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
  return password === correctPassword;
}
