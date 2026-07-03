import { motion } from "motion/react";
import { articles } from "../data/articles";
import { ArticleCard } from "../components/ArticleCard";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { PopularPosts } from "../components/PopularPosts";
import { 
  TrendingUp, 
  Bookmark, 
  Flame, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useBookmarks } from "../hooks/useBookmarks";
import { Link } from "react-router-dom";

export function Home() {
  const { bookmarks } = useBookmarks();
  const allTags = ["Tất cả", ...Array.from(new Set(articles.flatMap(a => a.tags)))];
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredArticles = selectedCategory === "Tất cả" 
    ? articles 
    : articles.filter(a => a.tags.includes(selectedCategory));

  const featuredArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1);
  const popularArticles = articles.slice(1, 4);

  if (!featuredArticle) {
    return (
      <div className="mx-auto max-w-7xl p-10 text-center">
        <div className="flex gap-2 justify-center mb-4">
          {allTags.map(tag => (
            <button 
              key={tag}
              onClick={() => setSelectedCategory(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === tag 
                  ? "bg-[#0078d4] text-white" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <p className="text-slate-500">Không tìm thấy bài viết nào.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      
      {/* 1. HERO BANNER LAYOUT (Carousel + Popular) */}
      <section className="mb-12 grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-7">
          <FeaturedCarousel articles={articles.slice(0, 5)} />
        </div>
        <div className="lg:col-span-3">
          <PopularPosts articles={articles.slice(1, 4)} />
        </div>
      </section>

      {/* 2. MAIN BLOG AREA (Full width Grid) */}
      <div className="space-y-12">
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4">
          {allTags.map(tag => (
            <button 
              key={tag}
              onClick={() => setSelectedCategory(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === tag 
                  ? "bg-[#0078d4] text-white" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Section title */}
        <div className="flex items-center justify-between border-b border-[#edebe9] dark:border-[#484644] pb-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-[#0078d4] dark:bg-[#2899f5] rounded-full animate-ping" />
            <h2 className="text-sm font-black uppercase tracking-widest text-[#323130] dark:text-[#ffffff] widget-title-dots">
              {selectedCategory}
            </h2>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
            {filteredArticles.length} bài
          </span>
        </div>

        {/* Grid Layout of post cards (Expanded to 3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remainingArticles.map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>
      </div>

    </div>
  );
}
