"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { REGION_PROVINCES } from "@/lib/constants";

interface DestinationFilterBarProps {
  keyword: string;
  setKeyword: (val: string) => void;
  province: string;
  setProvince: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

const POPULAR_SUGGESTIONS = [
  { label: "Hoàng thành Huế", keyword: "Đại Nội" },
  { label: "Bà Nà Hills", keyword: "Ba Na" },
  { label: "Sơn Trà", keyword: "Sơn Trà" },
  { label: "Thành cổ", keyword: "Thành Cổ" },
  { label: "Vịnh Mốc", keyword: "Vịnh Mốc" },
  { label: "Ngũ Hành Sơn", keyword: "Ngũ Hành" },
];

export function DestinationFilterBar({
  keyword,
  setKeyword,
  province,
  setProvince,
  category,
  setCategory,
  onSubmit,
  onReset,
}: DestinationFilterBarProps) {
  const handleSuggestionClick = (kw: string) => {
    setKeyword(kw);
    // Directly submit after updating keyword state (using a small microtask/timeout to allow state update or form trigger)
    setTimeout(() => {
      const mockEvent = { preventDefault: () => {} } as React.FormEvent;
      onSubmit(mockEvent);
    }, 50);
  };

  return (
    <div className="bg-brand-surface-lowest border border-brand-outline-variant/30 rounded-brand-card p-6 shadow-sm mb-8 transition-all">
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-[1fr_200px_180px_auto]">
        {/* Keyword input */}
        <div className="relative">
          <Input
            placeholder="Nhập tên điểm đến, địa chỉ hoặc mô tả..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
        </div>

        {/* Province filter */}
        <Select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          options={[
            { label: "Tất cả Tỉnh/Thành", value: "" },
            ...REGION_PROVINCES.map((p) => ({ label: p, value: p })),
          ]}
        />

        {/* Category filter */}
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[
            { label: "Tất cả loại hình", value: "" },
            { label: "Di sản văn hóa", value: "Di sản" },
            { label: "Sinh thái tự nhiên", value: "Sinh thái" },
            { label: "Du lịch biển", value: "Du lịch biển" },
            { label: "Giải trí", value: "Giải trí" },
          ]}
        />

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 px-6">
            Tìm kiếm
          </Button>
          {(keyword || province || category) && (
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="px-3"
            >
              Xóa lọc
            </Button>
          )}
        </div>
      </form>

      {/* Popular suggestion tags */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-semibold">Gợi ý phổ biến:</span>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => handleSuggestionClick(s.keyword)}
              className="px-2.5 py-1 rounded-lg border border-brand-outline-variant/30 text-slate-600 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition bg-brand-surface-low/50 font-medium active:scale-95 cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
