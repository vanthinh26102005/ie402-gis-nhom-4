import type { ReactNode } from "react";
import { Card } from "@/components/common/Card";

type PagePlaceholderProps = {
  title: string;
  description: string;
  placeholder: string;
  suggestions?: string[];
  children?: ReactNode;
};

export function PagePlaceholder({
  title,
  description,
  placeholder,
  suggestions = [],
  children,
}: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
          Đang chờ thành viên triển khai
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>

      <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50/60">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            <div className="rounded-md border border-dashed border-blue-300 bg-white/80 p-6">
              <p className="text-base font-medium text-blue-950">{placeholder}</p>
              <p className="mt-2 text-sm text-slate-600">
                Khu vực này chỉ là khung giao diện để team nhận route và phát triển
                logic thật ở bước sau.
              </p>
            </div>
            {children}
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Gợi ý triển khai sau
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li>Thêm UI, API và xử lý nghiệp vụ theo phân công của team.</li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
