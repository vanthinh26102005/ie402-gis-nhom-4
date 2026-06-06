import { CheckCircle2, CircleAlert, Lightbulb } from "lucide-react";
import type { PlannerInsight } from "@/lib/tours/planner";
import { cn } from "@/lib/utils";

export function PlannerInsights({ insights }: { insights: PlannerInsight[] }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-brand-secondary">Gợi ý cho kế hoạch</h2>
        <p className="mt-1 text-sm text-[#6a6a6a]">Các lưu ý được cập nhật theo lịch trình bạn đang chọn.</p>
      </div>
      <div className="grid gap-3">
        {insights.map((insight) => {
          const Icon = insight.tone === "positive" ? CheckCircle2 : insight.tone === "warning" ? CircleAlert : Lightbulb;
          return (
            <article
              key={insight.id}
              className={cn(
                "rounded-lg border p-4",
                insight.tone === "warning"
                  ? "border-amber-200 bg-amber-50"
                  : insight.tone === "positive"
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-brand-outline-variant bg-brand-surface-low",
              )}
            >
              <div className="flex gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-brand-secondary" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-semibold text-brand-secondary">{insight.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#3f3f3f]">{insight.description}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
