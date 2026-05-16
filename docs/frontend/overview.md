# Frontend Guide

## Stack

Frontend hiện tại nằm trong `fe/`:

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn-style button base.
- lucide-react icons.

## Layout

User và Admin layout tách riêng:

- User: `UserHeader`, `UserFooter`, `UserLayout`.
- Admin: `AdminSidebar`, `AdminHeader`, `AdminLayout`.

Không dùng user header cho admin.

## Route User

| Route | Mục đích |
|---|---|
| `/` | Trang chủ. |
| `/auth/login` | Đăng nhập người dùng. |
| `/auth/register` | Đăng ký người dùng. |
| `/map` | Bản đồ du lịch 2D. |
| `/map/layers` | Xem/bật/tắt lớp dữ liệu. |
| `/destinations` | Tìm kiếm và lọc địa điểm. |
| `/destinations/[id]` | Chi tiết địa điểm. |
| `/route` | Chỉ đường. |
| `/weather-traffic` | Thời tiết/giao thông. |
| `/tours/create` | Tạo tour. |
| `/reviews` | Đánh giá địa điểm. |

## Route Admin

| Route | Mục đích |
|---|---|
| `/admin/login` | Đăng nhập quản trị. |
| `/admin` | Tổng quan quản trị. |
| `/admin/destinations` | Quản lý điểm du lịch. |
| `/admin/destinations/new` | Thêm điểm du lịch. |
| `/admin/destinations/[id]/edit` | Sửa điểm du lịch. |
| `/admin/services` | Quản lý dịch vụ hỗ trợ. |
| `/admin/categories` | Quản lý loại hình du lịch. |
| `/admin/notifications` | Quản lý thông báo. |
| `/admin/weather` | Cập nhật thời tiết. |
| `/admin/traffic` | Cập nhật giao thông. |
| `/admin/reviews` | Quản lý đánh giá. |
| `/admin/reviews/[id]/moderate` | Kiểm duyệt đánh giá. |

## Component Hiện Có

Common:

- `Button`
- `Input`
- `Select`
- `Card`
- `PagePlaceholder`
- `DataTablePlaceholder`

Layout:

- `UserHeader`
- `UserFooter`
- `UserLayout`
- `AdminSidebar`
- `AdminHeader`
- `AdminLayout`

## Nguyên Tắc FE

- Route page nên giữ mỏng, logic nằm trong component con.
- Dữ liệu mock nên đặt trong `fe/lib` hoặc file data rõ ràng để thay API dễ.
- Component map cần là client component vì Leaflet dùng `window`.
- Giữ form responsive và có validation cơ bản.
- Tất cả PR FE cần chạy:

```bash
npm --prefix fe run lint
npm --prefix fe run build
```

## Module FE Nên Tách

```text
fe/components/
  admin/
  auth/
  destinations/
  map/
  reviews/
  route/
  tours/
  weather-traffic/
```

Không bắt buộc tạo hết ngay, nhưng khi một trang bắt đầu có logic thật thì nên tách component khỏi `page.tsx`.
