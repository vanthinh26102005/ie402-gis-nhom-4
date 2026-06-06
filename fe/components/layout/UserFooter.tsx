import { APP_NAME, PROJECT_COURSE, REGION_PROVINCES } from "@/lib/constants";

export function UserFooter() {
  const columns = [
    {
      title: "Hỗ trợ",
      links: ["Trung tâm trợ giúp", "Dữ liệu bản đồ", "An toàn chuyến đi"],
    },
    {
      title: "Khám phá",
      links: ["Điểm du lịch", "Lập lộ trình", "Thời tiết & giao thông"],
    },
    {
      title: "Hệ thống",
      links: ["Dashboard admin", "Dữ liệu PostGIS", PROJECT_COURSE],
    },
  ];

  return (
    <footer className="border-t border-brand-outline-variant bg-white">
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        {columns.map((column) => (
          <section key={column.title} className="space-y-3">
            <h2 className="text-base font-medium text-brand-secondary">{column.title}</h2>
            <ul className="space-y-2 text-sm text-[#3f3f3f]">
              {column.links.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="border-t border-brand-outline-variant">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2 px-4 py-5 text-[13px] text-[#6a6a6a] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>
            © 2026 {APP_NAME}. {PROJECT_COURSE}
          </p>
          <p>Phạm vi: {REGION_PROVINCES.join(" · ")}</p>
        </div>
      </div>
    </footer>
  );
}
