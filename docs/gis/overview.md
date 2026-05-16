# GIS Overview

## Vai Trò GIS Trong Project

GIS là lõi của hệ thống. Ứng dụng không chỉ hiển thị danh sách điểm du lịch mà phải gắn dữ liệu đó với tọa độ, lớp bản đồ, ranh giới, tuyến đường và thuộc tính địa lý.

## Không Gian Triển Khai

Phạm vi không gian:

- Quảng Trị: di tích lịch sử, địa chỉ đỏ, tuyến sinh thái phía Tây, Cồn Cỏ.
- Huế: quần thể di tích Cố đô, lăng tẩm, sông Hương, đầm phá, làng nghề.
- Đà Nẵng: đô thị, biển, Sơn Trà, Ngũ Hành Sơn, điểm vui chơi, ẩm thực.

## Lớp Dữ Liệu GIS

| Nhóm | Lớp dữ liệu | Kiểu hình học | Mục đích |
|---|---|---|---|
| Basemap | OpenStreetMap/ArcGIS tiles | Raster/vector tile | Nền bản đồ. |
| Province boundary | Ranh giới tỉnh/thành | Polygon | Lọc theo địa bàn, geofence. |
| Tourist destination | Điểm du lịch | Point | Marker, popup, chi tiết POI. |
| Service facility | Khách sạn, nhà hàng, bãi đỗ, y tế | Point | Dịch vụ hỗ trợ quanh điểm đến. |
| Road network | Quốc lộ, tỉnh lộ, đường ven biển, đường mòn | LineString | Chỉ đường, định tuyến. |
| Weather/traffic | Thời tiết, ùn tắc, trạng thái tuyến | Point/segment | Cảnh báo và hỗ trợ lịch trình. |

## Hệ Tọa Độ

Báo cáo nhắc tới VN-2000 cho chuẩn bản đồ Việt Nam và WGS84/EPSG:4326 cho dữ liệu web/GeoJSON.

Khuyến nghị triển khai:

- Lưu dữ liệu web map bằng `geometry(..., 4326)` trong PostGIS để dễ tích hợp Leaflet/OpenStreetMap.
- Nếu có dữ liệu VN-2000/QGIS, chuẩn hóa/transform sang EPSG:4326 trước khi seed hoặc trả API.
- Ghi rõ CRS của mọi file GeoJSON/Shapefile trong `docs/gis` hoặc metadata.

## Định Tuyến

Báo cáo chọn thuật toán Dijkstra cho tìm đường ngắn nhất.

MVP có thể làm theo thứ tự:

1. UI form chọn điểm bắt đầu/điểm đến.
2. Tính khoảng cách thẳng hoặc gọi dịch vụ routing nếu chưa có road network.
3. Khi có dữ liệu đường, mô hình hóa road network thành graph.
4. Dijkstra hoặc thư viện routing/PostGIS/pgRouting nếu thời gian cho phép.

## Advanced GIS Roadmap

- Spatial query theo bán kính quanh vị trí hiện tại.
- Heatmap mật độ điểm đến hoặc lượt tương tác.
- Geofencing alert khi người dùng vào vùng cảnh báo.
- Hidden Gems Discovery dựa trên khoảng cách, rating, độ phổ biến.
- Offline map cache/PWA cho vùng sóng yếu.
