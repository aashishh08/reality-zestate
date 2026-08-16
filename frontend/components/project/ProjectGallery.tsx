"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, ChevronUp, ChevronDown } from "lucide-react";
import { useLiteMotion, viewRevealProps } from "@/lib/motion-prefs";

interface ProjectGalleryProps {
  images: string[];
  videoUrl?: string;
}

function thumbnailLabel(itemType: string, index: number, hasVideo: boolean): string {
  if (itemType === "video") return "View project video";
  const imageNumber = hasVideo ? index : index + 1;
  return `View project image ${imageNumber}`;
}

export function ProjectGallery({ images, videoUrl }: ProjectGalleryProps) {
  const liteMotion = useLiteMotion();
  const safeImages = Array.isArray(images) ? images : [];

  const totalItems = (videoUrl ? 1 : 0) + safeImages.length;

  if (totalItems === 0) return null;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbnailScroll, setThumbnailScroll] = useState(0);

  const isVideo = videoUrl && selectedIndex === 0;
  const currentImage = isVideo ? null : safeImages[videoUrl ? selectedIndex - 1 : selectedIndex];

  const maxVisibleThumbnails = 4;
  const totalThumbnails = totalItems;
  const canScroll = totalThumbnails > maxVisibleThumbnails;

  const scrollThumbnails = (direction: "up" | "down") => {
    if (direction === "up") {
      setThumbnailScroll((prev) => Math.max(0, prev - 1));
    } else {
      setThumbnailScroll((prev) =>
        Math.min(totalThumbnails - maxVisibleThumbnails, prev + 1),
      );
    }
  };

  const thumbnailItems = [
    ...(videoUrl ? [{ type: "video", src: undefined }] : []),
    ...safeImages.map((img) => ({ type: "image", src: img })),
  ];

  const mainReveal = viewRevealProps(liteMotion);
  const thumbReveal = viewRevealProps(liteMotion, 0.1);

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Mobile — horizontal scroll gallery */}
      <div className="lg:hidden">
        <div
          className="-mx-4 sm:-mx-6 flex gap-3 overflow-x-auto overscroll-x-contain pl-4 pr-6 sm:pl-6 sm:pr-8 pb-2 snap-x snap-mandatory no-scrollbar [-webkit-overflow-scrolling:touch]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          role="list"
          aria-label="Project gallery"
        >
          {thumbnailItems.map((item, index) => (
            <div
              key={index}
              role="listitem"
              className="relative shrink-0 snap-center w-[85vw] max-w-[360px] aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-zinc-900"
            >
              {item.type === "video" ? (
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Project video tour"
                  loading="lazy"
                />
              ) : (
                <Image
                  src={item.src!}
                  alt={`Project view ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 85vw, 360px"
                  loading={index <= 1 ? "eager" : "lazy"}
                />
              )}
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                {index + 1} / {totalItems}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop — main image + thumbnail sidebar */}
      <div className="hidden lg:grid grid-cols-[1fr_280px] gap-8 min-w-0">
        <motion.div
          className="relative aspect-[4/3] lg:h-[500px] lg:aspect-auto rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 group min-w-0"
          {...mainReveal}
        >
          <AnimatePresence mode="wait">
            {isVideo ? (
              <motion.div
                key="video"
                initial={liteMotion ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={liteMotion ? { opacity: 0 } : undefined}
                transition={{ duration: liteMotion ? 0.35 : 0 }}
                className="relative w-full h-full"
              >
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Project video tour"
                  loading="lazy"
                />
              </motion.div>
            ) : (
              <motion.div
                key={`image-${selectedIndex}`}
                initial={liteMotion ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={liteMotion ? { opacity: 0 } : undefined}
                transition={{ duration: liteMotion ? 0.35 : 0 }}
                className="relative w-full h-full"
              >
                <Image
                  src={currentImage!}
                  alt={`Project view ${selectedIndex + 1}`}
                  fill
                  className="object-cover"
                  priority={selectedIndex === (videoUrl ? 1 : 0)}
                  sizes="(max-width: 1280px) 70vw, 900px"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {selectedIndex + 1} / {totalItems}
          </div>

          <button
            type="button"
            aria-label="Previous gallery item"
            onClick={() => setSelectedIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1))}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hidden lg:flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next gallery item"
            onClick={() => setSelectedIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1))}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hidden lg:flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        <motion.div
          className="flex flex-col gap-2 h-auto lg:h-[500px] min-w-0"
          {...thumbReveal}
        >
          {canScroll && thumbnailScroll > 0 && (
            <button
              type="button"
              aria-label="Scroll thumbnails up"
              onClick={() => scrollThumbnails("up")}
              className="w-full bg-white/80 hover:bg-white p-1.5 rounded-lg transition-all shadow-sm flex items-center justify-center text-black flex-shrink-0"
            >
              <ChevronUp className="w-4 h-4" aria-hidden />
            </button>
          )}

          <div className="flex-1 flex flex-col gap-2 overflow-hidden">
            {thumbnailItems.map((item, index) => {
              const isVisible =
                index >= thumbnailScroll && index < thumbnailScroll + maxVisibleThumbnails;

              if (!isVisible) return null;

              const label = thumbnailLabel(item.type, index, Boolean(videoUrl));

              return (
                <motion.button
                  key={index}
                  type="button"
                  aria-label={label}
                  aria-pressed={selectedIndex === index}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative aspect-video rounded-lg overflow-hidden transition-all shadow-md border-2 cursor-pointer group flex-shrink-0 ${selectedIndex === index
                    ? "border-[#C9A961] ring-2 ring-[#C9A961] ring-offset-1 ring-offset-[#F5F0E8]"
                    : "border-gray-200 hover:border-[#C9A961]/50"
                    }`}
                  whileHover={liteMotion ? { scale: 1.05 } : undefined}
                  whileTap={liteMotion ? { scale: 0.95 } : undefined}
                  initial={liteMotion ? { opacity: 0, scale: 0.9 } : false}
                  animate={liteMotion ? { opacity: 1, scale: 1 } : undefined}
                  transition={{ duration: liteMotion ? 0.3 : 0 }}
                >
                  {item.type === "video" ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2C2416] to-[#3D3021]">
                      <Play className="w-4 h-4 text-white" fill="white" aria-hidden />
                    </div>
                  ) : (
                    <Image
                      src={item.src!}
                      alt=""
                      aria-hidden
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="280px"
                      loading="lazy"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                  <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all">
                    {item.type === "video" ? "Video" : `${index + (videoUrl ? 0 : 1)}`}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {canScroll && thumbnailScroll < totalThumbnails - maxVisibleThumbnails && (
            <button
              type="button"
              aria-label="Scroll thumbnails down"
              onClick={() => scrollThumbnails("down")}
              className="w-full bg-white/80 hover:bg-white p-1.5 rounded-lg transition-all shadow-sm flex items-center justify-center text-black flex-shrink-0"
            >
              <ChevronDown className="w-4 h-4" aria-hidden />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
