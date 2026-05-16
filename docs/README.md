# Project Docs - GIS Du lịch miền Trung

Thư mục này là tài liệu làm việc cho project IE402, được tổng hợp từ báo cáo `IE402.Q21_DoAn_Nhom4.docx` và source code hiện tại trong `be/` + `fe/`.

Mục tiêu chính: giúp thành viên mới, reviewer và Codex đọc nhanh bối cảnh trước khi code tiếp, thay vì phải mở lại toàn bộ báo cáo Word.

## Đọc Theo Thứ Tự

1. [Product Overview](product/overview.md): phạm vi đề tài, actor, MVP và phần nâng cao.
2. [Feature Coverage](product/feature-coverage.md): đối chiếu chức năng trong báo cáo với route/source/issue hiện tại.
3. [GIS Overview](gis/overview.md): lớp dữ liệu GIS, hệ tọa độ, bản đồ, định tuyến.
4. [Data Model](data/model.md): entity, bảng, quan hệ và trường không gian PostGIS.
5. [Backend Guide](backend/overview.md): kiến trúc backend Express/PostgreSQL cần hướng tới.
6. [Frontend Guide](frontend/overview.md): route, layout, component và module FE.
7. [Team Workflow](team/workflow.md): cách chia việc, branch, PR, review.
8. [Codex Context](codex-context.md): ghi chú ngắn cho những lần Codex sau.

## Trả Lời Nhanh Về Coverage

Các route/core use-case chính trong báo cáo đã được cover ở mức khung route + issue lớn:

- User: đăng ký, đăng nhập, bản đồ, lớp dữ liệu, tìm kiếm/lọc, chi tiết địa điểm, chỉ đường, thời tiết/giao thông, tạo/lưu tour, đánh giá.
- Admin: đăng nhập, dashboard, quản lý điểm du lịch, dịch vụ, loại hình, thông báo, thời tiết, giao thông, đánh giá, kiểm duyệt.
- Data/GIS: Province, DestinationCategory, TouristDestination, ServiceFacility, User, TourPlan, Review, Notification, WeatherInfo, TrafficInfo.

Tuy nhiên các chức năng sáng tạo/nâng cao trong báo cáo như StoryMaps, Geo-Gamification, Hidden Gems, Deep Offline, Geofencing và Spatial Analytics hiện mới nên xem là roadmap mở rộng. Nếu giảng viên yêu cầu demo đầy đủ, cần tạo issue riêng cho các phần đó.

## Source Hiện Tại

- `be/`: Express.js + PostgreSQL scaffold, hiện mới có route cơ bản và kết nối `pg`.
- `fe/`: Next.js App Router + TypeScript + Tailwind, đã có route/layout placeholder cho user và admin.
- `.agent/`, `.agents/`, `.claude/`, `.codex/`: folder công cụ/agent local do team thêm, không phải runtime chính của app.
