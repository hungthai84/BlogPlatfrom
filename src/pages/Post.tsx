import { useParams, Navigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import MDEditor from '@uiw/react-md-editor';
import { articles } from "../data/articles";
import { AuthorInfo } from "../components/AuthorInfo";
import { FadeImage } from "../components/FadeImage";
import { Comments } from "../components/Comments";
import { useBookmarks } from "../hooks/useBookmarks";
import { useState, useEffect, useRef } from "react";
import { 
  Bookmark, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  ThumbsUp, 
  Heart, 
  Smile, 
  Award, 
  Sparkles,
  List,
  Copy,
  Check,
  Send,
  Share2,
  Play,
  Pause,
  Square,
  Volume2,
  SkipForward,
  SkipBack,
  Volume,
  X,
  FileText
} from "lucide-react";
import { calculateReadingTime, generateToc } from "../lib/utils";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
}

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);
  const articleIndex = articles.findIndex((a) => a.slug === slug);

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  
  const readingTime = calculateReadingTime(article?.content);
  const toc = generateToc(article?.content);

  // Floating TOC and Web Speech API States
  const [activeId, setActiveId] = useState<string>("");
  const [isFloatingTocOpen, setIsFloatingTocOpen] = useState<boolean>(false);
  const [showFloatingTocButton, setShowFloatingTocButton] = useState<boolean>(false);

  // Web Speech API / TTS controls
  const [chunks, setChunks] = useState<string[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const speedOptions = [0.75, 1.0, 1.25, 1.5, 2.0];

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (totalScroll / windowHeight) * 100;
      setReadingProgress(progress);

      // Show/hide floating TOC toggle button
      if (window.scrollY > 400) {
        setShowFloatingTocButton(true);
      } else {
        setShowFloatingTocButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set up headings observer for Table of Contents
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, curr) => 
            curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
          );
          setActiveId(topEntry.target.id);
        }
      },
      { rootMargin: "-100px 0px -40% 0px", threshold: 0.1 }
    );

    const articleElement = document.querySelector(".prose");
    if (articleElement) {
      const headings = articleElement.querySelectorAll("h2, h3");
      headings.forEach((heading) => {
        const text = heading.textContent || "";
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        heading.id = id;
        observer.observe(heading);
      });
    }

    return () => observer.disconnect();
  }, [article]);

  // TTS chunks initialization
  useEffect(() => {
    if (!article?.content) return;
    
    // Split content into clean paragraphs
    const rawLines = article.content.split(/\n+/);
    const cleanedChunks = rawLines
      .map(line => {
        let text = line.trim();
        if (!text) return "";
        text = text.replace(/^#+\s+/, "");
        text = text.replace(/^[-*+]\s+/, "");
        text = text.replace(/^\d+\.\s+/, "");
        text = text.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1");
        text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
        return text;
      })
      .filter(line => line.length > 5);
      
    const allChunks = [article.title, article.excerpt, ...cleanedChunks];
    setChunks(allChunks);
    
    // Stop speaking if article changes
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIndex(-1);
  }, [article]);

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    const handleVoicesChanged = () => {
      window.speechSynthesis.getVoices();
    };
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakChunk = (index: number, rate: number = speed) => {
    if (index < 0 || index >= chunks.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentChunkIndex(-1);
      return;
    }

    window.speechSynthesis.cancel();
    
    const textToSpeak = chunks[index];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;
    
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.toLowerCase().includes("vi") || v.lang.toLowerCase().includes("vn"));
    if (viVoice) {
      utterance.voice = viVoice;
    }
    
    utterance.onend = () => {
      setCurrentChunkIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex < chunks.length) {
          speakChunk(nextIndex, rate);
          return nextIndex;
        } else {
          setIsPlaying(false);
          setIsPaused(false);
          return -1;
        }
      });
    };
    
    utterance.onerror = (e) => {
      console.error("SpeechSynthesisUtterance error:", e);
      if (e.error !== 'interrupted') {
        setIsPlaying(false);
        setIsPaused(false);
      }
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      const startIndex = currentChunkIndex >= 0 ? currentChunkIndex : 0;
      setCurrentChunkIndex(startIndex);
      setIsPlaying(true);
      setIsPaused(false);
      speakChunk(startIndex);
    }
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIndex(-1);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying && !isPaused && currentChunkIndex >= 0) {
      speakChunk(currentChunkIndex, newSpeed);
    }
  };

  const handleNext = () => {
    if (currentChunkIndex < chunks.length - 1) {
      const nextIndex = currentChunkIndex + 1;
      setCurrentChunkIndex(nextIndex);
      speakChunk(nextIndex);
    }
  };

  const handlePrev = () => {
    if (currentChunkIndex > 0) {
      const prevIndex = currentChunkIndex - 1;
      setCurrentChunkIndex(prevIndex);
      speakChunk(prevIndex);
    }
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setIsFloatingTocOpen(false);
  };

  // States for interactive emoji reactions (Plus UI reaction system)
  const [reactions, setReactions] = useState<{ [key: string]: number }>(() => {
    try {
      const saved = localStorage.getItem(`plus_ui_reactions_${slug}`);
      return saved ? JSON.parse(saved) : { heart: 28, clap: 19, love: 15, idea: 9 };
    } catch {
      return { heart: 28, clap: 19, love: 15, idea: 9 };
    }
  });

  const [hasReacted, setHasReacted] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem(`plus_ui_reacted_state_${slug}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save reactions to localStorage
  useEffect(() => {
    localStorage.setItem(`plus_ui_reactions_${slug}`, JSON.stringify(reactions));
  }, [reactions, slug]);

  useEffect(() => {
    localStorage.setItem(`plus_ui_reacted_state_${slug}`, JSON.stringify(hasReacted));
  }, [hasReacted, slug]);

  const handleReact = (type: string) => {
    const isAlreadyReacted = hasReacted[type];
    setReactions((prev) => ({
      ...prev,
      [type]: isAlreadyReacted ? prev[type] - 1 : prev[type] + 1
    }));
    setHasReacted((prev) => ({
      ...prev,
      [type]: !isAlreadyReacted
    }));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Setup reading progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (!article) {
    return <Navigate to="/" replace />;
  }

  const bookmarked = isBookmarked(article.id);

  // Get next and previous articles for navigation
  const prevArticle = articleIndex > 0 ? articles[articleIndex - 1] : null;
  const nextArticle = articleIndex < articles.length - 1 ? articles[articleIndex + 1] : null;

  return (
    <div className="relative">
      
      {/* 1. STICKY READING PROGRESS BAR (rtB Spec) */}
      <motion.div 
        style={{ scaleX }}
        className="fixed top-16 left-0 right-0 h-1 bg-[#0078d4] dark:bg-[#2899f5] origin-left z-40"
      />

      <div className="mx-auto max-w-7xl">
        
        {/* 2. BREADCRUMBS & ACTIONS HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-semibold">
            <Link to="/" className="hover:text-[#0078d4] dark:hover:text-[#2899f5] transition-colors">Trang chủ</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-400">Bài viết</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[200px]">{article.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => toggleBookmark(article.id)}
              className={`p-2 px-3.5 rounded-md border border-[#edebe9] dark:border-[#484644] flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                bookmarked 
                  ? "bg-[#0078d4] border-[#0078d4] text-white dark:bg-[#2899f5] dark:border-[#2899f5]" 
                  : "bg-white dark:bg-[#292827] text-slate-600 dark:text-slate-400 hover:text-[#0078d4] dark:hover:text-[#2899f5] hover:scale-102"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
              <span>{bookmarked ? "Đã lưu" : "Lưu bài viết"}</span>
            </button>

            <button 
              onClick={handleShare}
              className="p-2 px-3.5 rounded-md border border-[#edebe9] dark:border-[#484644] bg-white dark:bg-[#292827] text-slate-600 dark:text-slate-400 hover:text-[#0078d4] dark:hover:text-[#2899f5] hover:scale-102 flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>

        {/* 3. POST HERO COVER IMAGE */}
        <div className="relative rounded-md overflow-hidden h-[45vh] min-h-[320px] max-h-[480px] mb-12 bg-slate-900 border border-[#edebe9]/60 dark:border-[#484644]/60 shadow-md">
          <FadeImage 
            src={article.coverImage} 
            alt={article.title} 
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover opacity-60 pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 lg:p-14 text-left">
            <div className="flex gap-2 mb-3 z-10">
              {article.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-[#0078d4] text-white dark:bg-[#2899f5] rounded-lg shadow-md border border-[#edebe9]/10">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight font-sans">
              {article.title}
            </h1>

            <div className="mt-4 flex items-center gap-3.5 text-xs text-slate-300 font-bold uppercase tracking-wider">
              <span>{article.date}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#0078d4]" />
              <span className="font-mono">{article.readTime} đọc</span>
            </div>
          </div>
        </div>

        {/* 4. MAIN ARTICLE CONTENTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 text-left">
          
          {/* Main article body (Left 3 columns) */}
          <div className="lg:col-span-3">
            
            {/* AUDIO TTS DECK (Listen to article) */}
            <div className="mb-8 p-4 rounded-xl bg-white/60 dark:bg-[#292827]/60 backdrop-blur-md border border-[#edebe9] dark:border-[#484644] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <style>{`
                @keyframes bounce-equalizer {
                  0%, 100% { transform: scaleY(0.3); }
                  50% { transform: scaleY(1); }
                }
                .equalizer-bar {
                  animation: bounce-equalizer 0.8s ease-in-out infinite;
                  transform-origin: bottom;
                }
              `}</style>
              
              {/* Left Info: Status / Title */}
              <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
                <div className={`p-3 rounded-full flex items-center justify-center transition-all ${
                  isPlaying && !isPaused 
                    ? "bg-[#0078d4]/10 text-[#0078d4] dark:bg-[#2899f5]/10 dark:text-[#2899f5] animate-pulse" 
                    : "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400"
                }`}>
                  <Volume2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span>Nghe đọc bài viết</span>
                    {isPlaying && !isPaused && (
                      <span className="flex items-end gap-0.5 h-3.5 w-5">
                        <span className="equalizer-bar w-0.5 h-full bg-[#0078d4] dark:bg-[#2899f5] rounded-full" style={{ animationDelay: '0.1s' }} />
                        <span className="equalizer-bar w-0.5 h-full bg-[#0078d4] dark:bg-[#2899f5] rounded-full" style={{ animationDelay: '0.3s' }} />
                        <span className="equalizer-bar w-0.5 h-full bg-[#0078d4] dark:bg-[#2899f5] rounded-full" style={{ animationDelay: '0s' }} />
                        <span className="equalizer-bar w-0.5 h-full bg-[#0078d4] dark:bg-[#2899f5] rounded-full" style={{ animationDelay: '0.4s' }} />
                      </span>
                    )}
                  </h4>
                  <p className="text-xxs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                    {isPlaying 
                      ? `Đang phát đoạn ${currentChunkIndex + 1} / ${chunks.length}` 
                      : "Trình đọc giọng nói Tiếng Việt"}
                  </p>
                </div>
              </div>

              {/* Middle: Audio Player Controls */}
              <div className="flex items-center gap-3 justify-center">
                <button 
                  onClick={handlePrev}
                  disabled={!isPlaying || currentChunkIndex <= 0}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                  title="Đoạn trước"
                >
                  <SkipBack className="h-4 w-4" />
                </button>

                {isPlaying && !isPaused ? (
                  <button 
                    onClick={handlePause}
                    className="p-3.5 rounded-full bg-[#0078d4] dark:bg-[#2899f5] hover:bg-[#005a9e] dark:hover:bg-[#106ebe] text-white shadow-md hover:scale-105 transition-all cursor-pointer"
                    title="Tạm dừng"
                  >
                    <Pause className="h-5 w-5 fill-current" />
                  </button>
                ) : (
                  <button 
                    onClick={handlePlay}
                    className="p-3.5 rounded-full bg-[#0078d4] dark:bg-[#2899f5] hover:bg-[#005a9e] dark:hover:bg-[#106ebe] text-white shadow-md hover:scale-105 transition-all cursor-pointer"
                    title="Phát"
                  >
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </button>
                )}

                <button 
                  onClick={handleNext}
                  disabled={!isPlaying || currentChunkIndex >= chunks.length - 1}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                  title="Đoạn kế tiếp"
                >
                  <SkipForward className="h-4 w-4" />
                </button>

                {isPlaying && (
                  <button 
                    onClick={handleStop}
                    className="p-2 rounded-full hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 text-slate-600 dark:text-slate-400 cursor-pointer transition-colors"
                    title="Dừng phát"
                  >
                    <Square className="h-4 w-4 fill-current" />
                  </button>
                )}
              </div>

              {/* Right: Playback Speed Control */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <span className="text-xxs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">Tốc độ:</span>
                <div className="flex gap-1">
                  {speedOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSpeedChange(opt)}
                      className={`px-2 py-1 text-[10px] font-black rounded font-mono transition-all cursor-pointer ${
                        speed === opt
                          ? "bg-[#0078d4] text-white dark:bg-[#2899f5]"
                          : "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {opt}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <article className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#0078d4] dark:prose-a:text-[#2899f5] prose-blockquote:border-l-4 prose-blockquote:border-[#0078d4] dark:prose-blockquote:border-[#2899f5] prose-blockquote:bg-blue-50/40 dark:prose-blockquote:bg-sky-950/20 prose-blockquote:p-5 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:font-medium">
              {/* Introduction/Excerpt */}
              <p className="lead text-xl sm:text-2xl font-serif italic text-[#0078d4] dark:text-[#2899f5] mb-10 leading-relaxed border-l-4 border-[#0078d4] dark:border-[#2899f5] pl-4">
                {article.excerpt}
              </p>

              <div data-color-mode="light" className="dark:!hidden">
                <MDEditor.Markdown source={article.content} style={{ backgroundColor: 'transparent' }} />
              </div>
              <div data-color-mode="dark" className="hidden dark:!block">
                <MDEditor.Markdown source={article.content} style={{ backgroundColor: 'transparent' }} />
              </div>           <p className="font-medium text-slate-700 dark:text-slate-300">
                Hãy bắt đầu từ những việc nhỏ. Tắt điện thoại trong vòng một giờ. Ngồi bên cửa sổ và ngắm nhìn những đám mây trôi qua. Đi dạo mà không đeo tai nghe nghe nhạc. Hãy chú ý đến những âm thanh xuất hiện khi tiếng ồn nhân tạo mờ dần—tiếng rì rầm của tủ lạnh, tiếng chim hót xa xăm, nhịp điệu hơi thở của chính bạn.
              </p>

              <p className="font-medium text-slate-700 dark:text-slate-300">
                Khi thực hành sự tĩnh lặng có ý thức này, bạn sẽ nhận ra nó trở nên ít đáng sợ hơn và chào đón hơn nhiều. Nó dần trở thành một nơi trú ẩn an lành, một chốn bình yên nơi bạn có thể quay về với chính mình, hết lần này đến lần khác.
              </p>
            </article>

            {/* 5. INTERACTIVE EMOJI REACTIONS (rctW Spec) */}
            <div className="mt-12 p-6 rounded-lg bg-white dark:bg-[#292827] border border-[#edebe9] dark:border-[#484644] shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2 widget-title-dots">
                <Sparkles className="h-4 w-4 text-[#0078d4] dark:text-[#2899f5]" />
                <span>Cảm nhận của bạn về bài viết?</span>
              </h3>

              <div className="flex flex-wrap gap-4 justify-around sm:justify-center sm:gap-6">
                <button 
                  onClick={() => handleReact("heart")}
                  className={`flex flex-col items-center gap-2 p-3 px-5 rounded-md transition-all border cursor-pointer ${
                    hasReacted.heart 
                      ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900" 
                      : "bg-slate-50 dark:bg-brand-dark-alt/50 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  <Heart className={`h-6 w-6 ${hasReacted.heart ? "fill-current scale-110 text-rose-500" : "text-slate-400 transition-transform"}`} />
                  <span className="text-xs font-bold font-mono">{reactions.heart} Yêu thích</span>
                </button>

                <button 
                  onClick={() => handleReact("clap")}
                  className={`flex flex-col items-center gap-2 p-3 px-5 rounded-md transition-all border cursor-pointer ${
                    hasReacted.clap 
                      ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-sky-950/20 dark:border-sky-900" 
                      : "bg-slate-50 dark:bg-brand-dark-alt/50 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  <ThumbsUp className={`h-6 w-6 ${hasReacted.clap ? "fill-current scale-110 text-blue-500" : "text-slate-400"}`} />
                  <span className="text-xs font-bold font-mono">{reactions.clap} Hay quá</span>
                </button>

                <button 
                  onClick={() => handleReact("love")}
                  className={`flex flex-col items-center gap-2 p-3 px-5 rounded-md transition-all border cursor-pointer ${
                    hasReacted.love 
                      ? "bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-950/20 dark:border-purple-900" 
                      : "bg-slate-50 dark:bg-brand-dark-alt/50 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  <Smile className={`h-6 w-6 ${hasReacted.love ? "fill-current scale-110 text-purple-500" : "text-slate-400"}`} />
                  <span className="text-xs font-bold font-mono">{reactions.love} Thú vị</span>
                </button>

                <button 
                  onClick={() => handleReact("idea")}
                  className={`flex flex-col items-center gap-2 p-3 px-5 rounded-md transition-all border cursor-pointer ${
                    hasReacted.idea 
                      ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900" 
                      : "bg-slate-50 dark:bg-brand-dark-alt/50 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  <Award className={`h-6 w-6 ${hasReacted.idea ? "fill-current scale-110 text-amber-500" : "text-slate-400"}`} />
                  <span className="text-xs font-bold font-mono">{reactions.idea} Ý tưởng</span>
                </button>
              </div>
            </div>

            {/* Author Profile Bio details */}
            <div className="my-10">
              <AuthorInfo author={article.author} />
            </div>

            {/* 6. RESPONSIVE ARTICLE NAVIGATION LINKS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#edebe9] dark:border-[#484644] pt-8 my-8">
              {prevArticle ? (
                <Link to={`/post/${prevArticle.slug}`} className="p-5 rounded-lg bg-white dark:bg-[#292827] border border-[#edebe9] dark:border-[#484644] hover:border-[#0078d4] dark:hover:border-[#2899f5] transition-all flex flex-col items-start text-left shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1">
                    <ChevronLeft className="h-3.5 w-3.5" /> Bài trước đó
                  </span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">{prevArticle.title}</span>
                </Link>
              ) : <div />}

              {nextArticle ? (
                <Link to={`/post/${nextArticle.slug}`} className="p-5 rounded-lg bg-white dark:bg-[#292827] border border-[#edebe9] dark:border-[#484644] hover:border-[#0078d4] dark:hover:border-[#2899f5] transition-all flex flex-col items-end text-right shadow-2xs ml-auto w-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1">
                    Bài tiếp theo <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">{nextArticle.title}</span>
                </Link>
              ) : <div />}
            </div>

            {/* 7. HIGH-FIDELITY DISCUSSION COMMENTS BOARD (cmntB Spec) */}
            <Comments articleId={article.id} />

          </div>

          {/* 8. STICKY POST INFO SIDEBAR (Right 1 column) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              
              {/* Widget: Table of Contents */}
              <div className="p-6 rounded-lg liquid-glass border border-[#edebe9] dark:border-[#484644] shadow-sm text-left">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5 border-b border-[#edebe9]/60 dark:border-[#484644]/60 pb-2">
                  <List className="h-4 w-4 text-[#0078d4] dark:text-[#2899f5]" />
                  <span>Mục lục bài viết</span>
                </h3>
                <ul className="space-y-3.5 text-xs font-bold leading-relaxed">
                  {toc.map((heading) => {
                    const isActive = activeId === heading.id;
                    return (
                      <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}>
                        <button 
                          onClick={() => scrollToHeading(heading.id)} 
                          className={`block transition-all text-left w-full cursor-pointer hover:translate-x-1 ${
                            isActive 
                              ? "text-[#0078d4] dark:text-[#2899f5] font-black pl-2 border-l-2 border-[#0078d4] dark:border-[#2899f5]" 
                              : "text-slate-600 dark:text-slate-400 hover:text-[#0078d4] dark:hover:text-[#2899f5]"
                          }`}
                        >
                          {heading.text}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Widget: Actions summary statistics details */}
              <div className="p-6 rounded-lg liquid-glass border border-[#edebe9] dark:border-[#484644] shadow-sm text-left">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 border-b border-[#edebe9]/60 dark:border-[#484644]/60 pb-2">
                  <span>Thông số đọc</span>
                </h3>
                <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  <div className="flex justify-between">
                    <span>Thời gian đọc:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{readingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lưu yêu thích:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{bookmarked ? "Đã lưu" : "Chưa lưu"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tương tác:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {reactions.heart + reactions.clap + reactions.love + reactions.idea} cảm xúc
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* DESKTOP FLOATING LEFT SIDE TOC */}
      <div className="hidden xl:block fixed left-[max(1.5rem,calc((100vw-1320px)/2))] top-28 w-56 text-left z-30 animate-fade-in">
        <div className="p-5 rounded-xl bg-white/60 dark:bg-[#292827]/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
          <h3 className="text-xxs font-black uppercase tracking-widest text-[#0078d4] dark:text-[#2899f5] mb-3 flex items-center gap-1.5 border-b border-[#edebe9]/60 dark:border-[#484644]/60 pb-2">
            <List className="h-3.5 w-3.5" />
            <span>Mục lục nhanh</span>
          </h3>
          <ul className="space-y-3 text-xxs font-black leading-relaxed">
            {toc.map((heading) => {
              const isActive = activeId === heading.id;
              return (
                <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 8}px` }}>
                  <button 
                    onClick={() => scrollToHeading(heading.id)} 
                    className={`block transition-all text-left w-full cursor-pointer hover:translate-x-0.5 truncate ${
                      isActive 
                        ? "text-[#0078d4] dark:text-[#2899f5] font-black scale-102" 
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {heading.text}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* MOBILE & TABLET FLOATING TOC WIDGET */}
      <AnimatePresence>
        {showFloatingTocButton && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="xl:hidden fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
          >
            {isFloatingTocOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="w-72 max-h-80 overflow-y-auto p-5 rounded-xl bg-white/95 dark:bg-[#292827]/95 backdrop-blur-lg border border-slate-200/80 dark:border-zinc-800 shadow-2xl text-left"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2.5 mb-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#0078d4] dark:text-[#2899f5] flex items-center gap-1.5">
                    <List className="h-4 w-4" />
                    <span>Mục lục bài viết</span>
                  </h3>
                  <button 
                    onClick={() => setIsFloatingTocOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <ul className="space-y-3.5 text-xs font-bold leading-relaxed">
                  {toc.map((heading) => {
                    const isActive = activeId === heading.id;
                    return (
                      <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}>
                        <button 
                          onClick={() => scrollToHeading(heading.id)} 
                          className={`block transition-all text-left w-full cursor-pointer ${
                            isActive 
                              ? "text-[#0078d4] dark:text-[#2899f5] font-black pl-2 border-l-2 border-[#0078d4] dark:border-[#2899f5]" 
                              : "text-slate-600 dark:text-slate-400 hover:text-[#0078d4] dark:hover:text-[#2899f5]"
                          }`}
                        >
                          {heading.text}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}

            <button
              onClick={() => setIsFloatingTocOpen(!isFloatingTocOpen)}
              className="p-3.5 rounded-full bg-[#0078d4] dark:bg-[#2899f5] text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-white/20"
              title="Mục lục bài viết"
            >
              {isFloatingTocOpen ? <X className="h-5.5 w-5.5" /> : <List className="h-5.5 w-5.5" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
