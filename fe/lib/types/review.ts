export type Review = {
  review_id: string;
  user_name: string;
  destination_id: string;
  content: string;
  score: number;
  created_at: string;
  status?: "pending" | "published" | "hidden";
};

export type ReviewSummary = {
  averageScore: number | null;
  distribution: Array<{
    score: number;
    count: number;
  }>;
  totalReviews: number;
};

export type ReviewSort = "highest" | "latest" | "lowest" | "relevant";
