import { motion } from "motion/react";
import { useState } from "react";
import { Lightbox } from "../components/Lightbox";
import { FadeImage } from "../components/FadeImage";
import { Camera, Eye, MapPin } from "lucide-react";

const photos = [
  { src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&h=1200&fit=crop", width: 800, height: 1200, alt: "Urban landscape", caption: "Tokyo, Nhật Bản" },
  { src: "https://images.unsplash.com/photo-1531366936337-77850807abf8?q=80&w=1200&h=800&fit=crop", width: 1200, height: 800, alt: "Mountain range", caption: "Swiss Alps, Thụy Sĩ" },
  { src: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&h=800&fit=crop", width: 800, height: 800, alt: "Coffee shop", caption: "Kyoto, Nhật Bản" },
  { src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&h=1600&fit=crop", width: 1200, height: 1600, alt: "Street photography", caption: "Paris, Pháp" },
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&h=1000&fit=crop", width: 800, height: 1000, alt: "Portrait", caption: "Venice, Ý" },
  { src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1600&h=900&fit=crop", width: 1600, height: 900, alt: "Ocean waves", caption: "Pacific Coast, Mỹ" },
  { src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=800&h=800&fit=crop", width: 800, height: 800, alt: "Architecture", caption: "London, Anh Quốc" },
  { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&h=1200&fit=crop", width: 1000, height: 1200, alt: "Forest path", caption: "Vancouver, Canada" },
  { src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1200&h=800&fit=crop", width: 1200, height: 800, alt: "Desert dunes", caption: "Sahara Desert" },
  { src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&h=1200&fit=crop", width: 800, height: 1200, alt: "City lights", caption: "New York, Mỹ" },
  { src: "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?q=80&w=800&h=800&fit=crop", width: 800, height: 800, alt: "Still life", caption: "Rome, Ý" },
  { src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&h=1200&fit=crop", width: 1600, height: 1200, alt: "Canyon", caption: "Grand Canyon, Mỹ" },
];

export function Photography() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Intro Header */}
      <div className="mb-10 text-left">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#0078d4]/5 dark:bg-[#2899f5]/10 text-[#0078d4] dark:text-[#2899f5] rounded-full w-fit mb-4 border border-[#0078d4]/10">
          <Camera className="h-3.5 w-3.5" />
          <span className="text-[10px] font-black uppercase tracking-wider">Trưng bày tác phẩm</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#323130] dark:text-[#ffffff] tracking-tight flex items-center gap-3 font-sans">
          Tác phẩm <span className="text-[#0078d4] dark:text-[#2899f5]">Tiêu biểu</span>
        </h1>
        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
          Một tập hợp các khoảnh khắc được chụp qua lăng kính cơ học, nhấn mạnh vào vẻ đẹp của ánh sáng, bóng tối và sự tĩnh mịch.
        </p>
      </div>

      {/* Masonry Grid with gorgeous hover and shadow */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 my-10">
        {photos.map((photo, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.6, delay: (idx % 4) * 0.08 }}
            className="break-inside-avoid overflow-hidden rounded-lg border border-[#edebe9] dark:border-[#484644] bg-white dark:bg-[#292827] p-2.5 shadow-sm hover:border-[#0078d4] dark:hover:border-[#2899f5] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group cursor-zoom-in"
            onClick={() => setSelectedIndex(idx)}
          >
            <div className="relative overflow-hidden rounded-md">
              <FadeImage
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-102"
              />
              
              {/* Image zoom effect and action indicator */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-[#0078d4]/80 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Eye className="h-5 w-5" />
                </div>
              </div>

              {/* Tag location indicator */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold bg-slate-950/80 text-slate-200 rounded-lg backdrop-blur-xs select-none shadow-sm">
                <MapPin className="h-3 w-3 text-[#2899f5] fill-current" />
                <span>{photo.caption}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Lightbox 
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        src={selectedIndex !== null ? photos[selectedIndex].src : ""}
        alt={selectedIndex !== null ? photos[selectedIndex].alt : ""}
        caption={selectedIndex !== null ? photos[selectedIndex].caption : ""}
      />
    </div>
  );
}
