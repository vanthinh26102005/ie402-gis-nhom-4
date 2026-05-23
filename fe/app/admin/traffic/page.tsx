"use client";

import { useState } from "react";
import { Car, RefreshCw, MapPin, AlertTriangle, AlertCircle, CheckCircle, Ban } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { mockTraffic, type TrafficData } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const congestionConfig: Record<TrafficData["congestion_level"], { label: string; icon: typeof CheckCircle; color: string; bgColor: string }> = {
  low: { label: "Thông thoáng", icon: CheckCircle, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  medium: { label: "Ùn ứ nhẹ", icon: AlertCircle, color: "text-amber-600", bgColor: "bg-amber-50" },
  high: { label: "Kẹt xe", icon: AlertTriangle, color: "text-red-600", bgColor: "bg-red-50" },
  blocked: { label: "Đường bị chặn", icon: Ban, color: "text-red-800", bgColor: "bg-red-100" },
};

export default function AdminTrafficPage() {
  const [selectedRoad, setSelectedRoad] = useState("");
  const [formData, setFormData] = useState({
    congestion_level: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const selectedTraffic = mockTraffic.find((t) => t.id === selectedRoad);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    alert("Cập nhật giao thông thành công!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Cập nhật dữ liệu giao thông
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Nhập hoặc đồng bộ tình trạng giao thông theo khu vực.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-950">
              Thông tin giao thông
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="road" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Tuyến đường / Khu vực
                </label>
                <Select
                  id="road"
                  value={selectedRoad}
                  onChange={(e) => setSelectedRoad(e.target.value)}
                  options={[
                    { label: "Chọn tuyến đường", value: "" },
                    ...mockTraffic.map((t) => ({
                      label: t.road_name,
                      value: t.id,
                    })),
                  ]}
                />
              </div>

              <div>
                <label htmlFor="congestion_level" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Mức ùn tắc
                </label>
                <Select
                  id="congestion_level"
                  value={formData.congestion_level}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, congestion_level: e.target.value }))
                  }
                  options={[
                    { label: "Chọn mức ùn tắc", value: "" },
                    { label: "Thông thoáng", value: "low" },
                    { label: "Ùn ứ nhẹ", value: "medium" },
                    { label: "Kẹt xe", value: "high" },
                    { label: "Đường bị chặn", value: "blocked" },
                  ]}
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  id="description"
                  placeholder="Thêm mô tả về tình trạng giao thông..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button type="submit" disabled={loading || !selectedRoad}>
                {loading ? (
                  "Đang cập nhật..."
                ) : (
                  <>
                    <RefreshCw className="mr-2 size-4" aria-hidden="true" />
                    Cập nhật giao thông
                  </>
                )}
              </Button>
            </div>
          </Card>
        </form>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-950">
              Tình trạng hiện tại
            </h2>
            {selectedTraffic ? (
              <div className="space-y-4">
                {(() => {
                  const config = congestionConfig[selectedTraffic.congestion_level];
                  const CongestionIcon = config.icon;
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <div className={cn("rounded-full p-3", config.bgColor)}>
                          <CongestionIcon className={cn("size-6", config.color)} aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {selectedTraffic.road_name}
                          </p>
                          <p className={cn("text-sm font-medium", config.color)}>
                            {config.label}
                          </p>
                        </div>
                      </div>
                      {selectedTraffic.description && (
                        <p className="text-sm text-slate-600">{selectedTraffic.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>
                          <MapPin className="mr-1 inline size-3" aria-hidden="true" />
                          {selectedTraffic.latitude.toFixed(4)}, {selectedTraffic.longitude.toFixed(4)}
                        </span>
                        <span>
                          Cập nhật: {new Date(selectedTraffic.updated_at).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Car className="size-10 text-slate-300" aria-hidden="true" />
                <p className="mt-2 text-sm text-slate-500">
                  Chọn một tuyến đường để xem thông tin giao thông
                </p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-950">
              Danh sách tuyến đường
            </h2>
            <div className="space-y-3">
              {mockTraffic.map((traffic) => {
                const config = congestionConfig[traffic.congestion_level];
                const CongestionIcon = config.icon;
                return (
                  <div
                    key={traffic.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                      selectedRoad === traffic.id
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className={cn("rounded-full p-1.5", config.bgColor)}>
                      <CongestionIcon className={cn("size-4", config.color)} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{traffic.road_name}</p>
                      <p className={cn("text-xs font-medium", config.color)}>{config.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
