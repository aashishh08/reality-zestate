"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play } from "lucide-react";

interface ProjectGalleryProps {
  images: string[];
  videoUrl?: string;
}

export function ProjectGallery({ images, videoUrl }: ProjectGalleryProps) {
  // Combine video and images - video comes first if it exists
  const totalItems = (videoUrl ? 1 : 0) + images.length;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isVideo = videoUrl && selectedIndex === 0;
  const currentImage = isVideo ? null : images[videoUrl ? selectedIndex - 1 : selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <motion.div
        className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl bg-black"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {isVideo ? (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full"
            >
              <iframe
                src={videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          ) : (
            <motion.div
              key={`image-${selectedIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full"
            >
              <Image
                src={currentImage!}
                alt={`Project view ${selectedIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Navigation Arrows */}
        <button
          onClick={() => setSelectedIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setSelectedIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </motion.div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Video Thumbnail (if exists) */}
        {videoUrl && (
          <motion.button
            onClick={() => setSelectedIndex(0)}
            className={`relative aspect-video rounded-lg overflow-hidden transition-all bg-black ${
              selectedIndex === 0
                ? "ring-4 ring-[#C9A961] scale-105"
                : "hover:scale-105 opacity-70 hover:opacity-100"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2C2416] to-[#3D3021]">
              <Play className="w-8 h-8 text-white" fill="white" />
            </div>
            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
              Video
            </div>
          </motion.button>
        )}

        {/* Image Thumbnails */}
        {images.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedIndex(videoUrl ? index + 1 : index)}
            className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
              selectedIndex === (videoUrl ? index + 1 : index)
                ? "ring-4 ring-[#C9A961] scale-105"
                : "hover:scale-105 opacity-70 hover:opacity-100"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
