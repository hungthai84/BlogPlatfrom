import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pen, Image as ImageIcon, Tags, Type, AlignLeft, FileText } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { useDarkMode } from "../hooks/useDarkMode";

const TEMPLATES = {
  blog: `## Giới thiệu

Nêu vấn đề và mục đích bài viết của bạn tại đây.

## Nội dung chính

Trình bày các luận điểm chính:
- Luận điểm 1
- Luận điểm 2

> Bạn có thể thêm các trích dẫn làm nổi bật bài viết.

## Kết luận

Tóm tắt lại các ý chính và kêu gọi hành động (Call to Action).`,
  review: `## Đánh giá tổng quan

- **Điểm đánh giá:** 8/10
- **Ưu điểm:** 
  - Ưu điểm 1
  - Ưu điểm 2
- **Nhược điểm:** 
  - Nhược điểm 1

## Chi tiết

Phân tích sâu hơn về trải nghiệm của bạn...

## Lời khuyên

Có nên mua/sử dụng không? Dành cho ai?`,
  tutorial: `## Mục tiêu

Sau bài hướng dẫn này, bạn sẽ có thể...

## Chuẩn bị (Prerequisites)

- Công cụ A
- Kiến thức B

## Các bước thực hiện

### Bước 1: Tiêu đề bước 1
Chi tiết cách thực hiện bước 1.

### Bước 2: Tiêu đề bước 2
Chi tiết cách thực hiện bước 2.

## Khắc phục lỗi (Troubleshooting)

Các lỗi thường gặp và cách giải quyết.`,
  'cập nhật-nhanh': `## ⚡ Cập nhật nhanh\n\nThông tin mới nhất về...`,
  'thông-báo-mới': `## 📢 Thông báo mới\n\nChúng tôi xin thông báo về...`,
  'chào-đón-thành-viên': `## 👋 Chào đón thành viên mới\n\nChào mừng bạn đến với cộng đồng...`,
  'chia-sẻ-ý-tưởng': `## 💡 Chia sẻ ý tưởng\n\nTôi có một ý tưởng về...`,
  'bình-chọn': `## 🗳️ Bình chọn\n\nBạn nghĩ sao về...?\n- [ ] Lựa chọn 1\n- [ ] Lựa chọn 2`,
  'thảo-luận-mới': `## 💬 Thảo luận mới\n\nChủ đề hôm nay là...`,
  'sự-kiện': `## 📅 Sự kiện sắp tới\n\nThời gian: ...\nĐịa điểm: ...`,
  'khen-thưởng': `## 🏆 Khen thưởng\n\nChúc mừng bạn đã đạt được...`
};

export function Write() {
  const navigate = useNavigate();
  const { isDark } = useDarkMode();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [viewMode, setViewMode] = useState<'visual' | 'html'>('visual');

  const applyTemplate = (templateKey: keyof typeof TEMPLATES) => {
    setContent(prev => prev + (prev ? "\n\n" : "") + TEMPLATES[templateKey]);
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (coverImage) URL.revokeObjectURL(coverImage);
      const objectUrl = URL.createObjectURL(file);
      setCoverImage(objectUrl);
    }
  };

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (coverImage && coverImage.startsWith('blob:')) {
        URL.revokeObjectURL(coverImage);
      }
    };
  }, [coverImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setContent(prev => prev + `\n![${file.name}](${objectUrl})\n`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    
    const response = await fetch("/api/articles");
    const existingArticles = await response.json();
    
    const newArticle = {
      id: Date.now().toString(),
      slug: title.toLowerCase().replace(/ /g, '-'),
      title,
      excerpt,
      content,
      coverImage: coverImage || "https://picsum.photos/seed/" + Date.now() + "/1600/900",
      date: new Date().toLocaleDateString("vi-VN"),
      readTime: Math.ceil(content.length / 500) + " min read",
      author: {
        name: "Jane Doe",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
        bio: "..."
      },
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    };
    
    await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([...existingArticles, newArticle]),
    });
    
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-4xl" data-color-mode={isDark ? "dark" : "light"}>
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
        <Pen className="h-8 w-8 text-[#0078d4]" />
        Soạn bài viết
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            <Type className="h-4 w-4 text-[#0078d4]" />
            Tiêu đề bài viết
          </label>
          <input 
            type="text" placeholder="Nhập tiêu đề thật hấp dẫn..." value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
            required
          />
        </div>

        {/* Excerpt Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            <AlignLeft className="h-4 w-4 text-[#0078d4]" />
            Tóm tắt
          </label>
          <input 
            type="text" placeholder="Tóm tắt ngắn gọn nội dung chính..." value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
            required
          />
        </div>

        {/* Media & Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <ImageIcon className="h-4 w-4 text-[#0078d4]" />
              Ảnh bìa (Up từ máy)
              <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" />
            </label>
            <div className="flex gap-2">
              <input 
                type="text" placeholder="URL hoặc chọn file..." value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full p-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
              />
              {coverImage && <img src={coverImage} alt="Cover preview" className="h-12 w-12 object-cover rounded-md" />}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <Tags className="h-4 w-4 text-[#0078d4]" />
              Thẻ (Tags)
            </label>
            <input 
              type="text" placeholder="công nghệ, lập trình, đời sống..." value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
            />
          </div>
        </div>
        
        {/* Editor */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <Pen className="h-4 w-4 text-[#0078d4]" />
              Nội dung chính
              <span className="text-xs font-normal text-slate-500 ml-2">Hỗ trợ Markdown</span>
            </label>
            
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={() => setViewMode(prev => prev === 'visual' ? 'html' : 'visual')}
                className="px-3 py-1.5 text-xs font-medium bg-[#0078d4] text-white rounded-md transition-colors"
              >
                {viewMode === 'visual' ? 'Xem HTML' : 'Xem Soạn thảo'}
              </button>
              
              {viewMode === 'html' && (
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-md p-1">
                  <button type="button" onClick={() => setContent(prev => prev + "**Đậm**")} className="px-2 py-1 text-xs font-bold">Đậm</button>
                  <button type="button" onClick={() => setContent(prev => prev + "*Nghiêng*")} className="px-2 py-1 text-xs italic">Nghiêng</button>
                  <button type="button" onClick={() => setContent(prev => prev + "[Liên kết](url)")} className="px-2 py-1 text-xs underline">Liên kết</button>
                </div>
              )}
              
              <label className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors cursor-pointer flex items-center gap-1.5">
                <ImageIcon className="h-3 w-3" />
                Tải ảnh lên
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              
              <div className="relative group">
                <button type="button" className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">Chèn mẫu</button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl hidden group-hover:block z-10 p-2 space-y-1">
                  {Object.entries(TEMPLATES).map(([key, _]) => (
                    <button key={key} type="button" onClick={() => applyTemplate(key as keyof typeof TEMPLATES)} className="block w-full text-left px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 rounded capitalize">{key.replace(/-/g, ' ')}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mt-2 liquid-glass">
            {viewMode === 'visual' ? (
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                height={500}
                preview="live"
                className="w-full !font-sans bg-transparent"
              />
            ) : (
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[500px] p-4 bg-transparent font-mono text-sm focus:outline-none"
              />
            )}
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button type="submit" className="px-8 py-3.5 bg-[#0078d4] text-white rounded-md font-bold text-lg hover:bg-[#106ebe] transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
            <Pen className="h-5 w-5" />
            Đăng Bài Viết
          </button>
        </div>
      </form>
    </div>
  );
}
