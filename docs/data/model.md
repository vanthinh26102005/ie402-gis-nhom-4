# Data Model

## Entity Chính

| Entity | Spatial | Mục đích |
|---|---|---|
| Province | `boundary_geom` Polygon | Tỉnh/thành, ranh giới hành chính. |
| DestinationCategory | none | Loại hình du lịch. |
| TouristDestination | `location_geom` Point | Điểm du lịch/POI. |
| ServiceFacility | `location_geom` Point | Khách sạn, nhà hàng, bãi đỗ, y tế, trạm xăng. |
| User | none | Người dùng và admin. |
| TourPlan | none | Tour do người dùng tạo. |
| TourPlanDetail | none | Danh sách điểm đến trong tour, thứ tự tham quan. |
| Review | none | Đánh giá điểm du lịch. |
| Notification | optional relation to destination | Thông báo theo điểm/khu vực. |
| WeatherInfo | `location_geom` Point | Thời tiết theo điểm/khu vực. |
| TrafficInfo | `location_geom` Point hoặc segment | Giao thông theo điểm/khu vực/tuyến. |

## Bảng Và Trường Tối Thiểu

### Province

- `province_id`
- `name`
- `code`
- `description`
- `boundary_geom geometry(Polygon, 4326)`

### DestinationCategory

- `category_id`
- `name`
- `description`
- `created_at`
- `updated_at`

### TouristDestination

- `destination_id`
- `name`
- `description`
- `address`
- `open_time`
- `close_time`
- `ticket_price`
- `image_url`
- `video_url`
- `rating`
- `location_geom geometry(Point, 4326)`
- `province_id`
- `category_id`
- `created_at`
- `updated_at`

### ServiceFacility

- `service_id`
- `name`
- `type`
- `address`
- `phone`
- `rating`
- `description`
- `location_geom geometry(Point, 4326)`
- `province_id`
- `created_at`
- `updated_at`

### User

- `user_id`
- `full_name`
- `email`
- `password`
- `role`
- `avatar`
- `birthday`
- `created_at`

### TourPlan / TourPlanDetail

`TourPlan` lưu metadata tour, `TourPlanDetail` lưu từng điểm đến trong tour.

- `tour_id`, `user_id`, `title`, `description`, `total_distance`, `estimated_duration`
- `detail_id`, `tour_id`, `destination_id`, `visit_order`, `note`

### Review

- `review_id`
- `user_id`
- `destination_id`
- `content`
- `score`
- `created_at`
- `updated_at`

### Notification / WeatherInfo / TrafficInfo

- Notification: `notification_id`, `destination_id`, `title`, `content`, `type`, `status`
- WeatherInfo: `weather_id`, `destination_id`, `temperature`, `humidity`, `weather_status`, `wind_speed`, `observed_at`
- TrafficInfo: `traffic_id`, `destination_id`, `congestion_level`, `status`, `description`, `observed_at`

## Quan Hệ Chính

- Province 1-N TouristDestination.
- Province 1-N ServiceFacility.
- DestinationCategory 1-N TouristDestination.
- User 1-N TourPlan.
- TourPlan 1-N TourPlanDetail.
- TouristDestination 1-N TourPlanDetail.
- User 1-N Review.
- TouristDestination 1-N Review.
- TouristDestination 1-N Notification/WeatherInfo/TrafficInfo.

## Seed Data Tối Thiểu

Để FE và BE cùng test, seed nên có:

- 3 province: Quảng Trị, Huế, Đà Nẵng.
- Ít nhất 6 điểm du lịch.
- Ít nhất 6 dịch vụ hỗ trợ.
- Ít nhất 3 loại hình du lịch.
- Một số review, notification, weather, traffic mẫu.
