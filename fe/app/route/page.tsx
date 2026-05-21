"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UserLayout } from "@/components/layout/UserLayout";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { getDestinations, getRoute } from "@/lib/api";
import { TouristDestination, RouteSummary } from "@/lib/mockData";
import {
  Clock,
  Compass,
  ArrowRightLeft,
  Navigation,
  AlertCircle,
  TrendingUp,
  Milestone,
  Heart,
  AlertTriangle,
  RotateCw,
  Shuffle,
} from "lucide-react";

export default function RoutePage() {
  return (
    <Suspense
      fallback={
        <UserLayout>
          <main className="min-h-screen bg-brand-background py-8 flex items-center justify-center">
            <div className="text-center font-bold text-slate-500">
              <RotateCw className="size-8 text-brand-primary animate-spin mx-auto mb-2" />
              Đang tải trang chỉ đường...
            </div>
          </main>
        </UserLayout>
      }
    >
      <RouteContent />
    </Suspense>
  );
}

function RouteContent() {
  const searchParams = useSearchParams();
  const queryStart = searchParams.get("start") || searchParams.get("startId") || "";
  const queryEnd = searchParams.get("end") || searchParams.get("endId") || "";

  const [destinations, setDestinations] = useState<TouristDestination[]>([]);
  const [startId, setStartId] = useState(queryStart);
  const [endId, setEndId] = useState(queryEnd);

  const [route, setRoute] = useState<RouteSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if query parameters change dynamically
  useEffect(() => {
    if (queryStart) setStartId(queryStart);
    if (queryEnd) setEndId(queryEnd);
  }, [queryStart, queryEnd]);

  // Load all destinations for selection
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const list = await getDestinations();
        setDestinations(list);

        // Auto calculate route if both are provided initially
        if (queryStart && queryEnd && queryStart !== queryEnd) {
          setLoading(true);
          setError(null);
          try {
            const summary = await getRoute(queryStart, queryEnd);
            if (summary) {
              setRoute(summary);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadDestinations();
  }, [queryStart, queryEnd]);

  const handleCalculateRoute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!startId || !endId) {
      setError("Vui lòng chọn đầy đủ Điểm xuất phát và Điểm đến.");
      return;
    }
    if (startId === endId) {
      setError("Điểm xuất phát và Điểm đến không được trùng nhau.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const summary = await getRoute(startId, endId);
      if (summary) {
        setRoute(summary);
      } else {
        setError("Không thể tính toán lộ trình cho hai điểm này.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tìm kiếm lộ trình.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = startId;
    setStartId(endId);
    setEndId(temp);
    // If route was already computed, re-compute for swapped values
    if (route && endId && temp) {
      setLoading(true);
      getRoute(endId, temp)
        .then((summary) => setRoute(summary))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  };

  // Popular route selections to assist users
  const handleQuickRoute = (start: string, end: string) => {
    setStartId(start);
    setEndId(end);
    setLoading(true);
    setError(null);
    getRoute(start, end)
      .then((summary) => {
        setRoute(summary);
      })
      .catch(() => setError("Không thể tính toán lộ trình."))
      .finally(() => setLoading(false));
  };

  return (
    <UserLayout>
      <main className="min-h-screen bg-brand-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl font-extrabold text-brand-primary tracking-tight">
              Định Tuyến & Chỉ Đường Thông Minh
            </h1>
            <p className="mt-2 text-slate-600 max-w-2xl text-sm">
              Chọn điểm đi và điểm đến để mô phỏng lộ trình di chuyển tối ưu nối liền các di tích lịch sử và danh thắng miền Trung Việt Nam.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Form and Route summary */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-brand-surface-lowest rounded-brand-card p-6 border border-brand-outline-variant/30 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-brand-primary flex items-center gap-2">
                  <Navigation className="size-5 text-brand-primary/80" /> Lập lộ trình đi
                </h2>

                <form onSubmit={handleCalculateRoute} className="space-y-4">
                  {/* Start Point */}
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Điểm xuất phát
                    </label>
                    <Select
                      value={startId}
                      onChange={(e) => setStartId(e.target.value)}
                      options={[
                        { label: "-- Chọn điểm xuất phát --", value: "" },
                        ...destinations.map((d) => ({
                          label: `${d.name} (${d.province_id})`,
                          value: d.destination_id,
                        })),
                      ]}
                      className="focus:border-brand-primary"
                    />
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center -my-2">
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-brand-primary transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/10"
                      title="Đảo chiều điểm đi/đến"
                    >
                      <ArrowRightLeft className="size-4 rotate-90 lg:rotate-0" />
                    </button>
                  </div>

                  {/* End Point */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Điểm đến
                    </label>
                    <Select
                      value={endId}
                      onChange={(e) => setEndId(e.target.value)}
                      options={[
                        { label: "-- Chọn điểm đến --", value: "" },
                        ...destinations.map((d) => ({
                          label: `${d.name} (${d.province_id})`,
                          value: d.destination_id,
                        })),
                      ]}
                      className="focus:border-brand-primary"
                    />
                  </div>

                  {/* Error Notification inside Panel */}
                  {error && (
                    <div className="flex gap-2 items-start p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200/50">
                      <AlertCircle className="size-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading || !startId || !endId}
                    className="w-full bg-brand-primary hover:bg-brand-primary-container text-white py-2 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "Đang tính toán..." : "Tìm lộ trình tối ưu"}
                  </Button>
                </form>
              </div>

              {/* Quick Popular Routes Suggestions */}
              <div className="bg-brand-surface-lowest rounded-brand-card p-6 border border-brand-outline-variant/30 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Shuffle className="size-4 text-brand-secondary" /> Lộ trình gợi ý phổ biến
                </h3>

                <div className="space-y-2">
                  <button
                    onClick={() =>
                      handleQuickRoute("dai-noi-hue", "ban-dao-son-tra")
                    }
                    className="w-full text-left text-xs p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-brand-primary/30 transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">Cố đô Huế ➔ Đà Nẵng</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Huế ➔ Chùa Linh Ứng (96.5 km)</p>
                    </div>
                    <Compass className="size-4 text-brand-primary/60" />
                  </button>

                  <button
                    onClick={() =>
                      handleQuickRoute("thanh-co-quang-tri", "dia-dao-vinh-moc")
                    }
                    className="w-full text-left text-xs p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-brand-primary/30 transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">Khám phá Quảng Trị</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Thành Cổ ➔ Địa đạo Vịnh Mốc (37.2 km)</p>
                    </div>
                    <Compass className="size-4 text-brand-primary/60" />
                  </button>

                  <button
                    onClick={() =>
                      handleQuickRoute("ban-dao-son-tra", "ba-na-hills")
                    }
                    className="w-full text-left text-xs p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-brand-primary/30 transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">Nội đô Đà Nẵng ngoại thành</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Sơn Trà ➔ Bà Nà Hills (44.6 km)</p>
                    </div>
                    <Compass className="size-4 text-brand-primary/60" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Route summary steps & SVG simulator */}
            <div className="lg:col-span-2 space-y-6">
              {loading ? (
                <div className="bg-brand-surface-lowest rounded-brand-card p-10 border border-brand-outline-variant/30 shadow-sm text-center flex flex-col justify-center items-center min-h-[450px] animate-pulse">
                  <RotateCw className="size-10 text-brand-primary animate-spin mb-4" />
                  <p className="text-slate-500 text-sm">Đang tính toán khoảng cách và tìm các chặng di chuyển tối ưu...</p>
                </div>
              ) : route ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  {/* Left sub-column: Route steps timeline */}
                  <div className="md:col-span-7 bg-brand-surface-lowest rounded-brand-card p-6 border border-brand-outline-variant/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-brand-primary border-b border-brand-outline-variant/20 pb-3 flex items-center gap-2 mb-4">
                        <Milestone className="size-5 text-brand-primary/80" /> Chi tiết chặng đi
                      </h2>

                      {/* Timeline steps list */}
                      <div className="relative pl-5 border-l-2 border-slate-200 space-y-5 ml-2 mt-4">
                        {route.steps.map((step, idx) => {
                          const isStart = idx === 0;
                          const isEnd = idx === route.steps.length - 1;
                          return (
                            <div key={idx} className="relative">
                              {/* Timeline dot marker */}
                              <span
                                className={`absolute -left-[27px] top-0.5 size-3.5 rounded-full border-2 bg-white flex items-center justify-center ${
                                  isStart
                                    ? "border-emerald-500 scale-125"
                                    : isEnd
                                    ? "border-brand-primary scale-125"
                                    : "border-slate-300"
                                }`}
                              >
                                {(isStart || isEnd) && (
                                  <span
                                    className={`size-1.5 rounded-full ${
                                      isStart ? "bg-emerald-500" : "bg-brand-primary"
                                    }`}
                                  />
                                )}
                              </span>
                              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                                {step}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                      <span>Thuật toán mô phỏng: Dijkstra Core</span>
                      <span>Hỗ trợ định dạng: JSON GPX</span>
                    </div>
                  </div>

                  {/* Right sub-column: SVG Simulated visual map */}
                  <div className="md:col-span-5 bg-brand-surface-lowest rounded-brand-card p-6 border border-brand-outline-variant/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2 mb-4">
                        Bản đồ mô phỏng lộ trình
                      </h3>

                      {/* Interactive SVG route representation */}
                      <div className="relative bg-slate-900 rounded-2xl h-[260px] border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4">
                        {/* Starry/grid background */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-25" />

                        {/* Route drawing SVG */}
                        <svg className="w-full h-full relative z-10" viewBox="0 0 200 200">
                          {/* Animated dash line */}
                          <path
                            d="M 40,160 Q 100,40 160,160"
                            fill="none"
                            stroke="#006a60"
                            strokeWidth="3"
                            strokeDasharray="4 4"
                          />
                          <path
                            d="M 40,160 Q 100,40 160,160"
                            fill="none"
                            stroke="#00355f"
                            strokeWidth="2"
                            className="animate-dash"
                          />

                          {/* Start node */}
                          <circle cx="40" cy="160" r="8" fill="#10b981" />
                          <circle cx="40" cy="160" r="14" fill="#10b981" fillOpacity="0.2" className="animate-ping" style={{ animationDuration: '3s' }} />
                          <text x="40" y="182" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">START</text>

                          {/* End node */}
                          <circle cx="160" cy="160" r="8" fill="#00355f" />
                          <circle cx="160" cy="160" r="14" fill="#00355f" fillOpacity="0.2" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                          <text x="160" y="182" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">END</text>

                          {/* Midpoint highlight (e.g. Pass or landmark) */}
                          <circle cx="100" cy="100" r="5" fill="#f59e0b" />
                          <text x="100" y="90" fill="#f59e0b" fontSize="7" fontWeight="semibold" textAnchor="middle">Trạm Kiểm Soát</text>
                        </svg>

                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[9px] text-slate-300 font-mono z-20">
                          Simulated Coordinate System
                        </div>
                      </div>
                    </div>

                    {/* Stats details grid */}
                    <div className="space-y-3 mt-4 pt-3 border-t border-slate-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Milestone className="size-3.5 text-brand-primary" /> Tổng cự ly:
                        </span>
                        <strong className="text-slate-800 text-sm font-extrabold">{route.total_distance} km</strong>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="size-3.5 text-brand-primary" /> Thời gian đi:
                        </span>
                        <strong className="text-slate-800 text-sm font-extrabold">{route.estimated_duration} phút</strong>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <AlertTriangle className="size-3.5 text-amber-500" /> Lưu lượng tuyến:
                        </span>
                        <span className="text-slate-600 font-semibold text-right max-w-[140px] line-clamp-1">{route.traffic_status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Initial welcome empty board */
                <div className="bg-brand-surface-lowest rounded-brand-card p-10 border border-brand-outline-variant/30 shadow-sm text-center flex flex-col justify-center items-center min-h-[450px]">
                  <Compass className="size-16 text-brand-primary/30 mb-4 animate-spin-slow" />
                  <h3 className="text-lg font-bold text-slate-800">Chưa có thông tin lộ trình</h3>
                  <p className="mt-2 text-sm text-slate-500 max-w-sm">
                    Vui lòng chọn Điểm xuất phát và Điểm kết thúc ở bảng bên trái hoặc chọn nhanh các Lộ trình gợi ý để hiển thị thông số chi tiết hành trình.
                  </p>
                  
                  {/* Showcase details */}
                  <div className="grid grid-cols-3 gap-6 max-w-md mt-10 pt-8 border-t border-slate-100 text-slate-400">
                    <div className="text-center space-y-1">
                      <TrendingUp className="size-6 text-brand-primary/40 mx-auto" />
                      <h4 className="text-[11px] font-bold text-slate-600">Định tuyến tối ưu</h4>
                      <p className="text-[9px] text-slate-400">Tiết kiệm nhiên liệu</p>
                    </div>
                    <div className="text-center space-y-1">
                      <Clock className="size-6 text-brand-primary/40 mx-auto" />
                      <h4 className="text-[11px] font-bold text-slate-600">Giờ chính xác</h4>
                      <p className="text-[9px] text-slate-400">Mô phỏng thời tiết thực</p>
                    </div>
                    <div className="text-center space-y-1">
                      <Heart className="size-6 text-brand-primary/40 mx-auto" />
                      <h4 className="text-[11px] font-bold text-slate-600">Không quảng cáo</h4>
                      <p className="text-[9px] text-slate-400">Dữ liệu an toàn 100%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </UserLayout>
  );
}

