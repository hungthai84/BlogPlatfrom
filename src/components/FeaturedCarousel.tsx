import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";

interface FeaturedCarouselProps {
  articles: any[];
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [articles.length]);

  const featuredArticle = articles[currentIndex];

  return (
    <section className="relative overflow-hidden rounded-md bg-slate-900 text-white h-full min-h-[175px] sm:min-h-[210px] lg:min-h-[240px] flex items-end shadow-md group">
      <AnimatePresence mode="wait">
        <motion.div
          key={featuredArticle.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img 
            src={featuredArticle.coverImage} 
            alt={featuredArticle.title}
            className="w-full h-full object-cover opacity-60 select-none pointer-events-none transform scale-100 group-hover:scale-103 transition-transform duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-900/10" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-6 left-6 z-10 flex gap-2">
        <span className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-[#0078d4] text-white rounded-full backdrop-blur-md shadow-lg">
          <Flame className="h-3 w-3 fill-current animate-bounce" />
          <span>Nổi bật</span>
        </span>
        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-white/20 text-white rounded-full backdrop-blur-md">
          {featuredArticle.tags[0]}
        </span>
      </div>

      <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-3xl text-left bg-black/40 backdrop-blur-md rounded-lg border border-white/10 m-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#2899f5] mb-2 block">
          {featuredArticle.date} • {featuredArticle.readTime} đọc
        </span>
        <Link to={`/post/${featuredArticle.slug}`}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight hover:text-blue-300 transition-colors font-sans">
            {featuredArticle.title}
          </h1>
        </Link>
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-200 line-clamp-2 leading-relaxed font-medium">
          {featuredArticle.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link 
            to={`/post/${featuredArticle.slug}`}
            className="px-6 py-2.5 rounded-md bg-[#0078d4] hover:bg-[#005a9e] text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Đọc bài viết</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <div className="flex items-center gap-3">
            <img 
              src={featuredArticle.author.avatar} 
              alt={featuredArticle.author.name}
              className="h-8 w-8 rounded-full border border-white/20 object-cover"
            />
            <span className="text-xs font-bold text-slate-200">{featuredArticle.author.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
