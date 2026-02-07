import { motion } from "framer-motion";
import { useState } from "react";
import { Play } from "lucide-react";

interface ProductVideoProps {
  src?: string;
  poster?: string;
}

export const ProductVideo = ({ src, poster }: ProductVideoProps) => {
  const [hasError, setHasError] = useState(false);

  // Determine media type
  const isGif = src?.toLowerCase().includes('.gif');
  const isVideo = src?.toLowerCase().match(/\.(mp4|webm|mov)$/);

  // If no source provided, show placeholder
  if (!src || hasError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="mb-8 rounded-2xl overflow-hidden bg-secondary border border-border/50 aspect-video flex items-center justify-center"
      >
        <div className="text-center text-muted-foreground">
          <Play className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Video coming soon</p>
        </div>
      </motion.div>
    );
  }

  // For GIF or other images - render as img tag
  if (isGif || !isVideo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="mb-8 rounded-2xl overflow-hidden bg-secondary border border-border/50 shadow-lg"
      >
        <img 
          src={src} 
          alt="Product demo" 
          className="w-full object-cover"
          onError={() => setHasError(true)}
        />
      </motion.div>
    );
  }

  // For video files
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mb-8 rounded-2xl overflow-hidden bg-secondary border border-border/50 shadow-lg"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        onError={() => setHasError(true)}
        className="w-full aspect-video object-cover"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </motion.div>
  );
};
