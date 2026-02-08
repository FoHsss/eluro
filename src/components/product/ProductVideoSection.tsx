import { motion } from "framer-motion";

interface ProductVideoSectionProps {
  videoUrl?: string;
}

/**
 * Displays a video section on the product page.
 * Expects a video URL from Shopify gallery (altText contains "video").
 * Supports MP4, WebM, and GIF files.
 */
export const ProductVideoSection = ({ videoUrl }: ProductVideoSectionProps) => {
  if (!videoUrl) return null;

  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(videoUrl);
  const isGif = /\.gif(\?|$)/i.test(videoUrl);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="rounded-2xl overflow-hidden bg-muted/20 border border-border">
        {isVideo ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto"
          />
        ) : isGif ? (
          <img
            src={videoUrl}
            alt="Product video"
            className="w-full h-auto"
          />
        ) : (
          // Fallback for other formats - treat as video
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto"
          />
        )}
      </div>
    </motion.section>
  );
};
