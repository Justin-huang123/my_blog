import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 把 Markdown 文字渲染成美观的 HTML
// react-markdown: 解析 Markdown 语法
// remark-gfm: 扩展语法支持（表格、删除线、任务列表等）
// prose: Tailwind Typography 提供的魔法 class，自动排版
export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div
      className="prose prose-lg prose-slate max-w-none
      prose-headings:font-bold
      prose-h2:text-2xl prose-h3:text-xl
      prose-a:text-blue-600
      prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
      prose-pre:bg-gray-900 prose-pre:text-gray-100
      prose-img:rounded-lg
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
