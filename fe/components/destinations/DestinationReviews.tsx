"use client";

import { useState } from "react";
import { MessageSquare, Star, Send } from "lucide-react";
import type { Review } from "@/lib/types/review";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

interface DestinationReviewsProps {
  reviews: Review[];
  onSubmitReview: (name: string, rating: number, content: string) => Promise<void>;
}

export function DestinationReviews({ reviews, onSubmitReview }: DestinationReviewsProps) {
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;

    setSubmittingReview(true);
    try {
      await onSubmitReview(
        reviewerName.trim() || "Khách ẩn danh",
        reviewRating,
        reviewContent.trim()
      );

      // Reset states
      setReviewerName("");
      setReviewRating(5);
      setReviewContent("");
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return "K";
    const parts = cleanName.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase();
  };

  // Generate a beautiful gradient background for avatar based on name hash
  const getAvatarBg = (name: string) => {
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-orange-500 to-amber-600",
      "from-rose-500 to-pink-600",
      "from-purple-500 to-violet-600",
      "from-cyan-500 to-sky-600",
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  return (
    <div className="bg-brand-surface-lowest rounded-brand-card p-6 md:p-8 border border-brand-outline-variant/30 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-brand-primary border-b border-brand-outline-variant/20 pb-3 flex items-center gap-2">
        <MessageSquare className="size-5 text-brand-primary" /> Cộng đồng đánh giá
      </h2>

      {/* Review Form */}
      <form onSubmit={handleReviewSubmit} className="bg-brand-surface-low/30 rounded-2xl p-5 border border-brand-outline-variant/20 space-y-4">
        <h3 className="text-sm font-bold text-slate-700">Chia sẻ trải nghiệm thực tế của bạn</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Nhập tên của bạn..."
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              required
              className="h-9 focus:border-brand-primary focus:ring-brand-primary/10"
            />
          </div>

          {/* Rating selector (clickable stars) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Đánh giá của bạn <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-1.5 h-9">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-slate-300 hover:scale-115 transition-transform focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`size-6 ${
                      star <= (hoverRating || reviewRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-slate-500 ml-2 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                {reviewRating} / 5
              </span>
            </div>
          </div>
        </div>

        {/* Review text */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Nội dung đánh giá <span className="text-rose-500">*</span>
          </label>
          <textarea
            placeholder="Hãy viết cảm nhận thực tế của bạn về địa điểm này..."
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            required
            rows={3}
            className="w-full text-sm text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition bg-white"
          ></textarea>
        </div>

        {/* Submission Info */}
        <div className="flex justify-between items-center pt-2">
          <div>
            {reviewSuccess && (
              <span className="text-xs font-semibold text-emerald-600 animate-pulse bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1">
                ✓ Đánh giá đã được gửi thành công!
              </span>
            )}
          </div>
          <Button
            type="submit"
            disabled={submittingReview}
            className="px-5 text-xs h-9 flex items-center gap-1.5"
          >
            {submittingReview ? (
              <>Gửi...</>
            ) : (
              <>
                Gửi đánh giá <Send className="size-3" />
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Reviews List */}
      <div className="space-y-4 pt-2">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            Địa điểm chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận!
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.review_id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0 flex gap-4 items-start hover:bg-slate-50/40 p-2.5 rounded-xl transition-all">
              {/* User Avatar Initials */}
              <div className={`size-10 rounded-full bg-gradient-to-br ${getAvatarBg(rev.user_name)} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-black/5`}>
                {getInitials(rev.user_name)}
              </div>

              {/* Review Card */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-sm text-slate-800">{rev.user_name}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`size-3 ${
                              s <= rev.score ? "fill-amber-400 text-amber-400" : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(rev.created_at).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                  {rev.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
