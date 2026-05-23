export type RouteIcon =
  | "home"
  | "map"
  | "layers"
  | "destination"
  | "route"
  | "weather"
  | "tour"
  | "review"
  | "login"
  | "dashboard"
  | "service"
  | "category"
  | "notification"
  | "traffic";

export type RouteItem = {
  label: string;
  href: string;
  description: string;
  icon: RouteIcon;
};

export const userNavigationRoutes: RouteItem[] = [
  {
    label: "Trang chủ",
    href: "/",
    description: "Trang tổng quan ứng dụng du lịch.",
    icon: "home",
  },
  {
    label: "Bản đồ",
    href: "/map",
    description: "Bản đồ du lịch 2D và các điểm quan tâm.",
    icon: "map",
  },
  {
    label: "Điểm du lịch",
    href: "/destinations",
    description: "Tìm kiếm và lọc điểm du lịch.",
    icon: "destination",
  },
  {
    label: "Tạo tour",
    href: "/tours/create",
    description: "Tạo hành trình tham quan cá nhân.",
    icon: "tour",
  },
  {
    label: "Chỉ đường",
    href: "/route",
    description: "Tìm và hiển thị lộ trình di chuyển.",
    icon: "route",
  },
  {
    label: "Thời tiết & Giao thông",
    href: "/weather-traffic",
    description: "Xem thông tin thời tiết và giao thông.",
    icon: "weather",
  },
  {
    label: "Đăng nhập",
    href: "/auth/login",
    description: "Đăng nhập tài khoản người dùng.",
    icon: "login",
  },
];

export const userRoutes: RouteItem[] = [
  ...userNavigationRoutes,
  {
    label: "Đăng ký",
    href: "/auth/register",
    description: "Tạo tài khoản người dùng mới.",
    icon: "login",
  },
  {
    label: "Lớp dữ liệu",
    href: "/map/layers",
    description: "Bật tắt và kiểm tra các lớp dữ liệu GIS.",
    icon: "layers",
  },
  {
    label: "Chi tiết địa điểm",
    href: "/destinations/[id]",
    description: "Xem thông tin chi tiết một điểm du lịch.",
    icon: "destination",
  },
  {
    label: "Chỉ đường",
    href: "/route",
    description: "Tìm và hiển thị lộ trình di chuyển.",
    icon: "route",
  },
  {
    label: "Thời tiết / giao thông",
    href: "/weather-traffic",
    description: "Xem thông tin thời tiết và giao thông.",
    icon: "weather",
  },
  {
    label: "Đánh giá",
    href: "/reviews",
    description: "Gửi đánh giá và phản hồi điểm du lịch.",
    icon: "review",
  },
];

export const adminNavigationRoutes: RouteItem[] = [
  {
    label: "Tổng quan",
    href: "/admin",
    description: "Dashboard quản trị hệ thống.",
    icon: "dashboard",
  },
  {
    label: "Quản lý điểm du lịch",
    href: "/admin/destinations",
    description: "Quản lý dữ liệu điểm du lịch.",
    icon: "destination",
  },
  {
    label: "Dịch vụ hỗ trợ",
    href: "/admin/services",
    description: "Quản lý khách sạn, nhà hàng và tiện ích.",
    icon: "service",
  },
  {
    label: "Loại hình du lịch",
    href: "/admin/categories",
    description: "Quản lý danh mục loại hình du lịch.",
    icon: "category",
  },
  {
    label: "Thông báo",
    href: "/admin/notifications",
    description: "Quản lý thông báo theo địa điểm.",
    icon: "notification",
  },
  {
    label: "Thời tiết",
    href: "/admin/weather",
    description: "Cập nhật dữ liệu thời tiết.",
    icon: "weather",
  },
  {
    label: "Giao thông",
    href: "/admin/traffic",
    description: "Cập nhật dữ liệu giao thông.",
    icon: "traffic",
  },
  {
    label: "Đánh giá",
    href: "/admin/reviews",
    description: "Quản lý và kiểm duyệt đánh giá.",
    icon: "review",
  },
];

export const adminRoutes: RouteItem[] = [
  {
    label: "Đăng nhập quản trị",
    href: "/admin/login",
    description: "Đăng nhập tài khoản quản trị viên.",
    icon: "login",
  },
  ...adminNavigationRoutes,
  {
    label: "Thêm điểm du lịch",
    href: "/admin/destinations/new",
    description: "Tạo mới dữ liệu điểm du lịch.",
    icon: "destination",
  },
  {
    label: "Sửa điểm du lịch",
    href: "/admin/destinations/[id]/edit",
    description: "Cập nhật dữ liệu điểm du lịch.",
    icon: "destination",
  },
  {
    label: "Kiểm duyệt đánh giá",
    href: "/admin/reviews/[id]/moderate",
    description: "Kiểm tra và xử lý một đánh giá.",
    icon: "review",
  },
];
