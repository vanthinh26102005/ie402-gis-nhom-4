import { Card } from "@/components/common/Card";

type DataTablePlaceholderProps = {
  title?: string;
  columns?: string[];
  rows?: number;
};

export function DataTablePlaceholder({
  title = "Bảng dữ liệu",
  columns = ["Tên", "Khu vực", "Trạng thái", "Thao tác"],
  rows = 4,
}: DataTablePlaceholderProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-emerald-50 text-xs uppercase tracking-wide text-emerald-900">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={`${column}-${rowIndex}`} className="px-5 py-4">
                    <div
                      className="h-3 rounded-full bg-slate-200"
                      style={{ width: `${Math.max(36, 82 - columnIndex * 12)}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
