"use client";

import { Card } from "@/components/common/Card";
import { MapPinned, Store, MessageSquare, Bell, Clock, CheckCircle } from "lucide-react";
import { getDashboardStats } from "@/lib/admin-data";

export default function AdminDashboardPage() {
  const stats = getDashboardStats();

  const statCards = [
    {
      title: "Điểm du lịch",
      value: stats.destinations,
      subValue: `${stats.activeDestinations} đang hoạt động`,
      icon: MapPinned,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Dịch vụ hỗ trợ",
      value: stats.services,
      subValue: "Khách sạn, nhà hàng, tiện ích",
      icon: Store,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
    },
    {
      title: "Đánh giá",
      value: stats.reviews,
      subValue: `${stats.pendingReviews} đang chờ duyệt`,
      icon: MessageSquare,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Thông báo",
      value: stats.notifications,
      subValue: "Đang hiển thị",
      icon: Bell,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Tổng quan quản trị
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Dashboard tổng quan cho quản trị viên theo dõi dữ liệu hệ thống.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`relative overflow-hidden border ${stat.borderColor} p-5 transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-950">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.subValue}</p>
                </div>
                <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
                  <Icon className={`size-5 ${stat.color}`} aria-hidden="true" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-950">Hoạt động gần đây</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-blue-100 p-1.5">
                <CheckCircle className="size-3.5 text-blue-600" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700">
                  Đánh giá của <span className="font-medium">Nguyễn Văn Minh</span> đã được duyệt
                </p>
                <p className="mt-0.5 text-xs text-slate-500">Đại Nội Huế</p>
              </div>
              <span className="text-xs text-slate-400">2 giờ trước</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-emerald-100 p-1.5">
                <MapPinned className="size-3.5 text-emerald-600" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700">
                  Thêm mới điểm du lịch <span className="font-medium">Đèo Hải Vân</span>
                </p>
                <p className="mt-0.5 text-xs text-slate-500">Huế</p>
              </div>
              <span className="text-xs text-slate-400">5 giờ trước</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-amber-100 p-1.5">
                <Clock className="size-3.5 text-amber-600" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700">
                  <span className="font-medium">2 đánh giá</span> đang chờ kiểm duyệt
                </p>
                <p className="mt-0.5 text-xs text-slate-500">Cần xử lý</p>
              </div>
              <span className="text-xs text-slate-400">1 ngày trước</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-950">Thống kê nhanh</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Tỷ lệ duyệt đánh giá</span>
              <span className="text-sm font-semibold text-emerald-600">80%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-4/5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Điểm du lịch hoạt động</span>
              <span className="text-sm font-semibold text-blue-600">
                {Math.round((stats.activeDestinations / stats.destinations) * 100)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${(stats.activeDestinations / stats.destinations) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Đánh giá chờ xử lý</span>
              <span className="text-sm font-semibold text-amber-600">{stats.pendingReviews}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${(stats.pendingReviews / stats.reviews) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
