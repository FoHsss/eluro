import { useState } from "react";
import { motion } from "framer-motion";
import { User, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAddReview } from "@/hooks/useProductReviews";
import { toast } from "sonner";

interface StaticReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

// Reviews mapped by product handle - each product has its own unique reviews
const reviewsByProduct: Record<string, StaticReview[]> = {
  // AirTag Collar reviews
  'airtag-leather-collar': [
    {
      id: "col-1",
      author: "Emma T.",
      rating: 5,
      comment: "Exactly what I was looking for. The leather feels quality, and my cat wears it comfortably all day.",
      date: "February 1, 2026"
    },
    {
      id: "col-2",
      author: "Marcus L.",
      rating: 5,
      comment: "The AirTag fits perfectly and stays secure. Nice design that matches our home aesthetic.",
      date: "January 18, 2026"
    },
    {
      id: "col-3",
      author: "Sophie R.",
      rating: 4,
      comment: "Good craftsmanship. Took a few days for my dog to get used to it, but now he doesn't notice it.",
      date: "December 5, 2025"
    },
    {
      id: "col-4",
      author: "James K.",
      rating: 5,
      comment: "Simple, well-made, and gives me peace of mind when we're at the park.",
      date: "November 22, 2025"
    }
  ],
  // Dog Collar and Leash Set reviews
  'airtag-dog-collar-and-leash-for-medium-and-large-dogs': [
    {
      id: "set-1",
      author: "David M.",
      rating: 5,
      comment: "Perfect set for our German Shepherd. The leather is thick and durable, and the AirTag holder is genius.",
      date: "January 28, 2026"
    },
    {
      id: "set-2",
      author: "Lisa W.",
      rating: 5,
      comment: "Love that it comes as a matching set. The quality exceeded my expectations for this price.",
      date: "January 10, 2026"
    },
    {
      id: "set-3",
      author: "Michael R.",
      rating: 4,
      comment: "Great product overall. The leash handle is comfortable for long walks. Only wish it came in more colors.",
      date: "December 15, 2025"
    }
  ],
  // Other products will show empty state with form to write reviews
};

const reviewSchema = z.object({
  author_name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Review must be at least 10 characters").max(1000, "Review is too long")
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface StaticReviewsSectionProps {
  productHandle?: string;
}

export const StaticReviewsSection = ({ productHandle = "default" }: StaticReviewsSectionProps) => {
  // Get reviews specific to this product, or empty array for new products
  const productReviews = reviewsByProduct[productHandle] || [];
  const hasReviews = productReviews.length > 0;
  
  const averageRating = hasReviews 
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
    : 0;
  
  const [showForm, setShowForm] = useState(false);
  const { mutate: addReview, isPending: isSubmitting } = useAddReview();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author_name: "",
      rating: 0,
      comment: ""
    }
  });

  const onSubmit = (data: ReviewFormData) => {
    addReview({
      product_handle: productHandle,
      author_name: data.author_name,
      rating: data.rating,
      comment: data.comment
    }, {
      onSuccess: () => {
        form.reset();
        setShowForm(false);
        toast.success("Thank you for your review!", {
          description: "Your review will be visible after moderation."
        });
      }
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="py-10 border-t border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-medium text-foreground mb-1">
            Customer Reviews
          </h2>
          {hasReviews ? (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(averageRating)} size="sm" />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} out of 5 ({productReviews.length} reviews)
              </span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              No reviews yet
            </span>
          )}
        </div>
        
        {!showForm && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowForm(true)}
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 p-4 bg-muted/30 rounded-xl border border-border"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="author_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="What's your name?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <StarRating 
                        rating={field.value} 
                        interactive 
                        onRatingChange={field.onChange}
                        size="lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your experience with this product..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => {
                    setShowForm(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      )}

      {/* Reviews List or Empty State */}
      {hasReviews ? (
        <div className="space-y-4">
          {productReviews.map((review, index) => (
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
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">
                        {review.author}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
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
      ) : (
        <div className="text-center py-8 bg-muted/10 rounded-xl border border-border/30">
          <p className="text-muted-foreground mb-2">
            No reviews yet. Be the first to share your experience!
          </p>
          {!showForm && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowForm(true)}
            >
              Write a Review
            </Button>
          )}
        </div>
      )}
    </motion.section>
  );
};
