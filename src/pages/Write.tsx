import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pen, Image as ImageIcon, Tags, Type, AlignLeft, FileText, Plus, Save, Eye, Edit3, Code, FolderOpen, ArrowLeft } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { useDarkMode } from "../hooks/useDarkMode";
import { useArticles } from "../hooks/useArticles";

const DEFAULT_TEMPLATES = {
  blog: `## Giới thiệu\n\nNêu vấn đề và mục đích bài viết của bạn tại đây.\n\n## Nội dung chính\n\nTrình bày các luận điểm chính:\n- Luận điểm 1\n- Luận điểm 2\n\n> Bạn có thể thêm các trích dẫn làm nổi bật bài viết.\n\n## Kết luận\n\nTóm tắt lại các ý chính và kêu gọi hành động (Call to Action).`,
  review: `## Đánh giá tổng quan\n\n- **Điểm đánh giá:** 8/10\n- **Ưu điểm:** \n  - Ưu điểm 1\n  - Ưu điểm 2\n- **Nhược điểm:** \n  - Nhược điểm 1\n\n## Chi tiết\n\nPhân tích sâu hơn về trải nghiệm của bạn...\n\n## Lời khuyên\n\nCó nên mua/sử dụng không? Dành cho ai?`,
  tutorial: `## Mục tiêu\n\nSau bài hướng dẫn này, bạn sẽ có thể...\n\n## Chuẩn bị (Prerequisites)\n\n- Công cụ A\n- Kiến thức B\n\n## Các bước thực hiện\n\n### Bước 1: Tiêu đề bước 1\nChi tiết cách thực hiện bước 1.\n\n### Bước 2: Tiêu đề bước 2\nChi tiết cách thực hiện bước 2.\n\n## Khắc phục lỗi (Troubleshooting)\n\nCác lỗi thường gặp và cách giải quyết.`
};

