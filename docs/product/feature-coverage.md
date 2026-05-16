# Feature Coverage

File này đối chiếu báo cáo với source/issue hiện tại để trả lời câu hỏi: **đã đảm bảo tất cả chức năng cần thiết chưa?**

## Kết Luận

Đã cover đủ **core use-case** cần thiết cho một MVP WebGIS du lịch 2D.

Chưa cover đầy đủ ở mức implementation riêng cho các tính năng nâng cao/sáng tạo trong báo cáo. Những phần đó nên được coi là phase 2 hoặc tạo issue riêng nếu muốn demo.

## Core User Features

| Chức năng trong báo cáo | Route hiện tại | Issue chính | Trạng thái coverage |
|---|---|---|---|
| Đăng ký | `/auth/register` | #11 | Covered MVP |
| Đăng nhập | `/auth/login` | #11 | Covered MVP |
| Xem bản đồ du lịch 2D | `/map` | #6 | Covered MVP |
| Xem lớp dữ liệu | `/map/layers` | #6 | Covered MVP |
| Tìm kiếm địa điểm | `/destinations` | #10 | Covered MVP |
| Lọc địa điểm | `/destinations` | #10 | Covered MVP |
| Xem chi tiết địa điểm | `/destinations/[id]` | #10 | Covered MVP |
| Chỉ đường | `/route` | #10, #3, #9 | Covered MVP |
| Xem thời tiết/giao thông | `/weather-traffic` | #10, #12, #3, #9 | Covered MVP |
| Tạo tour | `/tours/create` | #11 | Covered MVP |
| Lưu tour | `/tours/create` + API TourPlan | #11, #3, #9 | Covered MVP |
| Đánh giá địa điểm | `/reviews` | #11, #12 | Covered MVP |

## Core Admin Features

| Chức năng trong báo cáo | Route hiện tại | Issue chính | Trạng thái coverage |
|---|---|---|---|
| Đăng nhập hệ thống quản trị | `/admin/login` | #12, #3 | Covered MVP |
| Tổng quan quản trị | `/admin` | #12 | Covered MVP |
| Quản lý điểm du lịch | `/admin/destinations` | #12, #3, #9 | Covered MVP |
| Thêm điểm du lịch | `/admin/destinations/new` | #12, #3, #9 | Covered MVP |
| Sửa điểm du lịch | `/admin/destinations/[id]/edit` | #12, #3, #9 | Covered MVP |
| Xóa điểm du lịch | API/admin action | #12, #3, #9 | Covered MVP |
| Quản lý dịch vụ hỗ trợ | `/admin/services` | #12, #3, #9 | Covered MVP |
| Quản lý loại hình du lịch | `/admin/categories` | #12, #3, #9 | Covered MVP |
| Quản lý thông báo | `/admin/notifications` | #12, #3, #9 | Covered MVP |
| Cập nhật thời tiết | `/admin/weather` | #12, #3, #9 | Covered MVP |
| Cập nhật giao thông | `/admin/traffic` | #12, #3, #9 | Covered MVP |
| Quản lý đánh giá | `/admin/reviews` | #12, #3, #9 | Covered MVP |
| Kiểm duyệt đánh giá | `/admin/reviews/[id]/moderate` | #12, #3, #9 | Covered MVP |

## 12 Chức Năng Phạm Vi Báo Cáo

| # | Chức năng | Coverage hiện tại | Ghi chú |
|---|---|---|---|
| 1 | Bản đồ 2D tương tác đa lớp | Covered MVP | #6 phụ trách map/layers. |
| 2 | Chỉ đường & Smart Routing | Covered MVP | #10 UI, #3/#9 API/data. Dijkstra nâng cao có thể làm sau. |
| 3 | Tìm kiếm không gian & bộ lọc | Covered MVP | #10. Spatial query theo bán kính nên thêm sau khi PostGIS ổn. |
| 4 | Truy xuất thuộc tính POI | Covered MVP | #10 và #6 popup/detail. |
| 5 | Bioclimatic overlays/cảnh báo | Partial | Có weather/traffic route, nhưng chưa có mô hình sinh khí hậu đầy đủ. |
| 6 | Geofencing alerts | Roadmap | Chưa có route/issue riêng. Có thể mở rộng từ Notification + location. |
| 7 | Interactive StoryMaps | Roadmap | Chưa có route/issue riêng. |
| 8 | Geo-Gamification | Roadmap | Chưa có route/issue riêng. |
| 9 | Hidden Gems Discovery | Partial/Roadmap | Có thể mở rộng trong search/recommendation ở #10. |
| 10 | Deep Offline Mode | Roadmap | Cần PWA/offline cache issue riêng. |
| 11 | Admin CRUD Dashboard | Covered MVP | #12 + #3/#9. |
| 12 | Spatial Analytics/Export report | Roadmap | Dashboard có thể làm basic; heatmap/export cần issue riêng. |

## Khuyến Nghị Cho Team

Nếu mục tiêu là đồ án demo trong thời gian ngắn: giữ 6 issue hiện tại là đủ ở mức epic.

Nếu mục tiêu là bám sát toàn bộ báo cáo, tạo thêm issue phase 2:

- `[GIS] Spatial radius query bằng PostGIS`
- `[GIS] Geofencing alerts prototype`
- `[FE] StoryMaps tuyến di sản`
- `[FE] Geo-Gamification nhiệm vụ địa lý`
- `[FE/BE] PWA offline map cache`
- `[Admin] Spatial analytics heatmap và export report`
