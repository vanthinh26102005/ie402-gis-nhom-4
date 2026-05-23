"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { DestinationSummaryCard } from "@/components/destinations/DestinationSummaryCard";
import type { DestinationSummary } from "@/lib/gis";
import { fetchDestinations } from "@/lib/gis";

export function DestinationList() {
  const [destinations, setDestinations] = useState<DestinationSummary[]>([]);
  const [query, setQuery] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDestinations() {
      try {
        setIsLoading(true);
        setError(null);
        const items = await fetchDestinations();
        if (isMounted) {
          setDestinations(items);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Không thể tải danh sách địa điểm.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDestinations();

    return () => {
      isMounted = false;
    };
  }, []);

  const provinceOptions = useMemo(() => {
    const provinces = new Map<string, string>();
    destinations.forEach((destination) => {
      provinces.set(destination.province.code, destination.province.name);
    });

    return [
      { label: "Tất cả tỉnh/thành", value: "" },
      ...Array.from(provinces.entries()).map(([value, label]) => ({ label, value })),
    ];
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return destinations.filter((destination) => {
      const matchesKeyword = keyword
        ? [
            destination.name,
            destination.description,
            destination.address,
            destination.category?.name,
            destination.province.name,
          ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword))
        : true;
      const matchesProvince = provinceCode
        ? destination.province.code === provinceCode
        : true;

      return matchesKeyword && matchesProvince;
    });
  }, [destinations, provinceCode, query]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <label className="relative block">
          <span className="sr-only">Tìm kiếm địa điểm</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nhập tên, địa chỉ hoặc loại hình"
            className="pl-9"
          />
        </label>
        <label>
          <span className="sr-only">Lọc theo tỉnh thành</span>
          <Select
            value={provinceCode}
            onChange={(event) => setProvinceCode(event.target.value)}
            options={provinceOptions}
          />
        </label>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Đang tải địa điểm...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!isLoading && !error ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDestinations.map((destination) => (
            <DestinationSummaryCard key={destination.id} destination={destination} />
          ))}
        </div>
      ) : null}

      {!isLoading && !error && filteredDestinations.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Không tìm thấy địa điểm phù hợp.
        </div>
      ) : null}
    </div>
  );
}
