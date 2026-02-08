import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewPhotoGalleryProps {
  photos: string[];
}

export const ReviewPhotoGallery = ({ photos }: ReviewPhotoGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Thumbnails */}
      <div className="flex gap-2 mt-3 pl-[52px]">
        {photos.map((url, index) => (
          <button
            key={url}
            onClick={() => openLightbox(index)}
            className="w-14 h-14 rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors"
          >
            <img
              src={url}
              alt={`Review photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-white z-10 p-2"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation arrows */}
            {photos.length > 1 && (
              <>
                <button
                  className="absolute left-4 text-white/60 hover:text-white p-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) =>
                      prev === 0 ? photos.length - 1 : prev - 1
                    );
                  }}
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>
                <button
                  className="absolute right-4 text-white/60 hover:text-white p-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) =>
                      prev === photos.length - 1 ? 0 : prev + 1
                    );
                  }}
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={photos[lightboxIndex]}
              alt={`Review photo ${lightboxIndex + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Dot indicators */}
            {photos.length > 1 && (
              <div className="absolute bottom-6 flex gap-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === lightboxIndex
                        ? "bg-white w-6"
                        : "bg-white/40 w-2 hover:bg-white/60"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(index);
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
