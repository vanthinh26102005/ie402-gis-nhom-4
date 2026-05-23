import { DestinationList } from "@/components/destinations/DestinationList";
import { UserLayout } from "@/components/layout/UserLayout";

export default function DestinationsPage() {
  return (
    <Suspense
      fallback={
        <UserLayout>
          <main className="min-h-screen bg-brand-background py-8 flex items-center justify-center">
            <div className="text-center font-bold text-slate-500">
              <RefreshCw className="size-8 text-brand-primary animate-spin mx-auto mb-2" />
              Đang tải danh sách điểm đến...
            </div>
          </main>
        </UserLayout>
      }
    >
      <DestinationsContent />
    </Suspense>
  );
}

function DestinationsContent() {
  const searchParams = useSearchParams();
  const initialProvince = searchParams.get("province") || "";

  const [keyword, setKeyword] = useState("");
  const [province, setProvince] = useState(initialProvince);
  const [category, setCategory] = useState("");

  const [destinations, setDestinations] = useState<TouristDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync initialProvince if query changes
  useEffect(() => {
    if (initialProvince !== undefined) {
      setProvince(initialProvince);
    }
  }, [initialProvince]);

  // Fetch function
  const fetchDestinations = async (filters?: {
    keyword?: string;
    province?: string;
    category?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDestinations(filters);
      setDestinations(data);
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial on mount and filter changes
  useEffect(() => {
    fetchDestinations({ keyword, province, category });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province, category]); // instant updates on select filter changes

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDestinations({ keyword, province, category });
  };

  const handleReset = () => {
    setKeyword("");
    setProvince("");
    setCategory("");
    fetchDestinations({ keyword: "", province: "", category: "" });
  };

  return (
    <UserLayout>
      <main className="min-h-screen bg-brand-background py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header section */}
          <div className="text-center md:text-left mb-8 relative">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
              Bản đồ & Du lịch
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-primary tracking-tight">
              Khám phá Điểm đến Miền Trung
            </h1>
            <div className="mt-2 h-1 w-20 bg-brand-secondary rounded-full md:mx-0 mx-auto" />
            <p className="mt-3 text-slate-600 max-w-2xl text-xs md:text-sm font-medium leading-relaxed">
              Tìm kiếm và lựa chọn các di tích lịch sử, danh lam thắng cảnh, bãi
              biển tuyệt đẹp và khu vui chơi giải trí hàng đầu tại Quảng Trị,
              Huế và Đà Nẵng.
            </p>

            {/* Quick Actions / Link Cards shortcut */}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-xl text-xs font-bold border-brand-primary/20 text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 transition-all cursor-pointer"
              >
                <Link href="/route">
                  <Navigation className="size-3.5 mr-1.5 text-brand-primary" />{" "}
                  Lập lộ trình đi
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-xl text-xs font-bold border-brand-secondary/20 text-brand-secondary bg-brand-secondary/5 hover:bg-brand-secondary/10 transition-all cursor-pointer"
              >
                <Link href="/weather-traffic">
                  <CloudSun className="size-3.5 mr-1.5 text-brand-secondary" />{" "}
                  Thời tiết & Giao thông
                </Link>
              </Button>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <DestinationFilterBar
            keyword={keyword}
            setKeyword={setKeyword}
            province={province}
            setProvince={setProvince}
            category={category}
            setCategory={setCategory}
            onSubmit={handleSearchSubmit}
            onReset={handleReset}
          />

          {/* Error state */}
          {error && (
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-rose-100 rounded-brand-card p-8 text-center max-w-lg mx-auto shadow-sm">
              <AlertCircle className="size-12 text-rose-500 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-slate-800">
                Đã xảy ra lỗi
              </h3>
              <p className="mt-2 text-sm text-slate-500">{error}</p>
              <Button
                onClick={() =>
                  fetchDestinations({ keyword, province, category })
                }
                className="mt-6"
              >
                <RefreshCw className="size-4 mr-2" /> Thử lại
              </Button>
            </div>
          )}

          {/* Loading state */}
          {!error && loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex flex-col h-[400px] bg-white border border-brand-outline-variant/20 rounded-brand-card overflow-hidden animate-pulse shadow-sm"
                >
                  <div className="h-48 w-full bg-slate-200" />
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
                      <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                      <div className="h-4 bg-slate-200 rounded w-5/6" />
                    </div>
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                      <div className="h-3 bg-slate-200 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!error && !loading && destinations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-brand-surface-lowest border border-brand-outline-variant/30 rounded-brand-card p-8 text-center max-w-md mx-auto shadow-sm">
              <Compass className="size-16 text-brand-primary/30 mb-4 animate-spin-slow" />
              <h3 className="text-lg font-bold text-slate-800">
                Không tìm thấy điểm đến
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc
                tỉnh thành, loại hình du lịch.
              </p>
              <Button onClick={handleReset} className="mt-6">
                Hiển thị tất cả
              </Button>
            </div>
          )}

          {/* Results Grid */}
          {!error && !loading && destinations.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs md:text-sm text-slate-500 font-bold">
                  Tìm thấy{" "}
                  <strong className="text-brand-primary font-extrabold text-sm md:text-base">
                    {destinations.length}
                  </strong>{" "}
                  điểm du lịch phù hợp
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {destinations.map((d) => (
                  <DestinationCard key={d.destination_id} destination={d} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </UserLayout>
  );
}
