import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useBookmarks } from "../hooks/useBookmarks";
import { useArticles, Collection } from "../hooks/useArticles";
import { ArticleCard } from "../components/ArticleCard";
import { Bookmark, Sparkles, FolderOpen, Plus, Trash2, Folder, ChevronRight, FileText, ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export function Bookmarks() {
  const { bookmarks } = useBookmarks();
  const { articles, collections, addCollection, deleteCollection } = useArticles();
  
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'collections'>('bookmarks');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  
  // Create collection form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [newColDesc, setNewColDesc] = useState("");

  // Filter articles that are saved (bookmarked)
  const savedArticles = articles.filter(article => bookmarks.includes(article.id));

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    addCollection(newColName.trim(), newColDesc.trim());
    setNewColName("");
    setNewColDesc("");
    setShowAddForm(false);
  };

  const getCollectionArticleCount = (colId: string) => {
    return articles.filter(a => a.collectionId === colId).length;
  };

  const selectedCollection = collections.find(c => c.id === selectedCollectionId);
  const collectionArticles = selectedCollectionId 
    ? articles.filter(a => a.collectionId === selectedCollectionId)
    : [];

  return (
    <div className="mx-auto max-w-7xl animate-fade-in">
      
      {/* Intro Header */}
      <div className="mb-8 text-left">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#0078d4]/5 dark:bg-[#2899f5]/10 text-[#0078d4] dark:text-[#2899f5] rounded-full w-fit mb-4 border border-[#0078d4]/10">
          <Bookmark className="h-3.5 w-3.5 fill-current" />
          <span className="text-[10px] font-black uppercase tracking-wider">Lưu trữ & Phân loại</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#323130] dark:text-[#ffffff] tracking-tight flex items-center gap-3 font-sans">
          Thư viện của bạn
        </h1>
        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
          Quản lý các bài viết đã lưu và sắp xếp chúng vào các bộ sưu tập chủ đề khác nhau.
        </p>
      </div>

      {/* Segmented Control / Tabs */}
      <div className="flex border-b border-[#edebe9] dark:border-[#484644] mb-8 gap-6">
        <button
          onClick={() => { setActiveTab('bookmarks'); setSelectedCollectionId(null); }}
          className={`pb-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'bookmarks'
              ? "border-[#0078d4] text-[#0078d4] dark:border-[#2899f5] dark:text-[#2899f5] font-black"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>Bài viết đã lưu ({savedArticles.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'collections'
              ? "border-[#0078d4] text-[#0078d4] dark:border-[#2899f5] dark:text-[#2899f5] font-black"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <FolderOpen className="h-4 w-4" />
          <span>Bộ sưu tập ({collections.length})</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'bookmarks' && (
          <motion.div
            key="bookmarks-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {savedArticles.length === 0 ? (
              <div 
                className="border border-dashed border-[#edebe9] dark:border-[#484644] rounded-xl p-16 text-center max-w-xl mx-auto my-12 bg-white/60 dark:bg-[#292827]/60 backdrop-blur-md shadow-sm"
              >
                <div className="h-16 w-16 bg-[#0078d4]/5 dark:bg-[#2899f5]/10 text-[#0078d4] dark:text-[#2899f5] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 font-sans">Chưa có bài viết nào được lưu</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-6 font-medium">
                  Khám phá các câu chuyện hay về du lịch, nhiếp ảnh và phong cách sống để thêm vào đây.
                </p>
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0078d4] dark:bg-[#2899f5] hover:bg-[#005a9e] dark:hover:bg-[#106ebe] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Khám phá bài viết ngay</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-4">
                {savedArticles.map((article, idx) => (
                  <ArticleCard key={article.id} article={article} index={idx} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'collections' && (
          <motion.div
            key="collections-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {selectedCollectionId === null ? (
              <>
                {/* Header Controls */}
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Danh sách bộ sưu tập</h2>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0078d4] dark:bg-[#2899f5] text-white rounded-lg font-bold text-xs hover:bg-[#106ebe] transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Bộ sưu tập mới</span>
                  </button>
                </div>

                {/* Inline Add Collection Form */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onSubmit={handleCreateCollection}
                      className="p-5 rounded-xl bg-white/80 dark:bg-[#292827]/80 backdrop-blur-md border border-[#edebe9] dark:border-[#484644] shadow-md space-y-4 max-w-xl text-left overflow-hidden"
                    >
                      <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Tạo bộ sưu tập mới</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Tên bộ sưu tập *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: Công nghệ tương lai, Góc suy ngẫm..."
                            value={newColName}
                            onChange={(e) => setNewColName(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1d1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Mô tả ngắn</label>
                          <textarea
                            placeholder="Ghi chú về nội dung lưu trữ trong bộ sưu tập này..."
                            value={newColDesc}
                            onChange={(e) => setNewColDesc(e.target.value)}
                            rows={2}
                            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1d1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
                          />
                        </div>
                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-all cursor-pointer"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#0078d4] text-white hover:bg-[#106ebe] transition-all cursor-pointer"
                          >
                            Xác nhận tạo
                          </button>
                        </div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Collections Grid */}
                {collections.length === 0 ? (
                  <div className="border border-dashed border-[#edebe9] dark:border-[#484644] rounded-xl p-16 text-center max-w-xl mx-auto my-12 bg-white/60 dark:bg-[#292827]/60 backdrop-blur-md">
                    <Folder className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Chưa có bộ sưu tập nào</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Tạo bộ sưu tập đầu tiên để sắp xếp bài viết của bạn thật khoa học.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((col) => {
                      const count = getCollectionArticleCount(col.id);
                      return (
                        <div
                          key={col.id}
                          className="group p-5 rounded-xl bg-white/50 dark:bg-[#292827]/50 border border-[#edebe9] dark:border-[#484644] hover:border-[#0078d4] dark:hover:border-[#2899f5] shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-3 rounded-xl bg-[#0078d4]/10 text-[#0078d4] dark:bg-[#2899f5]/10 dark:text-[#2899f5] w-fit">
                                <Folder className="h-6 w-6 fill-current" />
                              </div>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Bạn có chắc chắn muốn xóa bộ sưu tập "${col.name}"? Các bài viết sẽ không bị xóa.`)) {
                                    deleteCollection(col.id);
                                  }
                                }}
                                className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                                title="Xóa bộ sưu tập"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <h3 className="font-black text-base text-slate-800 dark:text-white group-hover:text-[#0078d4] dark:group-hover:text-[#2899f5] transition-colors">{col.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 min-h-[2rem]">{col.description || "Không có mô tả."}</p>
                          </div>

                          <div className="border-t border-[#edebe9]/60 dark:border-[#484644]/60 pt-3.5 mt-4 flex items-center justify-between text-xxs font-bold uppercase tracking-wider text-slate-400 font-mono">
                            <span>{count} bài viết</span>
                            <button
                              onClick={() => setSelectedCollectionId(col.id)}
                              className="text-[#0078d4] dark:text-[#2899f5] flex items-center gap-1 hover:translate-x-1 transition-all cursor-pointer"
                            >
                              <span>Mở xem</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              /* Detail Collection View */
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedCollectionId(null)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#0078d4] dark:hover:text-[#2899f5] cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Quay lại danh sách bộ sưu tập</span>
                </button>

                <div className="p-6 rounded-xl bg-white/60 dark:bg-[#292827]/60 backdrop-blur-md border border-[#edebe9] dark:border-[#484644] text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <Folder className="h-8 w-8 text-[#0078d4] dark:text-[#2899f5]" />
                      <h2 className="text-2xl font-black text-slate-800 dark:text-white">{selectedCollection?.name}</h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">{selectedCollection?.description || "Không có mô tả."}</p>
                  </div>
                  <span className="text-xxs font-black font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Tạo ngày {selectedCollection?.createdAt}
                  </span>
                </div>

                {collectionArticles.length === 0 ? (
                  <div className="border border-dashed border-[#edebe9] dark:border-[#484644] rounded-xl p-16 text-center max-w-xl mx-auto my-12 bg-white/40 dark:bg-[#292827]/40">
                    <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Chưa có bài viết nào</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Hãy soạn một bài viết mới và chọn gán nó vào bộ sưu tập này.</p>
                    <Link
                      to="/write"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0078d4] dark:bg-[#2899f5] hover:bg-[#005a9e] text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Viết bài và thêm ngay</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collectionArticles.map((article, idx) => (
                      <ArticleCard key={article.id} article={article} index={idx} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
