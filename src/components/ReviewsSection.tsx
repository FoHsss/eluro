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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
const reviewSchema = z.object({
  author_name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(100, "Имя не должно превышать 100 символов"),
  rating: z.number().min(1, "Пожалуйста, выберите рейтинг").max(5),
  comment: z.string().min(10, "Отзыв должен содержать минимум 10 символов").max(1000, "Отзыв не должен превышать 1000 символов")
});
type ReviewFormData = z.infer<typeof reviewSchema>;
interface ReviewsSectionProps {
  productHandle: string;
}
export const ReviewsSection = ({
  productHandle
}: ReviewsSectionProps) => {
  const {
    data: reviews,
    isLoading
  } = useProductReviews(productHandle);
  const {
    averageRating,
    totalCount
  } = useReviewStats(reviews);
  const {
    mutate: addReview,
    isPending: isSubmitting
  } = useAddReview();
  const [showForm, setShowForm] = useState(false);
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
      }
    });
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  return;
};