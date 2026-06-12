import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// ====== 1. 找到数据库文件的位置 ======
// process.cwd() = 项目根目录 my-blog/
// data/blog.db = 数据库文件就在 my-blog/data/blog.db
const dbPath = path.join(process.cwd(), "data", "blog.db");

// 确保 data 文件夹存在
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// ====== 2. 连接数据库（单例模式：整个应用共用这一个连接）======
const db = new Database(dbPath);

// WAL 模式：读和写可以同时进行，互不阻塞
db.pragma("journal_mode = WAL");

// ====== 3. 建表（如果表不存在就创建）======
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    slug        TEXT    NOT NULL UNIQUE,
    content     TEXT    NOT NULL DEFAULT '',
    excerpt     TEXT    NOT NULL DEFAULT '',
    published   INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  -- 默认管理员密码 admin123（后面你可以改）
  INSERT OR IGNORE INTO settings (key, value) VALUES ('admin_password', 'admin123');
`);

// ====== 4. 预编译所有 SQL 语句（防止 SQL 注入 + 加速查询）======
// 什么是预编译？先把 SQL 模板发给数据库"编译好"，
// 以后每次查询只传参数，不需要重新解析 SQL。
// 同时参数会被自动转义，黑客无法注入恶意代码。

export const statements = {
  // --- 文章相关 ---

  // 获取所有已发布的文章（首页用）
  getAllPublishedPosts: db.prepare(`
    SELECT id, title, slug, excerpt, created_at, updated_at
    FROM posts WHERE published = 1 ORDER BY created_at DESC
  `),

  // 获取所有文章（管理后台用，包括草稿）
  getAllPosts: db.prepare(`
    SELECT * FROM posts ORDER BY created_at DESC
  `),

  // 根据 URL 标识查找文章
  getPostBySlug: db.prepare(`
    SELECT * FROM posts WHERE slug = ?
  `),

  // 根据 ID 查找文章
  getPostById: db.prepare(`
    SELECT * FROM posts WHERE id = ?
  `),

  // 创建新文章（? 是占位符，后面传值进去）
  createPost: db.prepare(`
    INSERT INTO posts (title, slug, content, excerpt, published)
    VALUES (?, ?, ?, ?, ?)
  `),

  // 更新文章
  updatePost: db.prepare(`
    UPDATE posts
    SET title = ?, slug = ?, content = ?, excerpt = ?,
        published = ?, updated_at = datetime('now', 'localtime')
    WHERE id = ?
  `),

  // 删除文章
  deletePost: db.prepare(`
    DELETE FROM posts WHERE id = ?
  `),

  // --- 设置相关 ---

  // 读取一个设置项的值
  getSetting: db.prepare(`
    SELECT value FROM settings WHERE key = ?
  `),

  // 设置一个配置项的值（如果 key 已存在就更新）
  setSetting: db.prepare(`
    INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)
  `),
};

export { db };
