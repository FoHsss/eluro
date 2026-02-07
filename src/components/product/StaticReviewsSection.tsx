import { motion } from "framer-motion";
import { User } from "lucide-react";
import { StarRating } from "@/components/StarRating";

interface StaticReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
}

const staticReviews: StaticReview[] = [
  {
    id: "1",
    author: "Emma T.",
    rating: 5,
    comment: "Exactly what I was looking for. The leather feels quality, and my cat wears it comfortably all day."
  },
  {
    id: "2",
    author: "Marcus L.",
    rating: 5,
    comment: "The AirTag fits perfectly and stays secure. Nice design that matches our home aesthetic."
  },
  {
    id: "3",
    author: "Sophie R.",
    rating: 4,
    comment: "Good craftsmanship. Took a few days for my dog to get used to it, but now he doesn't notice it."
  },
  {
    id: "4",
    author: "James K.",
    rating: 5,
    comment: "Simple, well-made, and gives me peace of mind when we're at the park."
  }
];

export const StaticReviewsSection = () => {
  const averageRating = staticReviews.reduce((sum, r) => sum + r.rating, 0) / staticReviews.length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="py-10 border-t border-border"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-1">
          Customer Reviews
        </h2>
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(averageRating)} size="sm" />
          <span className="text-sm text-muted-foreground">
            {averageRating.toFixed(1)} out of 5 ({staticReviews.length} reviews)
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {staticReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-5 bg-muted/20 rounded-xl border border-border/50"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-foreground truncate">
                    {review.author}
                  </span>
                  <StarRating rating={review.rating} size="sm" />
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-[52px]">
              {review.comment}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
