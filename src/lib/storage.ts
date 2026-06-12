import fs from "fs";
import path from "path";

// 文章数据文件路径
const DATA_FILE = path.join(process.cwd(), "data", "posts.json");

// ====== 文章数据结构 ======
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: number; // 0 = 草稿, 1 = 已发布
  created_at: string;
  updated_at: string;
}

// ====== 读取所有文章 ======
function readPosts(): Post[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Post[];
  } catch {
    return [];
  }
}

// ====== 写入所有文章 ======
function writePosts(posts: Post[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

// ====== 获取下一个 ID ======
function nextId(posts: Post[]): number {
  if (posts.length === 0) return 1;
  return Math.max(...posts.map((p) => p.id)) + 1;
}

// ====== 格式化日期 ======
function now(): string {
  const d = new Date();
  // 格式：2026-06-12 16:30:00
  return d
    .toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/\//g, "-");
}

// ====== 对外暴露的 API（替换原来的 SQL 预编译语句）======

export const storage = {
  // 获取所有已发布的文章（首页用，按时间倒序）
  getAllPublished(): Post[] {
    return readPosts()
      .filter((p) => p.published === 1)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  },

  // 获取所有文章（管理后台用，包括草稿）
  getAll(): Post[] {
    return readPosts().sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  // 根据 slug 查找文章
  getBySlug(slug: string): Post | undefined {
    return readPosts().find((p) => p.slug === slug);
  },

  // 根据 ID 查找文章
  getById(id: number): Post | undefined {
    return readPosts().find((p) => p.id === id);
  },

  // 创建文章
  create(post: Omit<Post, "id" | "created_at" | "updated_at">): Post {
    const posts = readPosts();
    const newPost: Post = {
      ...post,
      id: nextId(posts),
      created_at: now(),
      updated_at: now(),
    };
    posts.push(newPost);
    writePosts(posts);
    return newPost;
  },

  // 更新文章
  update(
    id: number,
    data: Omit<Post, "id" | "created_at" | "updated_at">
  ): Post | null {
    const posts = readPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    posts[index] = {
      ...posts[index],
      ...data,
      id, // 保持原 ID
      updated_at: now(),
    };
    writePosts(posts);
    return posts[index];
  },

  // 删除文章
  delete(id: number): boolean {
    const posts = readPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return false;

    posts.splice(index, 1);
    writePosts(posts);
    return true;
  },
};
