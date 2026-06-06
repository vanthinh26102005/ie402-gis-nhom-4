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
        <span className="inline-flex w-fit rounded-full border border-brand-outline-variant bg-brand-surface-low px-3 py-1 text-xs font-medium text-[#6a6a6a]">
          Đang chờ thành viên triển khai
        </span>
        <h1 className="text-[28px] font-bold leading-[1.43] tracking-normal text-brand-secondary">
          {title}
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-[#6a6a6a]">
          {description}
        </p>
      </div>

      <Card>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed border-brand-outline-variant bg-white p-6">
              <p className="text-base font-medium text-brand-secondary">{placeholder}</p>
              <p className="mt-2 text-sm text-[#6a6a6a]">
                Khu vực này chỉ là khung giao diện để team nhận route và phát triển
                logic thật ở bước sau.
              </p>
            </div>
            {children}
          </div>

          <div className="rounded-lg border border-brand-outline-variant bg-white p-4">
            <h2 className="text-sm font-semibold text-brand-secondary">
              Gợi ý triển khai sau
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-[#6a6a6a]">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
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
