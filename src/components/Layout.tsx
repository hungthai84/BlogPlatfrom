import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  Camera, 
  Bookmark, 
  User, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Clock, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  Github,
  Twitter,
  Instagram,
  Heart,
  Bell,
  Shield,
  FolderOpen,
  Info,
  CheckCircle,
  HelpCircle,
  Volume2,
  Pencil,
  Settings as SettingsIcon
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useBookmarks } from "../hooks/useBookmarks";
import { SearchOverlay } from "./SearchOverlay";
import { useArticles } from "../hooks/useArticles";
import { useBackgroundContext } from "../App";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isDark, toggleDark } = useDarkMode();
  const { bookmarks } = useBookmarks();
  const { articles } = useArticles();
  const { background, backgroundType, cardOpacity } = useBackgroundContext();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Search Bar States
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);
  const headerSearchRef = useRef<HTMLDivElement>(null);

  // Click outside listener for header search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerSearchRef.current && !headerSearchRef.current.contains(event.target as Node)) {
        setIsHeaderSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Top Notification Bar State
  const [showNotification, setShowNotification] = useState(() => {
    return localStorage.getItem("plus_ui_notification_dismissed") !== "true";
  });

  // Cookie Consent State
  const [showCookieConsent, setShowCookieConsent] = useState(() => {
    return localStorage.getItem("plus_ui_cookie_consent") !== "accepted";
  });

  const handleDismissNotification = () => {
    setShowNotification(false);
    localStorage.setItem("plus_ui_notification_dismissed", "true");
  };

  const handleAcceptCookies = () => {
    setShowCookieConsent(false);
    localStorage.setItem("plus_ui_cookie_consent", "accepted");
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  // Dynamic greeting based on time of day (Plus UI signature)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return { text: "Chúc ngủ ngon", sub: "Chúc bạn có những giấc mơ thật đẹp 🌙", icon: "🌌" };
    if (hour < 12) return { text: "Chào buổi sáng", sub: "Khởi đầu ngày mới tràn đầy năng lượng và sáng tạo ☀️", icon: "☕" };
    if (hour < 18) return { text: "Chào buổi chiều", sub: "Giữ tinh thần tập trung làm việc hiệu quả nhé 💻", icon: "☕" };
    return { text: "Chào buổi tối", sub: "Thời gian thư giãn, sống chậm lại sau ngày dài bận rộn ✨", icon: "🌙" };
  };

  const greeting = getGreeting();

  const menuItems = [
    { name: "Trang chủ", path: "/", icon: Home, badge: null },
    { name: "Nhiếp ảnh", path: "/photography", icon: Camera, badge: null },
    { name: "Viết bài", path: "/write", icon: Pencil, badge: null },
    { name: "Bài viết đã lưu", path: "/bookmarks", icon: Bookmark, badge: bookmarks.length > 0 ? bookmarks.length : null },
  ];

  // Get unique categories/tags for custom label section
  const allTags = Array.from(new Set(articles.flatMap(a => a.tags)));

  // Apply card opacity to CSS variables
  const containerStyle = {
    '--card-opacity': cardOpacity,
    ...(backgroundType !== 'default' ? {
      backgroundImage: backgroundType === 'image' ? `url(${background})` : backgroundType === 'gradient' ? background : undefined,
      backgroundSize: backgroundType === 'image' ? 'cover' : undefined,
      backgroundPosition: backgroundType === 'image' ? 'center' : undefined,
    } : {})
  } as React.CSSProperties;

  return (
    <div className="bg-slate-200 dark:bg-slate-900 p-[15px] min-h-screen">
      <div 
        className="min-h-[calc(100vh-30px)] rounded-[10px] overflow-hidden bg-brand-light-bg dark:bg-brand-dark-bg text-[#323130] dark:text-[#ffffff] flex flex-col transition-colors duration-300 shadow-2xl relative"
        style={containerStyle}
      >
      
      {/* 1. DISMISSIBLE TOP NOTIFICATION BAR (ntfC Widget spec) */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white/20 dark:bg-slate-900/20 backdrop-blur-lg text-white border-b border-white/10 relative overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2 mx-auto sm:mx-0">
                <span className="px-2 py-0.5 bg-white/20 text-white rounded text-[10px] uppercase font-bold animate-pulse">Tin mới</span>
                <span className="text-slate-100 truncate max-w-[280px] sm:max-w-none">
                  Plus UI Blog chính thức ra mắt phiên bản React High-Fidelity mượt mà! 🚀
                </span>
                <Link to="/settings" className="underline text-white hover:text-slate-200 transition-colors hidden sm:inline ml-2">Cài đặt ngay →</Link>
              </div>
              <button 
                onClick={handleDismissNotification}
                className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer shrink-0 ml-4"
                title="Tắt thông báo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-0">

        {/* 3. MOBILE OVERLAY MENU DRAWER */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
              />
              {/* Mobile Sidebar */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-brand-light-card dark:bg-brand-dark-card border-r border-[#edebe9] dark:border-[#484644] p-6 flex flex-col justify-between md:hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center gap-3 font-semibold text-lg tracking-wider" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="h-9 w-9 rounded-md bg-[#0078d4] dark:bg-[#2899f5] flex items-center justify-center text-white">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-[#323130] dark:text-[#ffffff]">PLUS <span className="text-[#0078d4] dark:text-[#2899f5]">UI</span></span>
                    </Link>
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <ul className="space-y-1 mb-8 text-left">
                    {menuItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-all ${
                              isActive 
                                ? "bg-[#0078d4]/5 dark:bg-[#2899f5]/10 text-[#0078d4] dark:text-[#2899f5]"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                            {item.badge !== null && (
                              <span className="ml-auto px-1.5 py-0.5 text-xxs font-bold bg-[#0078d4] dark:bg-[#2899f5] text-white rounded-md">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <div>
                    <p className="px-4 mb-3 text-[10px] font-black tracking-widest uppercase text-slate-400 dark:text-slate-500 text-left">
                      Chủ đề thịnh hành
                    </p>
                    <div className="flex flex-wrap gap-1.5 px-3">
                      {allTags.map(tag => (
                        <span 
                          key={tag}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="cursor-pointer px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#0078d4]/5 hover:text-[#0078d4] dark:hover:text-[#2899f5] transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#edebe9] dark:border-[#484644] flex items-center justify-between">
                  <Link 
                    to="/settings" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-left hover:text-[#0078d4] dark:hover:text-[#2899f5] transition-colors"
                  >
                    <SettingsIcon className="h-6 w-6 text-slate-400" />
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">Cấu hình hệ thống</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Mở trang cài đặt</p>
                    </div>
                  </Link>
                  <button 
                    onClick={toggleDark}
                    className="p-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#0078d4] dark:hover:text-[#2899f5] cursor-pointer"
                  >
                    {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* 4. MAIN WORKSPACE CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* HEADER TOPBAR (mainH spec) */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#edebe9] dark:border-[#484644] bg-brand-light-card/85 dark:bg-brand-dark-card/85 backdrop-blur-md px-4 sm:px-6 lg:px-8">
            
            {/* Header Left: Greeting */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <Link to="/" className="flex items-center gap-3 font-semibold text-lg tracking-wider">
                <div className="h-9 w-9 rounded-md bg-[#0078d4] dark:bg-[#2899f5] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <span className="font-bold text-[#323130] dark:text-[#ffffff] font-sans hidden sm:block">
                  PLUS <span className="text-[#0078d4] dark:text-[#2899f5]">UI</span>
                </span>
              </Link>

              {/* Navigation Links in Header */}
              <nav className="hidden md:flex items-center gap-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                        isActive 
                          ? "bg-[#0078d4]/5 dark:bg-[#2899f5]/10 text-[#0078d4] dark:text-[#2899f5]"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-[#0078d4] dark:hover:text-[#2899f5]"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* Header Right: Search, Bookmarks, Theme, Profile */}


            {/* Header Right: Profile link */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Interactive Search Bar in Header */}
              <div className="relative" ref={headerSearchRef}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100/60 dark:bg-slate-800/40 border border-[#edebe9]/30 dark:border-[#484644]/30 focus-within:ring-2 focus-within:ring-[#0078d4] dark:focus-within:ring-[#2899f5] transition-all">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Tìm bài viết, nhãn..." 
                    value={headerSearchQuery}
                    onChange={(e) => setHeaderSearchQuery(e.target.value)}
                    onFocus={() => setIsHeaderSearchFocused(true)}
                    className="bg-transparent border-none outline-none text-xs text-[#323130] dark:text-[#ffffff] placeholder:text-slate-400 w-24 sm:w-36 md:w-44 lg:w-48 transition-all"
                  />
                  {headerSearchQuery && (
                    <button 
                      onClick={() => setHeaderSearchQuery("")}
                      className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full cursor-pointer"
                    >
                      <X className="h-3 w-3 text-slate-400" />
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {isHeaderSearchFocused && headerSearchQuery.trim().length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto bg-white dark:bg-[#292827] border border-[#edebe9] dark:border-[#484644] rounded-lg shadow-2xl z-50 p-2 text-left"
                    >
                      <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 px-3 py-1.5 font-mono">
                        Kết quả ({
                          articles.filter(art => 
                            art.title.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
                            art.tags.some(tag => tag.toLowerCase().includes(headerSearchQuery.toLowerCase()))
                          ).length
                        })
                      </div>
                      <div className="divide-y divide-[#edebe9]/50 dark:divide-[#484644]/50">
                        {(() => {
                          const filtered = articles.filter(art => 
                            art.title.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
                            art.tags.some(tag => tag.toLowerCase().includes(headerSearchQuery.toLowerCase()))
                          );
                          if (filtered.length === 0) {
                            return (
                              <div className="p-4 text-xs text-center text-slate-400 dark:text-slate-500 font-semibold">
                                Không tìm thấy kết quả nào phù hợp.
                              </div>
                            );
                          }
                          return filtered.map((art) => (
                            <Link
                              key={art.id}
                              to={`/post/${art.slug}`}
                              onClick={() => {
                                setHeaderSearchQuery("");
                                setIsHeaderSearchFocused(false);
                              }}
                              className="block p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-md transition-colors"
                            >
                              <div className="flex flex-wrap gap-1 mb-1">
                                {art.tags.slice(0, 2).map(tag => (
                                  <span key={tag} className="text-[9px] font-black uppercase text-[#0078d4] dark:text-[#2899f5] tracking-wider">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1 block">
                                {art.title}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5 block">
                                {art.excerpt}
                              </span>
                            </Link>
                          ));
                        })()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bookmarks Overlay indicator */}
              <Link 
                to="/bookmarks" 
                className="p-2 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-all"
                title="Bài viết đã lưu"
              >
                <Bookmark className="h-5 w-5" />
                {bookmarks.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#0078d4] dark:bg-[#2899f5] animate-ping" />
                )}
              </Link>

              {/* Dark mode toggle */}
              <button 
                onClick={toggleDark}
                className="p-2 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                title="Thay đổi màu nền"
              >
                {isDark ? <Sun className="h-5 w-5 text-amber-500 animate-spin-slow" /> : <Moon className="h-5 w-5 text-blue-600" />}
              </button>
              
              {/* Settings Link */}
              <Link to="/settings" title="Cài đặt" className="p-2 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center">
                <SettingsIcon className="h-5 w-5" />
              </Link>
            </div>
          </header>

          {/* PAGE MAIN WORKSPACE SECTION */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* DYNAMIC HIGH-FIDELITY FOOTER (fotB / Credit specs) */}
      <footer className="border-t border-white/10 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg py-10 px-4 sm:px-6 lg:px-8 transition-colors text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 font-black text-[#323130] dark:text-[#ffffff] tracking-wider font-sans">
              <div className="h-7 w-7 rounded-lg bg-[#0078d4] dark:bg-[#2899f5] flex items-center justify-center text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>PLUS <span className="text-[#0078d4] dark:text-[#2899f5]">UI</span> BLOG</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
              © {new Date().getFullYear()} Plus UI Blog. Giao diện được thiết kế hoàn thiện theo phong cách Plus UI Blogger Template danh tiếng.
            </p>
          </div>

          {/* Social Channels links */}
          <div className="flex gap-3">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-md bg-slate-50 dark:bg-brand-dark-alt text-slate-500 dark:text-slate-400 hover:text-white hover:bg-[#0078d4] dark:hover:bg-[#2899f5] transition-all">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-md bg-slate-50 dark:bg-brand-dark-alt text-slate-500 dark:text-slate-400 hover:text-white hover:bg-[#0078d4] dark:hover:bg-[#2899f5] transition-all">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-md bg-slate-50 dark:bg-brand-dark-alt text-slate-500 dark:text-slate-400 hover:text-white hover:bg-pink-600 transition-all">
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          {/* Heart signature indicator */}
          <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-semibold">
            <span>Thiết kế tỉ mỉ với</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>dành cho bạn.</span>
          </div>
        </div>
      </footer>

      {/* 5. COOKIE CONSENT DRAWER (ckW Widget spec) */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-5 left-5 right-5 md:right-auto md:max-w-md z-50 p-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-lg shadow-2xl transition-colors text-left"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 dark:bg-sky-950/20 text-[#0078d4] dark:text-[#2899f5] rounded-md">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Quyền riêng tư & Cookie</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Chúng tôi sử dụng cookie để ghi nhớ các bài viết bạn đã lưu trữ và mang đến trải nghiệm đọc tối ưu nhất. Khi tiếp tục duyệt, bạn đồng ý với chính sách này.
                </p>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Link to="/settings" className="text-xxs font-bold text-[#0078d4] dark:text-[#2899f5] hover:underline uppercase tracking-wider">Chi tiết</Link>
                  <button 
                    onClick={handleAcceptCookies}
                    className="px-4 py-1.5 rounded-md bg-[#0078d4] dark:bg-[#2899f5] hover:bg-[#005a9e] dark:hover:bg-[#106ebe] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Tôi đồng ý
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay overlay modal */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </div>
  );
}
