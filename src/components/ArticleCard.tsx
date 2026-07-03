import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { Article } from "../data/articles";
import { cn } from "../lib/utils";
import { FadeImage } from "./FadeImage";
import { useBookmarks } from "../hooks/useBookmarks";
import { Bookmark, Clock, ArrowRight } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  index: number;
}

export function ArticleCard({ article, featured = false, index }: ArticleCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(article.id);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-white/30 dark:border-white/20 bg-white/[var(--card-opacity)] dark:bg-white/[var(--card-opacity)] backdrop-blur-lg shadow-md hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-300",
        featured ? "lg:flex-row lg:items-center" : ""
      )}
    >
      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-lg pointer-events-none border-2 border-transparent group-hover:border-[#0078d4] dark:group-hover:border-[#2899f5] transition-all duration-300 opacity-0 group-hover:opacity-100" />
      <div className="absolute inset-0 rounded-lg pointer-events-none border-2 border-[#0078d4] dark:border-[#2899f5] [clip-path:inset(0_100%_100%_0)] group-hover:[clip-path:inset(0_0_0_0)] transition-[clip-path] duration-700 ease-linear" />
      {/* 1. COVER IMAGE */}
      <div 
        className={cn(
          "relative overflow-hidden bg-slate-100 dark:bg-slate-900",
          featured ? "aspect-[16/10] lg:aspect-[4/3] lg:w-3/5" : "aspect-[16/10] w-full"
        )}
      >
        <Link to={`/post/${article.slug}`} className="block h-full w-full">
          <FadeImage 
            src={article.coverImage} 
            alt={article.title} 
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
            loading="lazy"
          />
        </Link>
        
        {/* Bookmark Overlay Button (Premium Style) */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleBookmark(article.id);
          }}
          className={cn(
            "absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all z-10 shadow-md cursor-pointer",
            bookmarked 
              ? "bg-[#0078d4] text-white dark:bg-[#2899f5]" 
              : "bg-white/95 dark:bg-[#201f1e]/95 text-slate-500 dark:text-slate-400 hover:text-[#0078d4] dark:hover:text-[#2899f5] hover:scale-110"
          )}
          title={bookmarked ? "Bỏ lưu bài viết" : "Lưu bài viết"}
        >
          <Bookmark className={cn("h-4 w-4 transition-all", bookmarked ? "fill-current scale-110" : "")} />
        </button>

        {/* Tag Overlay Badge */}
        <div className="absolute bottom-4 left-4 flex gap-1.5 flex-wrap z-10">
          {article.tags.slice(0, 2).map((tag) => (
            <span 
              key={tag}
              className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-white/95 dark:bg-[#201f1e]/95 text-[#0078d4] dark:text-[#2899f5] rounded-lg shadow-sm border border-[#edebe9]/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* 2. CARD CONTENT */}
      <div 
        className={cn(
          "flex flex-col p-6 sm:p-7 flex-1 text-left",
          featured ? "lg:w-2/5 lg:h-full lg:justify-between" : ""
        )}
      >
        {/* Date and Read Time */}
        <div className="mb-3 flex items-center gap-2.5 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
          <span>{article.date}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#0078d4] dark:bg-[#2899f5]"></span>
          <div className="flex items-center gap-1 font-mono">
            <Clock className="h-3 w-3" />
            <span>{article.readTime} đọc</span>
          </div>
        </div>
        
        {/* Post Title */}
        <Link to={`/post/${article.slug}`} className="group/title block">
          <h2 
            className={cn(
              "font-black leading-snug text-[#323130] dark:text-[#ffffff] group-hover/title:text-[#0078d4] dark:group-hover/title:text-[#2899f5] transition-colors font-sans",
              featured ? "text-2xl sm:text-3xl lg:text-4xl mb-4" : "text-xl mb-3 line-clamp-2"
            )}
          >
            {article.title}
          </h2>
        </Link>
        
        {/* Post Excerpt */}
        <p 
          className={cn(
            "text-slate-500 dark:text-slate-400 leading-relaxed mb-5 font-medium",
            featured ? "text-base sm:text-lg" : "text-sm line-clamp-2"
          )}
        >
          {article.excerpt}
        </p>
        
        {/* Author Footer */}
        <div className="mt-auto pt-5 border-t border-[#edebe9]/60 dark:border-[#484644]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FadeImage 
              src={article.author.avatar} 
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{article.author.name}</span>
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Tác giả</span>
            </div>
          </div>

          <Link 
            to={`/post/${article.slug}`}
            className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[#0078d4] dark:text-[#2899f5] hover:text-[#005a9e] dark:hover:text-[#106ebe] transition-colors group/link"
          >
            <span>Đọc tiếp</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
