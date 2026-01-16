import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Review {
  id: string;
  product_handle: string;
  author_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface NewReview {
  product_handle: string;
  author_name: string;
  rating: number;
  comment: string;
}

export const useProductReviews = (productHandle: string) => {
  return useQuery({
    queryKey: ["reviews", productHandle],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_handle", productHandle)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!productHandle,
  });
};

export const useReviewStats = (reviews: Review[] | undefined) => {
  if (!reviews || reviews.length === 0) {
    return { averageRating: 0, totalCount: 0 };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalCount: reviews.length,
  };
};

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newReview: NewReview) => {
      // is_approved defaults to false via RLS policy - reviews require moderation
      const { data, error } = await supabase
        .from("reviews")
        .insert([{ ...newReview, is_approved: false }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.product_handle],
      });
      toast.success("Спасибо за отзыв!", {
        description: "Ваш отзыв отправлен на модерацию и скоро появится.",
      });
    },
    onError: (error) => {
      console.error("Error adding review:", error);
      toast.error("Ошибка", {
        description: "Не удалось добавить отзыв. Попробуйте ещё раз.",
      });
    },
  });
};
