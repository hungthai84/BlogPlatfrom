import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Database, Trash2, Moon, Sun, CheckCircle, Upload, Sparkles, Image as ImageIcon, Video, Palette, Grid, Sliders } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useBackgroundContext } from "../App";
import { imageWallpapers, specialAndVideoWallpapers, darkGradientWallpapers } from "../data/wallpapers";

export function Settings() {
  const { isDark, toggleDark } = useDarkMode();
  const { background, backgroundType, cardOpacity, setBackgroundSetting, setCardOpacity } = useBackgroundContext();
  
  const [localStorageData, setLocalStorageData] = useState<{ key: string; value: string }[]>([]);
  const [storageSize, setStorageSize] = useState<string>("0 KB");

  const loadStorageData = () => {
    const data: { key: string; value: string }[] = [];
    let totalBytes = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("plus_ui_") || key === "plus_ui_profile")) {
        const value = localStorage.getItem(key) || "";
        data.push({ key, value });
        totalBytes += key.length + value.length;
      }
    }
    
    setLocalStorageData(data);
    setStorageSize((totalBytes / 1024).toFixed(2) + " KB");
  };

  useEffect(() => {
    loadStorageData();
  }, [isDark]);

  const clearStorage = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu cài đặt? Hành động này không thể hoàn tác.")) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("plus_ui_") || key === "plus_ui_profile")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      loadStorageData();
      window.location.reload(); // Reload to apply default state
    }
  };

  const removeSpecificKey = (keyToRemove: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa dữ liệu cho "${keyToRemove}"?`)) {
      localStorage.removeItem(keyToRemove);
      loadStorageData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-left">
      <header className="border-b border-[#edebe9] dark:border-[#484644] pb-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-[#0078d4]" />
          <h1 className="text-3xl font-black">Cài đặt</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Quản lý cấu hình ứng dụng, hình nền giao diện và dữ liệu lưu trữ cục bộ (Local Storage).
        </p>
      </header>

      {/* Background Settings */}
      <section className="liquid-glass border border-[#edebe9] dark:border-[#484644] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#edebe9] dark:border-[#484644] bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Cài đặt hình nền
          </h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Transparency */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2"><Sliders className="h-4 w-4" /> Độ trong suốt thẻ (Card Opacity)</h3>
              <span className="text-xs font-mono font-bold text-[#0078d4]">{Math.round(cardOpacity * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.1" 
              value={cardOpacity} 
              onChange={(e) => setCardOpacity(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-[#0078d4]"
            />
          </div>

          {/* Images */}
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3"><ImageIcon className="h-4 w-4" /> Hình ảnh tĩnh</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {imageWallpapers.map((url, i) => (
                <button key={i} onClick={() => setBackgroundSetting('image', url)} className={`aspect-square rounded-md overflow-hidden border-2 ${background === url ? 'border-[#0078d4]' : 'border-transparent'}`}>
                  <img src={url} alt={`Wallpaper ${i}`} className="w-full h-full object-cover animate-fade-in" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Gradients */}
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3"><Palette className="h-4 w-4" /> Dải màu Gradient</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {darkGradientWallpapers.map((grad, i) => (
                <button key={i} onClick={() => setBackgroundSetting('gradient', grad)} className={`aspect-square rounded-md overflow-hidden border-2 ${background === grad ? 'border-[#0078d4]' : 'border-transparent'}`} style={{ backgroundImage: grad }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* General Settings */}
      <section className="liquid-glass border border-[#edebe9] dark:border-[#484644] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#edebe9] dark:border-[#484644] bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Cấu hình chung
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Giao diện (Theme)</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Chuyển đổi giữa chế độ sáng và tối.</p>
            </div>
            <button
              onClick={toggleDark}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg font-medium transition-colors border border-[#edebe9] dark:border-[#484644]"
            >
              {isDark ? (
                <>
                  <Moon className="h-4 w-4 text-amber-500" />
                  <span>Chế độ Tối</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 text-blue-500" />
                  <span>Chế độ Sáng</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Local Storage Data */}
      <section className="liquid-glass border border-[#edebe9] dark:border-[#484644] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#edebe9] dark:border-[#484644] bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2">
            <Database className="h-4 w-4" />
            Dữ liệu lưu trữ (Local Storage)
          </h2>
          <span className="text-xs font-mono px-2 py-1 bg-[#0078d4]/10 text-[#0078d4] dark:text-[#2899f5] rounded-md font-bold">
            Dung lượng: {storageSize}
          </span>
        </div>
        
        <div className="p-0">
          {localStorageData.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-500 mb-3 opacity-80" />
              <p>Không có dữ liệu lưu trữ cục bộ nào được tìm thấy.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-[#edebe9] dark:border-[#484644]">
                  <tr>
                    <th className="px-6 py-3 font-semibold w-1/3">Key (Khóa)</th>
                    <th className="px-6 py-3 font-semibold">Value (Giá trị)</th>
                    <th className="px-6 py-3 font-semibold text-right w-24">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edebe9] dark:divide-[#484644]">
                  {localStorageData.map((data, index) => (
                    <tr key={index} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-[#0078d4] dark:text-[#2899f5]">
                        {data.key}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs truncate max-w-xs sm:max-w-md lg:max-w-lg text-slate-600 dark:text-slate-400" title={data.value}>
                        {data.value}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => removeSpecificKey(data.key)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors"
                          title="Xóa khóa này"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {localStorageData.length > 0 && (
          <div className="px-6 py-4 border-t border-[#edebe9] dark:border-[#484644] bg-slate-50 dark:bg-slate-800/20">
            <button
              onClick={clearStorage}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors text-sm ml-auto shadow-sm cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Xóa tất cả dữ liệu
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
