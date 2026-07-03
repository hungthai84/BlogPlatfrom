import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Database, Trash2, Moon, Sun, CheckCircle, User, Upload, Sparkles, Image as ImageIcon, Video, Palette, Grid, Sliders } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useProfile } from "../hooks/useProfile";
import { useBackgroundContext } from "../App";
import { imageWallpapers, specialAndVideoWallpapers, darkGradientWallpapers } from "../data/wallpapers";

export function Settings() {
  const { isDark, toggleDark } = useDarkMode();
  const { profile, updateProfile } = useProfile();
  const { background, backgroundType, cardOpacity, setBackgroundSetting, setCardOpacity } = useBackgroundContext();
  
  // Profile edit states
  const [profileName, setProfileName] = useState(profile.name);
  const [profileBio, setProfileBio] = useState(profile.bio);
  const [profileAvatar, setProfileAvatar] = useState(profile.avatar);
  const [profileTwitter, setProfileTwitter] = useState(profile.twitter || "");
  const [profileInstagram, setProfileInstagram] = useState(profile.instagram || "");
  const [isSaved, setIsSaved] = useState(false);

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

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      bio: profileBio,
      avatar: profileAvatar,
      twitter: profileTwitter,
      instagram: profileInstagram,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    loadStorageData();
  };

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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <header className="border-b border-[#edebe9] dark:border-[#484644] pb-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-[#0078d4]" />
          <h1 className="text-3xl font-black">Cài đặt</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Quản lý cấu hình ứng dụng, hồ sơ tác giả và dữ liệu lưu trữ cục bộ (Local Storage).
        </p>
      </header>

      {/* Edit Profile Section */}
      <section className="liquid-glass border border-[#edebe9] dark:border-[#484644] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#edebe9] dark:border-[#484644] bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2">
            <User className="h-4 w-4" />
            Hồ sơ tác giả (Profile)
          </h2>
        </div>
        <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side: Avatar photo upload preview */}
            <div className="flex flex-col items-center gap-3 w-full md:w-1/4">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Ảnh đại diện</span>
              <div className="relative w-32 h-32 rounded-full overflow-hidden border border-[#edebe9] dark:border-[#484644] group bg-slate-100/50 dark:bg-slate-800/50 flex items-center justify-center shadow-inner">
                {profileAvatar ? (
                  <img src={profileAvatar} alt={profileName} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                )}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity duration-200">
                  <Upload className="h-5 w-5 mb-1" />
                  <span className="text-[10px] font-bold">Thay ảnh</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] text-center font-medium">Hỗ trợ JPG, PNG, GIF</p>
            </div>

            {/* Right side: Input fields */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tên hiển thị</label>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Mô tả tiểu sử (Bio)</label>
                <textarea 
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Twitter Username</label>
                  <input 
                    type="text" 
                    value={profileTwitter}
                    placeholder="@username"
                    onChange={(e) => setProfileTwitter(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Instagram Username</label>
                  <input 
                    type="text" 
                    value={profileInstagram}
                    placeholder="@username"
                    onChange={(e) => setProfileInstagram(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#292827] focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#edebe9] dark:border-[#484644] pt-4 flex items-center justify-between">
            {isSaved ? (
              <span className="text-emerald-500 dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5 animate-bounce">
                <CheckCircle className="h-4 w-4" />
                Đã lưu hồ sơ thành công!
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">Nhấn "Lưu thay đổi" để áp dụng profile mới</span>
            )}
            <button
              type="submit"
              className="px-5 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded-lg font-bold transition-colors shadow-sm text-sm"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </section>

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
                  <img src={url} alt={`Wallpaper ${i}`} className="w-full h-full object-cover" />
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
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors text-sm ml-auto shadow-sm"
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
