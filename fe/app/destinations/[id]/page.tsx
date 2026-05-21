"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserLayout } from "@/components/layout/UserLayout";
import { Button } from "@/components/common/Button";
import {
  getDestinationById,
  getReviewsWithLocal,
  addReview,
  getWeather,
  getTraffic,
} from "@/lib/api";
import { TouristDestination, Review, WeatherInfo, TrafficInfo } from "@/lib/mockData";
import {
  Star,
  ArrowLeft,
  AlertTriangle,
  Info,
} from "lucide-react";
import { DestinationInfoPanel } from "@/components/destinations/DestinationInfoPanel";
import { DestinationWeatherWidget } from "@/components/destinations/DestinationWeatherWidget";
import { DestinationTrafficWidget } from "@/components/destinations/DestinationTrafficWidget";
import { DestinationVideoTour } from "@/components/destinations/DestinationVideoTour";
import { DestinationReviews } from "@/components/destinations/DestinationReviews";

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [destination, setDestination] = useState<TouristDestination | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [traffic, setTraffic] = useState<TrafficInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const destData = await getDestinationById(id);
      if (!destData) {
        setError("Không tìm thấy địa điểm này.");
        setLoading(false);
        return;
      }
      setDestination(destData);

      // Parallel fetching for weather, traffic and reviews
      const [reviewsData, weatherData, trafficData] = await Promise.all([
        getReviewsWithLocal(id),
        getWeather(id),
        getTraffic(id),
      ]);

      setReviews(reviewsData);
      setWeather(weatherData);
      setTraffic(trafficData);
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tải thông tin địa điểm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReviewSubmit = async (userName: string, rating: number, content: string) => {
    await addReview(id, {
      user_name: userName,
      content: content,
      score: rating,
    });

    // Refetch reviews and destination details (to update average rating)
    const [updatedDest, updatedReviews] = await Promise.all([
      getDestinationById(id),
      getReviewsWithLocal(id),
    ]);

    if (updatedDest) setDestination(updatedDest);
    setReviews(updatedReviews);
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen bg-brand-background py-8 animate-pulse">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-[350px] w-full bg-slate-200 rounded-3xl animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 w-1/3 bg-slate-200 rounded" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-slate-200 rounded-2xl" />
                <div className="h-32 bg-slate-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error || !destination) {
    return (
      <UserLayout>
        <div className="min-h-screen bg-brand-background py-16 flex items-center justify-center">
          <div className="bg-white p-8 rounded-brand-card shadow-sm border border-brand-outline-variant/30 text-center max-w-md w-full">
            <div className="size-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="size-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Không tìm thấy địa điểm</h3>
            <p className="mt-2 text-sm text-slate-500">
              {error || "Địa điểm bạn tìm kiếm không tồn tại hoặc đã bị gỡ bỏ."}
            </p>
            <Button
              onClick={() => router.push("/destinations")}
              className="mt-6 w-full"
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <main className="min-h-screen bg-brand-background py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <button
            onClick={() => router.push("/destinations")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-primary mb-6 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại danh sách điểm đến
          </button>

          {/* Banner cover card */}
          <div className="relative h-[250px] md:h-[400px] w-full rounded-brand-card overflow-hidden shadow-md border border-brand-outline-variant/20 mb-8 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={destination.image_url}
              alt={destination.name}
              className="object-cover w-full h-full"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8" />

            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 text-white flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-brand-secondary text-white">
                    {destination.province_id}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-brand-primary text-white border border-brand-primary-container">
                    {destination.category_id}
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
                  {destination.name}
                </h1>
              </div>

              {/* Rating block */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 self-start md:self-auto border border-white/20">
                <Star className="size-5 fill-amber-400 text-amber-400" />
                <span className="text-xl font-bold text-white">{destination.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-300 font-semibold">({reviews.length} đánh giá)</span>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Details & Video & Reviews) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Introduction Card */}
              <div className="bg-brand-surface-lowest rounded-brand-card p-6 md:p-8 border border-brand-outline-variant/30 shadow-sm">
                <h2 className="text-xl font-bold text-brand-primary border-b border-brand-outline-variant/20 pb-3 flex items-center gap-2">
                  <Info className="size-5 text-brand-primary" /> Giới thiệu chung
                </h2>
                <p className="mt-4 text-slate-700 leading-relaxed text-xs md:text-sm font-medium whitespace-pre-line">
                  {destination.description}
                </p>
              </div>

              {/* Video Tour Component */}
              {destination.video_url && (
                <DestinationVideoTour
                  videoUrl={destination.video_url}
                  destinationName={destination.name}
                />
              )}

              {/* Reviews Component */}
              <DestinationReviews
                reviews={reviews}
                onSubmitReview={handleReviewSubmit}
              />
            </div>

            {/* Right Column (Info List, Weather, Traffic) */}
            <div className="space-y-8">
              {/* Core Information Panel */}
              <DestinationInfoPanel destination={destination} />

              {/* Local Weather Card */}
              {weather && <DestinationWeatherWidget weather={weather} />}

              {/* Local Traffic Card */}
              {traffic && <DestinationTrafficWidget traffic={traffic} />}
            </div>
          </div>
        </div>
      </main>
    </UserLayout>
  );
}
