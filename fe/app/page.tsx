"use client";

import Link from "next/link";
import { Button } from "@/components/common/Button";
import { UserLayout } from "@/components/layout/UserLayout";
import {
  Map,
  Compass,
  Navigation,
  CloudSun,
  CalendarDays,
  ArrowRight,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const provincesData = [
    {
      name: "Quảng Trị",
      count: "2 điểm đến",
      desc: "Mảnh đất lịch sử với Thành Cổ uy nghiêm và Địa đạo Vịnh Mốc huyền thoại.",
      tag: "Di tích lịch sử",
      bgGradient: "from-amber-500/10 to-orange-500/5",
      borderColor: "border-amber-500/20",
      textColor: "text-amber-700",
    },
    {
      name: "Thừa Thiên Huế",
      count: "2 điểm đến",
      desc: "Cố đô cổ kính thơ mộng sở hữu di sản văn hóa thế giới Đại Nội và Lăng Tự Đức.",
      tag: "Di sản văn hóa",
      bgGradient: "from-brand-primary/10 to-brand-primary-container/5",
      borderColor: "border-brand-primary/20",
      textColor: "text-brand-primary",
    },
    {
      name: "Đà Nẵng",
      count: "3 điểm đến",
      desc: "Thành phố đáng sống với Cầu Vàng Bà Nà Hills trứ danh, Ngũ Hành Sơn và Sơn Trà.",
      tag: "Hiện đại & Sinh thái",
      bgGradient: "from-brand-secondary/10 to-cyan-500/5",
      borderColor: "border-brand-secondary/20",
      textColor: "text-brand-secondary",
    },
  ];

  const features = [
    {
      title: "Bản đồ GIS 2D",
      desc: "Khám phá không gian địa lý trực quan, hiển thị các điểm du lịch nổi bật và các dịch vụ hỗ trợ xung quanh.",
      href: "/map",
      icon: Map,
      color: "bg-blue-500",
      iconColor: "text-blue-500",
    },
    {
      title: "Khám phá Điểm đến",
      desc: "Tra cứu thông tin chi tiết, hình ảnh whitelisted sắc nét, video thuyết minh thực tế và tọa độ GPS chuẩn xác.",
      href: "/destinations",
      icon: Compass,
      color: "bg-emerald-500",
      iconColor: "text-emerald-500",
    },
    {
      title: "Định tuyến & Chỉ đường",
      desc: "Lập lộ trình di chuyển tối ưu nối liền các danh lam thắng cảnh, tính toán cự ly và ước lượng thời gian đi.",
      href: "/route",
      icon: Navigation,
      color: "bg-orange-500",
      iconColor: "text-orange-500",
    },
    {
      title: "Thời tiết & Giao thông",
      desc: "Theo dõi báo cáo nhiệt độ thực tế và các bản tin giao thông, cảnh báo cấm đường, ùn tắc trên các tuyến lộ.",
      href: "/weather-traffic",
      icon: CloudSun,
      color: "bg-purple-500",
      iconColor: "text-purple-500",
    },
    {
      title: "Lập kế hoạch Tour",
      desc: "Tự tạo hành trình tham quan cá nhân hóa theo thời gian và sở thích để có trải nghiệm du lịch trọn vẹn nhất.",
      href: "/tours/create",
      icon: CalendarDays,
      color: "bg-pink-500",
      iconColor: "text-pink-500",
    },
  ];

  return (
    <UserLayout>
      <main className="min-h-screen bg-brand-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-slate-900 to-brand-primary-container text-white py-16 md:py-24 px-4">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-15" />
          <div className="absolute top-1/4 left-1/4 size-96 bg-brand-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 size-96 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-secondary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3 text-amber-400" /> Hệ thống thông tin địa lý du lịch miền trung
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-none">
              Khám phá Di sản & <br />
              <span className="bg-gradient-to-r from-brand-secondary to-teal-400 bg-clip-text text-transparent">
                Định tuyến Thông minh
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-300 text-xs md:text-sm font-medium leading-relaxed">
              Trực quan hóa không gian địa lý các điểm du lịch tại Quảng Trị, Huế và Đà Nẵng. Theo dõi điều kiện thời tiết, giao thông thực tế và thiết lập hành trình tham quan tối ưu của riêng bạn.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-xl shadow-lg shadow-brand-secondary/20 hover:scale-102 transition-transform font-bold text-sm">
                <Link href="/map">
                  Khám phá bản đồ chính <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-white/25 hover:bg-white/10 hover:text-white font-bold text-sm">
                <Link href="/destinations">Tìm điểm du lịch</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid Section */}
        <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-primary tracking-tight">
              Các tính năng hệ thống chính
            </h2>
            <div className="mt-2 h-1 w-16 bg-brand-secondary rounded-full mx-auto" />
            <p className="mt-3 text-slate-500 text-xs md:text-sm font-medium max-w-xl mx-auto">
              Trải nghiệm bộ công cụ hỗ trợ du lịch 2D toàn diện, từ bản đồ số hóa đến dự báo thời tiết và lộ trình di chuyển.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {features.map((feat) => {
              const IconComp = feat.icon;
              return (
                <Link
                  key={feat.href}
                  href={feat.href}
                  className="group relative bg-brand-surface-lowest border border-brand-outline-variant/35 rounded-brand-card p-5 shadow-sm hover:shadow-lg hover:shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`size-10 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComp className={`size-5 ${feat.iconColor}`} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-brand-primary transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-4">
                        {feat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[10px] font-bold text-brand-primary group-hover:text-brand-primary-container transition-colors">
                    Trải nghiệm ngay
                    <ArrowRight className="size-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Region Highlights Section */}
        <section className="py-12 bg-brand-surface-lowest border-t border-b border-brand-outline-variant/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center md:text-left mb-10">
              <h2 className="text-2xl font-extrabold text-brand-primary tracking-tight">
                Địa bàn khám phá trọng điểm
              </h2>
              <div className="mt-1 h-1 w-16 bg-brand-secondary rounded-full md:mx-0 mx-auto" />
              <p className="mt-3 text-slate-500 text-xs md:text-sm font-medium">
                Dữ liệu không gian được số hóa đầy đủ trên địa bàn 3 tỉnh thành miền Trung liên kết hành trình.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {provincesData.map((prov) => (
                <div
                  key={prov.name}
                  className={`bg-gradient-to-b ${prov.bgGradient} border ${prov.borderColor} rounded-brand-card p-6 flex flex-col justify-between min-h-[200px] hover:shadow-sm transition-all`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-white/80 border ${prov.borderColor} ${prov.textColor}`}>
                        {prov.tag}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        <MapPin className="size-3.5" /> {prov.count}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{prov.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {prov.desc}
                    </p>
                  </div>

                  <div className="mt-6">
                    <Button asChild size="sm" variant="outline" className={`rounded-lg text-[11px] font-bold bg-white/70 hover:bg-white ${prov.textColor} border-current`}>
                      <Link href={`/destinations?province=${prov.name}`}>
                        Xem danh sách điểm đến
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </UserLayout>
  );
}
