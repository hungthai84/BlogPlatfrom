import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

interface PopularPostsProps {
  articles: any[];
}

export function PopularPosts({ articles }: PopularPostsProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 rounded-lg bg-white/[var(--card-opacity)] dark:bg-white/[var(--card-opacity)] backdrop-blur-lg border border-white/30 dark:border-white/20 shadow-md hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 h-full text-left"
    >
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b border-[#edebe9]/60 dark:border-[#484644]/60 pb-3 mb-5 flex items-center gap-2 widget-title-dots">
        <TrendingUp className="h-4 w-4 text-[#0078d4] dark:text-[#2899f5]" />
        <span>Xem nhiều nhất</span>
      </h3>

      <div className="space-y-5">
        {articles.map((article, idx) => (
          <div key={article.id} className="flex gap-4 group/popular items-start text-left">
            <span className="text-2xl font-black text-slate-300 group-hover/popular:text-[#0078d4] dark:group-hover/popular:text-[#2899f5] transition-colors select-none font-mono">
              0{idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <Link 
                to={`/post/${article.slug}`}
                className="text-sm font-bold text-slate-800 hover:text-[#0078d4] dark:hover:text-[#2899f5] transition-colors line-clamp-2 leading-snug"
              >
                {article.title}
              </Link>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mt-1.5 font-mono">
                {article.date} • {article.readTime} đọc
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
