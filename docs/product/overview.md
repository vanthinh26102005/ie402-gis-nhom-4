# Product Overview

## Tên Và Phạm Vi

Ứng dụng: **GIS Du lịch miền Trung**

Đề tài: xây dựng ứng dụng WebGIS du lịch 2D cho khu vực **Quảng Trị - Huế - Đà Nẵng**.

Hệ thống không đi theo hướng GIS 3D, point cloud, mô hình khối công trình, HBIM hoặc mô phỏng chi tiết di tích. Trọng tâm là bản đồ 2D, dữ liệu không gian, tra cứu du lịch và quản trị dữ liệu.

## Bài Toán

Báo cáo xác định các vấn đề chính:

- Dữ liệu du lịch giữa Quảng Trị, Huế, Đà Nẵng còn phân mảnh.
- Nền tảng bản đồ thương mại thiếu lớp dữ liệu chuyên đề du lịch địa phương.
- Du lịch miền Trung phụ thuộc nhiều vào thời tiết, giao thông, môi trường.
- Cách diễn giải di sản còn tĩnh, chưa tận dụng bản đồ kể chuyện và trải nghiệm tương tác.

## Actor

1. **Người dùng / Du khách**
   - Xem bản đồ 2D.
   - Tìm kiếm, lọc, xem chi tiết điểm du lịch.
   - Chỉ đường, tạo tour, lưu tour.
   - Xem thời tiết/giao thông.
   - Đánh giá địa điểm.

2. **Quản trị viên**
   - Quản lý điểm du lịch.
   - Quản lý dịch vụ hỗ trợ.
   - Quản lý loại hình du lịch.
   - Quản lý thông báo.
   - Cập nhật thời tiết/giao thông.
   - Quản lý và kiểm duyệt đánh giá.

3. **Reviewer / Maintainer**
   - Vai trò review code, kiểm tra PR, đảm bảo task đúng scope.
   - Không nhận issue triển khai chính nếu đã thống nhất như hiện tại.

## MVP Nên Hoàn Thành Trước

MVP cần chứng minh được một WebGIS du lịch 2D hoạt động end-to-end:

- Frontend có đủ route user/admin.
- Backend có API rõ contract.
- Database có schema và seed data tối thiểu.
- Map hiển thị được điểm du lịch/dịch vụ/ranga giới hoặc lớp GeoJSON.
- User xem, tìm, lọc, xem chi tiết, tạo tour, gửi đánh giá.
- Admin CRUD dữ liệu chính.

## Roadmap Nâng Cao

Các mục này có trong báo cáo nhưng không nên trộn vào MVP nếu thời gian hạn chế:

- Interactive StoryMaps.
- Geo-Gamification.
- Hidden Gems Discovery.
- Geofencing Alerts.
- Deep Offline Mode.
- Heatmap/Spatial Analytics và xuất báo cáo.
- Bioclimatic overlay đúng nghĩa chuyên sâu.