export function Write() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  
  const { isDark } = useDarkMode();
  const { articles, collections, addArticle, updateArticle, addCollection } = useArticles();

  // Load custom templates
  const [customTemplates, setCustomTemplates] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("plus_ui_custom_templates");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const allTemplates = { ...DEFAULT_TEMPLATES, ...customTemplates };

  // Form states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewCollectionInput, setShowNewCollectionInput] = useState(false);

  // Editor specific states
  const [viewMode, setViewMode] = useState<'visual' | 'html'>('visual');
  const [editorPreviewMode, setEditorPreviewMode] = useState<'edit' | 'preview'>('edit');

  // Load existing article for editing
  useEffect(() => {
    if (editId) {
      const art = articles.find(a => a.id === editId);
      if (art) {
        setTitle(art.title);
        setExcerpt(art.excerpt || "");
        setContent(art.content || "");
        setTags(art.tags.join(", "));
        setCoverImage(art.coverImage || "");
        setSelectedCollectionId(art.collectionId || "");
      }
    }
  }, [editId, articles]);

  const applyTemplate = (templateKey: string) => {
    setContent(prev => prev + (prev ? "\n\n" : "") + allTemplates[templateKey as keyof typeof allTemplates]);
  };

  const handleSaveAsTemplate = () => {
    if (!content.trim()) {
      alert("Vui lòng viết nội dung vào trình soạn thảo trước khi lưu thành mẫu!");
      return;
    }
    const name = prompt("Nhập tên cho mẫu soạn thảo mới của bạn:");
    if (name && name.trim()) {
      const updated = {
        ...customTemplates,
        [name.trim()]: content
      };
      setCustomTemplates(updated);
      localStorage.setItem("plus_ui_custom_templates", JSON.stringify(updated));
      alert(`Đã lưu mẫu "${name}" thành công!`);
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent(prev => prev + `\n![${file.name}](${reader.result as string})\n`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCollectionInline = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    const newCol = addCollection(newCollectionName.trim(), "Bộ sưu tập tạo nhanh khi soạn bài viết.");
    setSelectedCollectionId(newCol.id);
    setNewCollectionName("");
    setShowNewCollectionInput(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    
    const slug = title.toLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
      .replace(/ì|í|ị|ỉ|ĩ/g, "i")
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const articleData = {
      title,
      excerpt,
      content,
      coverImage: coverImage || "https://picsum.photos/seed/" + Date.now() + "/1600/900",
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      collectionId: selectedCollectionId || undefined,
    };

    if (editId) {
      // Editing Mode
      const existing = articles.find(a => a.id === editId);
      updateArticle({
        ...existing,
        ...articleData,
        id: editId,
        slug: existing?.slug || slug,
        date: existing?.date || new Date().toLocaleDateString("vi-VN"),
        readTime: Math.ceil(content.length / 500) + " phút đọc",
        author: existing?.author || {
          name: "Blogger",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
          bio: "Tác giả bài viết"
        }
      });
    } else {
      // Creation Mode
      addArticle({
        id: Date.now().toString(),
        slug: slug || "untitled-" + Date.now(),
        ...articleData,
        date: new Date().toLocaleDateString("vi-VN"),
        readTime: Math.ceil(content.length / 500) + " phút đọc",
        author: {
          name: "Blogger",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
          bio: "Tác giả bài viết"
        }
      });
    }
    
    navigate("/bookmarks?tab=collections");
  };

  return (
    <div className="mx-auto max-w-4xl animate-fade-in" data-color-mode={isDark ? "dark" : "light"}>
      
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0078d4] dark:hover:text-[#2899f5] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </button>
      </div>

      <h1 className="text-3xl font-black mb-8 flex items-center gap-3 text-slate-900 dark:text-white font-sans">
        <Pen className="h-8 w-8 text-[#0078d4] dark:text-[#2899f5]" />
        <span>{editId ? "Chỉnh sửa bài viết" : "Soạn bài viết"}</span>
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title Input */}
        <div className="space-y-2 text-left">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            <Type className="h-4 w-4 text-[#0078d4] dark:text-[#2899f5]" />
            Tiêu đề bài viết
          </label>
          <input 
            type="text" placeholder="Nhập tiêu đề thật hấp dẫn..." value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#0078d4] dark:focus:ring-[#2899f5] shadow-sm transition-all"
            required
          />
        </div>

        {/* Excerpt Input */}
        <div className="space-y-2 text-left">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            <AlignLeft className="h-4 w-4 text-[#0078d4] dark:text-[#2899f5]" />
            Tóm tắt
          </label>
          <input 
            type="text" placeholder="Tóm tắt ngắn gọn nội dung chính..." value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] focus:outline-none focus:ring-2 focus:ring-[#0078d4] dark:focus:ring-[#2899f5] shadow-sm transition-all"
            required
          />
        </div>

        {/* Collection Selector & Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Collection Selector */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <FolderOpen className="h-4 w-4 text-[#0078d4] dark:text-[#2899f5]" />
              Chọn Bộ sưu tập
            </label>
            <div className="flex gap-2">
              {!showNewCollectionInput ? (
                <>
                  <select
                    value={selectedCollectionId}
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] focus:outline-none focus:ring-2 focus:ring-[#0078d4] dark:focus:ring-[#2899f5] text-sm font-medium shadow-sm transition-all"
                  >
                    <option value="">-- Không thuộc bộ sưu tập nào --</option>
                    {collections.map(col => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCollectionInput(true)}
                    className="px-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#292827] dark:hover:bg-zinc-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#0078d4] dark:text-[#2899f5] transition-all cursor-pointer shadow-sm flex items-center justify-center"
                    title="Tạo nhanh bộ sưu tập"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="flex w-full gap-1.5">
                  <input
                    type="text"
                    placeholder="Tên bộ sưu tập..."
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCollectionInline}
                    className="px-3 bg-[#0078d4] text-white rounded-xl text-xs font-bold hover:bg-[#106ebe] transition-all cursor-pointer"
                  >
                    Tạo
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCollectionInput(false)}
                    className="px-3 bg-slate-100 dark:bg-zinc-800 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <Tags className="h-4 w-4 text-[#0078d4] dark:text-[#2899f5]" />
              Thẻ (Tags)
            </label>
            <input 
              type="text" placeholder="công nghệ, lập trình, đời sống..." value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] focus:outline-none focus:ring-2 focus:ring-[#0078d4] dark:focus:ring-[#2899f5] shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Media Row (Cover Image Upload from Local) */}
        <div className="space-y-2 text-left">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            <ImageIcon className="h-4 w-4 text-[#0078d4] dark:text-[#2899f5]" />
            Ảnh bìa (Up từ máy hoặc điền URL)
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-auto">
              <label className="px-4 py-3 bg-[#0078d4]/10 hover:bg-[#0078d4]/20 text-[#0078d4] dark:text-[#2899f5] dark:bg-[#2899f5]/10 dark:hover:bg-[#2899f5]/20 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 justify-center shadow-sm">
                <ImageIcon className="h-4 w-4" />
                <span>Chọn ảnh từ máy</span>
                <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" />
              </label>
            </div>
            
            <div className="flex-1 w-full">
              <input 
                type="text" placeholder="Hoặc dán URL ảnh bìa tại đây..." value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] dark:focus:ring-[#2899f5] shadow-sm"
              />
            </div>

            {coverImage && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => setCoverImage("")}
                  className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Editor (Google Blog style with customized toolbar controls) */}
        <div className="space-y-2 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#edebe9] dark:border-[#484644] pb-3 mb-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <Pen className="h-4 w-4 text-[#0078d4] dark:text-[#2899f5]" />
              Nội dung bài viết
              <span className="text-xs font-normal text-slate-500 ml-2">Hỗ trợ Markdown và HTML</span>
            </label>
            
            {/* Editor Top Toolbar (Blogger Style) */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Write / Preview Tab Toggles */}
              {viewMode === 'visual' && (
                <div className="flex items-center bg-slate-100 dark:bg-zinc-800 rounded-lg p-1.5 shadow-sm border border-slate-200/50 dark:border-zinc-700/50">
                  <button
                    type="button"
                    onClick={() => setEditorPreviewMode('edit')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                      editorPreviewMode === 'edit'
                        ? "bg-white dark:bg-[#292827] text-[#0078d4] dark:text-[#2899f5] shadow-sm font-black"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Soạn thảo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorPreviewMode('preview')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                      editorPreviewMode === 'preview'
                        ? "bg-white dark:bg-[#292827] text-[#0078d4] dark:text-[#2899f5] shadow-sm font-black"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    <span>Xem trước</span>
                  </button>
                </div>
              )}

              {/* View HTML Mode toggle */}
              <button 
                type="button" 
                onClick={() => setViewMode(prev => prev === 'visual' ? 'html' : 'visual')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border shadow-sm flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'html'
                    ? "bg-[#0078d4] border-[#0078d4] text-white dark:bg-[#2899f5] dark:border-[#2899f5]"
                    : "bg-white dark:bg-[#292827] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                }`}
              >
                <Code className="h-3.5 w-3.5" />
                <span>Xem HTML</span>
              </button>
              
              {/* Media upload */}
              <label className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-[#292827] hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm">
                <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />
                <span>Tải ảnh lên</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              
              {/* Template dropdown triggers */}
              <div className="relative group">
                <button type="button" className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-[#292827] hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-all flex items-center gap-1 shadow-sm">
                  <span>Chèn mẫu</span>
                </button>
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl hidden group-hover:block z-10 p-2 space-y-1 text-left">
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 p-1 font-mono">Chọn biểu mẫu</p>
                  {Object.keys(allTemplates).map((key) => (
                    <button 
                      key={key} 
                      type="button" 
                      onClick={() => applyTemplate(key)} 
                      className="block w-full text-left px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 rounded capitalize text-slate-600 dark:text-slate-300 font-bold"
                    >
                      {key.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Create Custom Template (Tạo mẫu) */}
              <button
                type="button"
                onClick={handleSaveAsTemplate}
                className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-[#292827] hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Lưu nội dung soạn thảo hiện tại thành biểu mẫu riêng"
              >
                <Save className="h-3.5 w-3.5 text-blue-500" />
                <span>Tạo mẫu</span>
              </button>

            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mt-2 shadow-inner bg-white dark:bg-[#1e1d1c]">
            {viewMode === 'visual' ? (
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                height={550}
                preview={editorPreviewMode}
                className="w-full !font-sans bg-transparent"
                hideToolbar={false}
              />
            ) : (
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập mã HTML hoặc nội dung văn bản tại đây..."
                className="w-full h-[550px] p-4 bg-[#1e1d1c] text-slate-100 font-mono text-sm focus:outline-none leading-relaxed border-none"
              />
            )}
          </div>
        </div>
        
        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button type="submit" className="px-8 py-3.5 bg-[#0078d4] dark:bg-[#2899f5] text-white rounded-xl font-bold text-lg hover:bg-[#106ebe] dark:hover:bg-[#106ebe] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer">
            <Save className="h-5 w-5" />
            <span>{editId ? "Cập Nhật Bài Viết" : "Đăng Bài Viết"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
