import { motion } from "motion/react";
import { useBookmarks } from "../hooks/useBookmarks";
import { articles } from "../data/articles";
import { ArticleCard } from "../components/ArticleCard";
import { Bookmark, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Bookmarks() {
  const { bookmarks } = useBookmarks();
  
  // Filter articles that are saved
  const savedArticles = articles.filter(article => bookmarks.includes(article.id));

  return (
    <div className="mx-auto max-w-7xl">
      {/* Intro Header */}
      <div className="mb-10 text-left">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#0078d4]/5 dark:bg-[#2899f5]/10 text-[#0078d4] dark:text-[#2899f5] rounded-full w-fit mb-4 border border-[#0078d4]/10">
          <Bookmark className="h-3.5 w-3.5 fill-current" />
          <span className="text-[10px] font-black uppercase tracking-wider">Danh sách yêu thích</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#323130] dark:text-[#ffffff] tracking-tight flex items-center gap-3 font-sans">
          Bài viết đã lưu <span className="text-[#0078d4] dark:text-[#2899f5]">({savedArticles.length})</span>
        </h1>
        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
          Lưu trữ các bài viết hay để đọc lại bất cứ lúc nào. Các bài viết được lưu trữ an toàn ngay trên trình duyệt của bạn.
        </p>
      </div>

      {savedArticles.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-dashed border-[#edebe9] dark:border-[#484644] rounded-md p-16 text-center max-w-xl mx-auto my-12 bg-white dark:bg-[#292827] shadow-sm"
        >
          <div className="h-16 w-16 bg-[#0078d4]/5 dark:bg-[#2899f5]/10 text-[#0078d4] dark:text-[#2899f5] rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 font-sans">Chưa có bài viết nào được lưu</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-6 font-medium">
            Khám phá các câu chuyện, bài viết về du lịch, nhiếp ảnh và phong cách sống để thêm vào đây.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#0078d4] dark:bg-[#2899f5] hover:bg-[#005a9e] dark:hover:bg-[#106ebe] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Khám phá bài viết ngay</span>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
          {savedArticles.map((article, idx) => (
            <div key={article.id} className="relative group">
              <ArticleCard article={article} index={idx} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
