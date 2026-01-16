import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarRating } from "./StarRating";
import { useProductReviews, useReviewStats, useAddReview } from "@/hooks/useProductReviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const reviewSchema = z.object({
  author_name: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя не должно превышать 100 символов"),
  rating: z.number().min(1, "Пожалуйста, выберите рейтинг").max(5),
  comment: z
    .string()
    .min(10, "Отзыв должен содержать минимум 10 символов")
    .max(1000, "Отзыв не должен превышать 1000 символов"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewsSectionProps {
  productHandle: string;
}

export const ReviewsSection = ({ productHandle }: ReviewsSectionProps) => {
  const { data: reviews, isLoading } = useProductReviews(productHandle);
  const { averageRating, totalCount } = useReviewStats(reviews);
  const { mutate: addReview, isPending: isSubmitting } = useAddReview();
  const [showForm, setShowForm] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author_name: "",
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    addReview(
      {
        product_handle: productHandle,
        author_name: data.author_name,
        rating: data.rating,
        comment: data.comment,
      },
      {
        onSuccess: () => {
          form.reset();
          setShowForm(false);
        },
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
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
          <h2 className="text-lg font-medium text-foreground mb-1">Отзывы</h2>
          {totalCount > 0 ? (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(averageRating)} size="sm" />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} из 5 ({totalCount}{" "}
                {totalCount === 1 ? "отзыв" : totalCount < 5 ? "отзыва" : "отзывов"})
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Пока нет отзывов</p>
          )}
        </div>
        
        {!showForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="shrink-0"
          >
            Написать отзыв
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 p-6 bg-muted/30 rounded-2xl border border-border"
        >
          <h3 className="text-base font-medium mb-4">Оставить отзыв</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="author_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваше имя</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Как вас зовут?" 
                        {...field} 
                        className="bg-background"
                      />
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
                    <FormLabel>Рейтинг</FormLabel>
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
                    <FormLabel>Ваш отзыв</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Расскажите о вашем опыте..."
                        className="min-h-[100px] bg-background resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Отправить
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    form.reset();
                    setShowForm(false);
                  }}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review, index) => (
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
                      {review.author_name}
                    </span>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(review.created_at)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-[52px]">
                {review.comment}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Будьте первым, кто оставит отзыв!
            </p>
            <Button variant="outline" onClick={() => setShowForm(true)}>
              Написать отзыв
            </Button>
          </div>
        )
      )}
    </motion.section>
  );
};
