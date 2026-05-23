"use client";

import { useState } from "react";
import { CloudSun, CloudRain, Cloud, CloudLightning, CloudFog, RefreshCw, MapPinned } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { mockWeather, type WeatherData } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const conditionConfig: Record<WeatherData["condition"], { label: string; icon: typeof CloudSun; color: string }> = {
  sunny: { label: "Nắng", icon: CloudSun, color: "text-amber-500" },
  cloudy: { label: "Nhiều mây", icon: Cloud, color: "text-slate-500" },
  rainy: { label: "Mưa", icon: CloudRain, color: "text-blue-500" },
  stormy: { label: "Bão", icon: CloudLightning, color: "text-purple-500" },
  foggy: { label: "Sương mù", icon: CloudFog, color: "text-gray-400" },
};

export default function AdminWeatherPage() {
  const [selectedDestination, setSelectedDestination] = useState("");
  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    wind_speed: "",
    condition: "",
  });
  const [loading, setLoading] = useState(false);

  const selectedWeather = mockWeather.find(
    (w) => w.destination_id === selectedDestination
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    alert("Cập nhật thời tiết thành công!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Cập nhật dữ liệu thời tiết
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Nhập hoặc đồng bộ dữ liệu thời tiết theo điểm du lịch.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-950">
              Thông tin thời tiết
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="destination" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Điểm du lịch
                </label>
                <Select
                  id="destination"
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  options={[
                    { label: "Chọn điểm du lịch", value: "" },
                    ...mockWeather.map((w) => ({
                      label: w.destination_name,
                      value: w.destination_id,
                    })),
                  ]}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="temperature" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Nhiệt độ (°C)
                  </label>
                  <Input
                    id="temperature"
                    type="number"
                    placeholder="28"
                    value={formData.temperature}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, temperature: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="humidity" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Độ ẩm (%)
                  </label>
                  <Input
                    id="humidity"
                    type="number"
                    placeholder="75"
                    value={formData.humidity}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, humidity: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="wind_speed" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Tốc độ gió (km/h)
                  </label>
                  <Input
                    id="wind_speed"
                    type="number"
                    placeholder="12"
                    value={formData.wind_speed}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, wind_speed: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="condition" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Trạng thái thời tiết
                  </label>
                  <Select
                    id="condition"
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, condition: e.target.value }))
                    }
                    options={[
                      { label: "Chọn trạng thái", value: "" },
                      { label: "Nắng", value: "sunny" },
                      { label: "Nhiều mây", value: "cloudy" },
                      { label: "Mưa", value: "rainy" },
                      { label: "Bão", value: "stormy" },
                      { label: "Sương mù", value: "foggy" },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button type="submit" disabled={loading || !selectedDestination}>
                {loading ? (
                  "Đang cập nhật..."
                ) : (
                  <>
                    <RefreshCw className="mr-2 size-4" aria-hidden="true" />
                    Cập nhật thời tiết
                  </>
                )}
              </Button>
            </div>
          </Card>
        </form>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-950">
              Dữ liệu hiện tại
            </h2>
            {selectedWeather ? (
              <div className="flex items-center gap-4">
                {(() => {
                  const config = conditionConfig[selectedWeather.condition];
                  const WeatherIcon = config.icon;
                  return (
                    <>
                      <div className="rounded-full bg-slate-100 p-4">
                        <WeatherIcon className={cn("size-8", config.color)} aria-hidden="true" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-lg font-semibold text-slate-900">
                          {selectedWeather.destination_name}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <span>{selectedWeather.temperature}°C</span>
                          <span>Độ ẩm: {selectedWeather.humidity}%</span>
                          <span>Gió: {selectedWeather.wind_speed} km/h</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Cập nhật: {new Date(selectedWeather.updated_at).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MapPinned className="size-10 text-slate-300" aria-hidden="true" />
                <p className="mt-2 text-sm text-slate-500">
                  Chọn một điểm du lịch để xem thông tin thời tiết
                </p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-950">
              Danh sách điểm du lịch
            </h2>
            <div className="space-y-3">
              {mockWeather.map((weather) => {
                const config = conditionConfig[weather.condition];
                const WeatherIcon = config.icon;
                return (
                  <div
                    key={weather.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                      selectedDestination === weather.destination_id
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <WeatherIcon className={cn("size-5", config.color)} aria-hidden="true" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {weather.destination_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {weather.temperature}°C, {config.label}
                      </p>
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
