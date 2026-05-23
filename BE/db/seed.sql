-- Realistic Vietnam tourism GIS seed data.
-- Coordinates use WGS84 longitude/latitude order for PostGIS Point values.
-- Run after schema.sql: npm run db:seed

BEGIN;

TRUNCATE TABLE
  traffic_info,
  weather_info,
  notifications,
  reviews,
  tour_plan_details,
  tour_plans,
  users,
  service_facilities,
  tourist_destinations,
  destination_categories,
  provinces
RESTART IDENTITY CASCADE;

-- ============================================================
-- INSERT provinces
-- ============================================================

INSERT INTO provinces (id, name, code, description, boundary_geom) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'Hồ Chí Minh',
  'HCM',
  'Trung tâm kinh tế, văn hóa và du lịch lớn ở miền Nam Việt Nam.',
  ST_GeomFromText('POLYGON((106.35 10.35, 107.05 10.35, 107.05 11.20, 106.35 11.20, 106.35 10.35))', 4326)
),
(
  '00000000-0000-0000-0000-000000000002',
  'Hà Nội',
  'HN',
  'Thủ đô Việt Nam với hệ thống di tích lịch sử, hồ, bảo tàng và phố cổ.',
  ST_GeomFromText('POLYGON((105.25 20.55, 106.10 20.55, 106.10 21.45, 105.25 21.45, 105.25 20.55))', 4326)
),
(
  '00000000-0000-0000-0000-000000000003',
  'Đà Nẵng',
  'DNG',
  'Thành phố biển miền Trung, kết nối du lịch đô thị, sinh thái và nghỉ dưỡng.',
  ST_GeomFromText('POLYGON((107.80 15.85, 108.35 15.85, 108.35 16.25, 107.80 16.25, 107.80 15.85))', 4326)
),
(
  '00000000-0000-0000-0000-000000000004',
  'Thừa Thiên Huế',
  'TTH',
  'Vùng đất cố đô với quần thể di sản, lăng tẩm, sông Hương và văn hóa cung đình.',
  ST_GeomFromText('POLYGON((107.15 15.95, 108.20 15.95, 108.20 16.80, 107.15 16.80, 107.15 15.95))', 4326)
);

-- ============================================================
-- INSERT destination_categories
-- ============================================================

INSERT INTO destination_categories (id, name, description) VALUES
('10000000-0000-0000-0000-000000000001', 'Di tích lịch sử', 'Công trình, địa danh và không gian gắn với lịch sử Việt Nam.'),
('10000000-0000-0000-0000-000000000002', 'Công viên', 'Không gian công cộng, cảnh quan đô thị và điểm thư giãn ngoài trời.'),
('10000000-0000-0000-0000-000000000003', 'Khu vui chơi', 'Khu giải trí, điểm tham quan hiện đại và tổ hợp vui chơi.'),
('10000000-0000-0000-0000-000000000004', 'Bãi biển', 'Bãi biển, bán đảo và không gian du lịch ven biển.'),
('10000000-0000-0000-0000-000000000005', 'Bảo tàng', 'Bảo tàng, trung tâm trưng bày và không gian giáo dục văn hóa.'),
('10000000-0000-0000-0000-000000000006', 'Ẩm thực', 'Khu phố, chợ, nhà hàng và điểm trải nghiệm ẩm thực địa phương.'),
('10000000-0000-0000-0000-000000000007', 'Sinh thái', 'Núi, rừng, bán đảo, vườn quốc gia và điểm đến thiên nhiên.');

-- ============================================================
-- INSERT tourist_destinations
-- ============================================================

INSERT INTO tourist_destinations (
  id, province_id, category_id, name, description, address,
  open_time, close_time, ticket_price, image_url, video_url, rating, location_geom
) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Dinh Độc Lập', 'Công trình lịch sử nổi bật tại trung tâm TP.HCM, phù hợp tham quan và học lịch sử.', '135 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM', '08:00', '16:30', 40000, 'https://source.unsplash.com/1200x800/?independence-palace,vietnam', NULL, 4.7, ST_SetSRID(ST_MakePoint(106.6953, 10.7770), 4326)),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Nhà thờ Đức Bà Sài Gòn', 'Nhà thờ cổ mang dấu ấn kiến trúc Pháp, nằm cạnh Bưu điện Thành phố.', 'Công xã Paris, Quận 1, TP.HCM', '08:00', '17:00', 0, 'https://source.unsplash.com/1200x800/?notre-dame-saigon', NULL, 4.6, ST_SetSRID(ST_MakePoint(106.6990, 10.7798), 4326)),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Bưu điện Thành phố Hồ Chí Minh', 'Công trình kiến trúc biểu tượng, thuận tiện kết hợp tuyến đi bộ trung tâm Quận 1.', '2 Công xã Paris, Quận 1, TP.HCM', '07:30', '18:00', 0, 'https://source.unsplash.com/1200x800/?saigon-central-post-office', NULL, 4.6, ST_SetSRID(ST_MakePoint(106.6992, 10.7797), 4326)),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Bitexco Financial Tower', 'Tòa nhà biểu tượng với đài quan sát ngắm toàn cảnh trung tâm TP.HCM.', '2 Hải Triều, Quận 1, TP.HCM', '09:30', '21:30', 240000, 'https://source.unsplash.com/1200x800/?bitexco,saigon', NULL, 4.5, ST_SetSRID(ST_MakePoint(106.7042, 10.7716), 4326)),
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Landmark 81', 'Tổ hợp cao tầng, mua sắm và giải trí nổi bật bên sông Sài Gòn.', '720A Điện Biên Phủ, Bình Thạnh, TP.HCM', '09:30', '22:00', 0, 'https://source.unsplash.com/1200x800/?landmark-81,saigon', NULL, 4.6, ST_SetSRID(ST_MakePoint(106.7219, 10.7947), 4326)),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Công viên Văn hóa Đầm Sen', 'Khu công viên và vui chơi lâu đời, phù hợp demo cụm điểm ngoài trung tâm.', '3 Hòa Bình, Quận 11, TP.HCM', '08:00', '18:00', 120000, 'https://source.unsplash.com/1200x800/?dam-sen-park', NULL, 4.3, ST_SetSRID(ST_MakePoint(106.6369, 10.7678), 4326)),

('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Hồ Gươm', 'Không gian đi bộ, cảnh quan hồ và biểu tượng trung tâm của Hà Nội.', 'Phường Hàng Trống, Hoàn Kiếm, Hà Nội', '00:00', '23:59', 0, 'https://source.unsplash.com/1200x800/?hoan-kiem-lake,hanoi', NULL, 4.8, ST_SetSRID(ST_MakePoint(105.8520, 21.0287), 4326)),
('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Văn Miếu - Quốc Tử Giám', 'Quần thể di tích giáo dục Nho học, điểm tham quan văn hóa tiêu biểu của Hà Nội.', '58 Quốc Tử Giám, Đống Đa, Hà Nội', '08:00', '17:00', 30000, 'https://source.unsplash.com/1200x800/?temple-of-literature,hanoi', NULL, 4.7, ST_SetSRID(ST_MakePoint(105.8356, 21.0280), 4326)),
('20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Lăng Chủ tịch Hồ Chí Minh', 'Công trình chính trị lịch sử quan trọng tại Quảng trường Ba Đình.', '2 Hùng Vương, Ba Đình, Hà Nội', '07:30', '11:00', 0, 'https://source.unsplash.com/1200x800/?ho-chi-minh-mausoleum,hanoi', NULL, 4.7, ST_SetSRID(ST_MakePoint(105.8342, 21.0368), 4326)),
('20000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Hoàng thành Thăng Long', 'Di sản văn hóa thế giới, phù hợp tuyến tham quan lịch sử khu Ba Đình.', '19C Hoàng Diệu, Ba Đình, Hà Nội', '08:00', '17:00', 30000, 'https://source.unsplash.com/1200x800/?imperial-citadel-thang-long', NULL, 4.6, ST_SetSRID(ST_MakePoint(105.8401, 21.0355), 4326)),
('20000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', 'Bảo tàng Dân tộc học Việt Nam', 'Bảo tàng trưng bày văn hóa các dân tộc Việt Nam, có khu ngoài trời rộng.', 'Nguyễn Văn Huyên, Cầu Giấy, Hà Nội', '08:30', '17:30', 40000, 'https://source.unsplash.com/1200x800/?vietnam-museum-ethnology', NULL, 4.6, ST_SetSRID(ST_MakePoint(105.7983, 21.0404), 4326)),

('20000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Bà Nà Hills', 'Khu du lịch núi nổi tiếng với Cầu Vàng, cáp treo và khí hậu mát mẻ.', 'Hòa Ninh, Hòa Vang, Đà Nẵng', '08:00', '17:00', 900000, 'https://source.unsplash.com/1200x800/?ba-na-hills,golden-bridge', NULL, 4.5, ST_SetSRID(ST_MakePoint(107.9960, 15.9970), 4326)),
('20000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 'Bãi biển Mỹ Khê', 'Bãi biển đô thị nổi tiếng, dễ kết hợp với nhà hàng và khách sạn ven biển.', 'Võ Nguyên Giáp, Sơn Trà, Đà Nẵng', '00:00', '23:59', 0, 'https://source.unsplash.com/1200x800/?my-khe-beach,danang', NULL, 4.7, ST_SetSRID(ST_MakePoint(108.2497, 16.0617), 4326)),
('20000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000007', 'Ngũ Hành Sơn', 'Cụm núi đá vôi, hang động và chùa, phù hợp tuyến du lịch phía nam Đà Nẵng.', '81 Huyền Trân Công Chúa, Ngũ Hành Sơn, Đà Nẵng', '07:00', '17:30', 40000, 'https://source.unsplash.com/1200x800/?marble-mountains,danang', NULL, 4.6, ST_SetSRID(ST_MakePoint(108.2647, 16.0044), 4326)),
('20000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000007', 'Bán đảo Sơn Trà', 'Không gian sinh thái ven biển với điểm ngắm cảnh, chùa Linh Ứng và rừng tự nhiên.', 'Sơn Trà, Đà Nẵng', '06:00', '18:00', 0, 'https://source.unsplash.com/1200x800/?son-tra-peninsula,danang', NULL, 4.7, ST_SetSRID(ST_MakePoint(108.3060, 16.1150), 4326)),
('20000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Asia Park Đà Nẵng', 'Khu vui chơi trong đô thị với vòng quay Sun Wheel, phù hợp demo điểm giải trí.', '1 Phan Đăng Lưu, Hải Châu, Đà Nẵng', '15:00', '22:00', 250000, 'https://source.unsplash.com/1200x800/?asia-park,danang', NULL, 4.3, ST_SetSRID(ST_MakePoint(108.2265, 16.0399), 4326)),

('20000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Kinh thành Huế', 'Quần thể di tích cố đô, điểm neo chính cho tuyến du lịch di sản Huế.', 'Phú Hậu, TP. Huế, Thừa Thiên Huế', '07:00', '17:30', 200000, 'https://source.unsplash.com/1200x800/?hue-imperial-city', NULL, 4.8, ST_SetSRID(ST_MakePoint(107.5779, 16.4691), 4326)),
('20000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Chùa Thiên Mụ', 'Ngôi chùa nổi tiếng bên sông Hương, thường được kết hợp với tuyến thuyền và di sản.', 'Đường Nguyễn Phúc Nguyên, TP. Huế', '06:00', '18:00', 0, 'https://source.unsplash.com/1200x800/?thien-mu-pagoda,hue', NULL, 4.7, ST_SetSRID(ST_MakePoint(107.5449, 16.4537), 4326)),
('20000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Lăng Khải Định', 'Lăng vua triều Nguyễn với kiến trúc giao thoa Đông Tây, nằm phía nam trung tâm Huế.', 'Xã Thủy Bằng, TP. Huế', '07:00', '17:30', 150000, 'https://source.unsplash.com/1200x800/?khai-dinh-tomb,hue', NULL, 4.6, ST_SetSRID(ST_MakePoint(107.5906, 16.3982), 4326)),
('20000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Lăng Minh Mạng', 'Không gian lăng tẩm rộng, nhiều hồ nước và trục cảnh quan đặc trưng của Huế.', 'Hương Thọ, TP. Huế', '07:00', '17:30', 150000, 'https://source.unsplash.com/1200x800/?minh-mang-tomb,hue', NULL, 4.6, ST_SetSRID(ST_MakePoint(107.5657, 16.3869), 4326)),
('20000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Cầu Trường Tiền', 'Cây cầu biểu tượng bắc qua sông Hương, đẹp về đêm và thuận tiện đi bộ trung tâm.', 'Trung tâm TP. Huế, Thừa Thiên Huế', '00:00', '23:59', 0, 'https://source.unsplash.com/1200x800/?truong-tien-bridge,hue', NULL, 4.5, ST_SetSRID(ST_MakePoint(107.5886, 16.4674), 4326));

-- ============================================================
-- INSERT service_facilities
-- At least 5 records per type: hotel, restaurant, parking, medical, gas_station.
-- ============================================================

INSERT INTO service_facilities (
  id, province_id, name, type, address, phone, rating, description, location_geom
) VALUES
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Rex Hotel Saigon', 'hotel', '141 Nguyễn Huệ, Quận 1, TP.HCM', '028-3829-2185', 4.5, 'Khách sạn trung tâm gần Dinh Độc Lập, Bưu điện và phố đi bộ Nguyễn Huệ.', ST_SetSRID(ST_MakePoint(106.7010, 10.7757), 4326)),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Sofitel Legend Metropole Hanoi', 'hotel', '15 Ngô Quyền, Hoàn Kiếm, Hà Nội', '024-3826-6919', 4.7, 'Khách sạn di sản gần Hồ Gươm và Nhà hát Lớn Hà Nội.', ST_SetSRID(ST_MakePoint(105.8562, 21.0254), 4326)),
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Hilton Da Nang', 'hotel', '50 Bạch Đằng, Hải Châu, Đà Nẵng', '0236-3874-000', 4.5, 'Khách sạn ven sông Hàn, thuận tiện đi Mỹ Khê và Asia Park.', ST_SetSRID(ST_MakePoint(108.2242, 16.0716), 4326)),
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'Azerai La Residence Hue', 'hotel', '5 Lê Lợi, TP. Huế', '0234-3837-475', 4.6, 'Khách sạn ven sông Hương, gần cầu Trường Tiền và Kinh thành Huế.', ST_SetSRID(ST_MakePoint(107.5820, 16.4583), 4326)),
('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Vinpearl Landmark 81 Autograph Collection', 'hotel', '720A Điện Biên Phủ, Bình Thạnh, TP.HCM', '028-3971-8888', 4.7, 'Khách sạn cao tầng trong tổ hợp Landmark 81.', ST_SetSRID(ST_MakePoint(106.7218, 10.7951), 4326)),

('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Nhà hàng Ngon 138', 'restaurant', '138 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM', '028-3825-7179', 4.3, 'Nhà hàng món Việt gần Dinh Độc Lập, phù hợp điểm dừng chân tuyến trung tâm.', ST_SetSRID(ST_MakePoint(106.6959, 10.7762), 4326)),
('30000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'Chả Cá Thăng Long', 'restaurant', '19 Đường Thành, Hoàn Kiếm, Hà Nội', '024-3824-5115', 4.4, 'Nhà hàng chả cá gần khu phố cổ và Hồ Gươm.', ST_SetSRID(ST_MakePoint(105.8467, 21.0317), 4326)),
('30000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 'Bé Mặn Hải Sản', 'restaurant', 'Lô 14 Hoàng Sa, Sơn Trà, Đà Nẵng', '0905-207-848', 4.2, 'Nhà hàng hải sản gần bãi biển Mỹ Khê và bán đảo Sơn Trà.', ST_SetSRID(ST_MakePoint(108.2482, 16.0792), 4326)),
('30000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004', 'Quán Hạnh Huế', 'restaurant', '11 Phó Đức Chính, TP. Huế', '0234-3833-552', 4.3, 'Quán đặc sản Huế gần trung tâm, thuận tiện sau khi tham quan cầu Trường Tiền.', ST_SetSRID(ST_MakePoint(107.5923, 16.4640), 4326)),
('30000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Cục Gạch Quán', 'restaurant', '10 Đặng Tất, Quận 1, TP.HCM', '028-3848-0144', 4.4, 'Nhà hàng món Việt trong không gian nhà cổ, cách cụm trung tâm Quận 1 không xa.', ST_SetSRID(ST_MakePoint(106.6962, 10.7928), 4326)),

('30000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Bãi giữ xe Công viên 30/4', 'parking', 'Lê Duẩn, Quận 1, TP.HCM', '028-0000-0011', 3.8, 'Bãi giữ xe gần Nhà thờ Đức Bà và Bưu điện Thành phố.', ST_SetSRID(ST_MakePoint(106.6984, 10.7807), 4326)),
('30000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000002', 'Bãi đỗ xe Tràng Tiền Plaza', 'parking', '24 Hai Bà Trưng, Hoàn Kiếm, Hà Nội', '024-0000-0012', 3.9, 'Bãi đỗ xe gần Hồ Gươm và khu phố đi bộ.', ST_SetSRID(ST_MakePoint(105.8548, 21.0244), 4326)),
('30000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', 'Bãi đỗ xe Bạch Đằng', 'parking', 'Bạch Đằng, Hải Châu, Đà Nẵng', '0236-0000-0013', 3.8, 'Bãi đỗ xe ven sông Hàn, gần trung tâm Đà Nẵng.', ST_SetSRID(ST_MakePoint(108.2238, 16.0690), 4326)),
('30000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000004', 'Bãi đỗ xe Kinh thành Huế', 'parking', 'Đoàn Thị Điểm, TP. Huế', '0234-0000-0014', 3.9, 'Bãi đỗ xe phục vụ khách tham quan Kinh thành Huế.', ST_SetSRID(ST_MakePoint(107.5797, 16.4710), 4326)),
('30000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000001', 'Bãi giữ xe Đầm Sen', 'parking', '3 Hòa Bình, Quận 11, TP.HCM', '028-0000-0015', 3.7, 'Bãi giữ xe gần Công viên Văn hóa Đầm Sen.', ST_SetSRID(ST_MakePoint(106.6378, 10.7688), 4326)),

('30000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000001', 'Bệnh viện Chợ Rẫy', 'medical', '201B Nguyễn Chí Thanh, Quận 5, TP.HCM', '028-3855-4137', 4.1, 'Cơ sở y tế lớn tại TP.HCM, dùng demo lớp hỗ trợ y tế.', ST_SetSRID(ST_MakePoint(106.6592, 10.7551), 4326)),
('30000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000002', 'Bệnh viện Bạch Mai', 'medical', '78 Giải Phóng, Đống Đa, Hà Nội', '024-3869-3731', 4.1, 'Bệnh viện lớn ở Hà Nội, dùng cho layer medical.', ST_SetSRID(ST_MakePoint(105.8414, 21.0003), 4326)),
('30000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000003', 'Bệnh viện Đà Nẵng', 'medical', '124 Hải Phòng, Hải Châu, Đà Nẵng', '0236-3821-118', 4.0, 'Cơ sở y tế trung tâm Đà Nẵng, gần sông Hàn.', ST_SetSRID(ST_MakePoint(108.2166, 16.0719), 4326)),
('30000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000004', 'Bệnh viện Trung ương Huế', 'medical', '16 Lê Lợi, TP. Huế', '0234-3822-325', 4.2, 'Bệnh viện lớn tại Huế, gần trung tâm và cầu Trường Tiền.', ST_SetSRID(ST_MakePoint(107.5924, 16.4639), 4326)),
('30000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', 'Vinmec Central Park', 'medical', '208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM', '028-3622-1166', 4.3, 'Bệnh viện gần Landmark 81 và khu Vinhomes Central Park.', ST_SetSRID(ST_MakePoint(106.7210, 10.7940), 4326)),

('30000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', 'Petrolimex Nguyễn Hữu Cảnh', 'gas_station', 'Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM', '028-0000-0021', 3.8, 'Cây xăng gần tuyến vào Landmark 81.', ST_SetSRID(ST_MakePoint(106.7188, 10.7921), 4326)),
('30000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000002', 'Petrolimex Trần Quang Khải', 'gas_station', 'Trần Quang Khải, Hoàn Kiếm, Hà Nội', '024-0000-0022', 3.8, 'Cây xăng gần khu Hoàn Kiếm, phục vụ demo route nội đô.', ST_SetSRID(ST_MakePoint(105.8578, 21.0285), 4326)),
('30000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000003', 'Petrolimex Hải Châu', 'gas_station', '2 Tháng 9, Hải Châu, Đà Nẵng', '0236-0000-0023', 3.7, 'Cây xăng gần Asia Park và trục ven sông.', ST_SetSRID(ST_MakePoint(108.2225, 16.0392), 4326)),
('30000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000004', 'Petrolimex Lê Lợi Huế', 'gas_station', 'Lê Lợi, TP. Huế', '0234-0000-0024', 3.8, 'Cây xăng gần trung tâm Huế và cầu Trường Tiền.', ST_SetSRID(ST_MakePoint(107.5898, 16.4625), 4326)),
('30000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000002', 'Petrolimex Tây Hồ', 'gas_station', 'Âu Cơ, Tây Hồ, Hà Nội', '024-0000-0025', 3.7, 'Cây xăng phía bắc trung tâm Hà Nội, dùng test dịch vụ xa cụm Hồ Gươm.', ST_SetSRID(ST_MakePoint(105.8368, 21.0621), 4326));

-- ============================================================
-- INSERT users
-- Password hash reused for demo accounts. Demo password depends on auth fixture.
-- ============================================================

INSERT INTO users (id, full_name, email, password_hash, role, avatar, birthday) VALUES
('40000000-0000-0000-0000-000000000001', 'Nguyễn Minh Anh', 'minhanh@gis.local', '$2b$10$dyJOKedwOaRBxQ8/XlW6Eu8JTFlsiAYPWyokcvj4gO9m.fDphDKuy', 'user', NULL, '1998-04-12'),
('40000000-0000-0000-0000-000000000002', 'Trần Hoàng Nam', 'hoangnam@gis.local', '$2b$10$dyJOKedwOaRBxQ8/XlW6Eu8JTFlsiAYPWyokcvj4gO9m.fDphDKuy', 'user', NULL, '1996-09-20'),
('40000000-0000-0000-0000-000000000003', 'Lê Thu Hà', 'thuha@gis.local', '$2b$10$dyJOKedwOaRBxQ8/XlW6Eu8JTFlsiAYPWyokcvj4gO9m.fDphDKuy', 'user', NULL, '2000-02-08'),
('40000000-0000-0000-0000-000000000004', 'Phạm Quốc Bảo', 'quocbao@gis.local', '$2b$10$dyJOKedwOaRBxQ8/XlW6Eu8JTFlsiAYPWyokcvj4gO9m.fDphDKuy', 'user', NULL, '1994-11-03'),
('40000000-0000-0000-0000-000000000005', 'Đặng Mai Linh', 'mailinh@gis.local', '$2b$10$dyJOKedwOaRBxQ8/XlW6Eu8JTFlsiAYPWyokcvj4gO9m.fDphDKuy', 'user', NULL, '2001-06-15'),
('40000000-0000-0000-0000-000000000006', 'Admin GIS Demo', 'admin@gis.local', '$2b$10$dyJOKedwOaRBxQ8/XlW6Eu8JTFlsiAYPWyokcvj4gO9m.fDphDKuy', 'admin', NULL, '1990-01-01');

-- ============================================================
-- INSERT tour_plans and tour_plan_details
-- ============================================================

INSERT INTO tour_plans (id, user_id, title, description, total_distance_km, estimated_duration_minutes) VALUES
('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Sài Gòn trung tâm 1 ngày', 'Tuyến đi bộ và taxi ngắn qua các biểu tượng trung tâm TP.HCM.', 8.50, 240),
('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'Hà Nội di sản nội đô', 'Tuyến tham quan Hồ Gươm, Văn Miếu, Lăng Bác và Hoàng thành.', 12.00, 360),
('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', 'Miền Trung biển và di sản', 'Tuyến dài từ Đà Nẵng đến Huế, phù hợp test OSRM đường dài.', 115.00, 240);

INSERT INTO tour_plan_details (tour_plan_id, destination_id, visit_order, note) VALUES
('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 1, 'Bắt đầu tại Dinh Độc Lập.'),
('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 2, 'Đi bộ sang Bưu điện Thành phố.'),
('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 3, 'Kết thúc tại Bitexco để ngắm thành phố.'),
('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007', 1, 'Dạo Hồ Gươm buổi sáng.'),
('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000008', 2, 'Tham quan Văn Miếu.'),
('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000009', 3, 'Ghé Lăng Chủ tịch Hồ Chí Minh.'),
('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000010', 4, 'Kết thúc tại Hoàng thành Thăng Long.'),
('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000013', 1, 'Bắt đầu ở bãi biển Mỹ Khê.'),
('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000014', 2, 'Đi Ngũ Hành Sơn.'),
('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000017', 3, 'Di chuyển ra Huế tham quan Kinh thành.'),
('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000018', 4, 'Kết thúc tại chùa Thiên Mụ.');

-- ============================================================
-- INSERT reviews
-- Two reviews for each tourist destination, respecting unique user/destination constraint.
-- ============================================================

INSERT INTO reviews (user_id, destination_id, content, score, status) VALUES
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Địa điểm đẹp, rất đáng tham quan nếu muốn hiểu thêm lịch sử Sài Gòn.', 5, 'published'),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Cuối tuần khá đông nhưng khuôn viên rộng và dễ đi theo nhóm.', 4, 'published'),
('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'Kiến trúc đẹp, vị trí trung tâm thuận tiện chụp ảnh và đi bộ.', 5, 'published'),
('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'Đang có khu vực bảo trì nên cần xem trước thông tin mở cửa.', 4, 'published'),
('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003', 'Bên trong bưu điện rất đẹp, phù hợp ghé nhanh trong tuyến Quận 1.', 5, 'published'),
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'Khách du lịch đông nhưng không gian vẫn dễ tham quan.', 4, 'published'),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', 'View đẹp nhưng giá vé lên đài quan sát hơi cao.', 4, 'published'),
('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', 'Nên đi buổi chiều để ngắm hoàng hôn và ánh đèn thành phố.', 5, 'published'),
('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000005', 'Không gian hiện đại, nhiều dịch vụ ăn uống và mua sắm.', 5, 'published'),
('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000005', 'Khu vực đường vào đôi lúc đông xe vào giờ cao điểm.', 4, 'published'),
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', 'Phù hợp gia đình có trẻ nhỏ, nhiều trò chơi dễ trải nghiệm.', 4, 'published'),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', 'Khuôn viên rộng, nên chuẩn bị nước và đi giày thoải mái.', 4, 'published'),
('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', 'Hồ Gươm rất đẹp vào sáng sớm, đi bộ quanh hồ rất dễ chịu.', 5, 'published'),
('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000007', 'Khu phố đi bộ đông vào cuối tuần nhưng không khí rất vui.', 4, 'published'),
('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000008', 'Không gian cổ kính, phù hợp học sinh sinh viên tham quan.', 5, 'published'),
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', 'Có nhiều góc chụp đẹp, nên đi sớm để tránh đông.', 4, 'published'),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000009', 'Trang nghiêm, cần chú ý quy định trang phục và thời gian mở cửa.', 5, 'published'),
('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000009', 'Khu Ba Đình rộng, kết hợp với Hoàng thành rất hợp lý.', 4, 'published'),
('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000010', 'Di tích rộng và có nhiều lớp thông tin lịch sử thú vị.', 5, 'published'),
('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000010', 'Nên dành ít nhất hai giờ để tham quan kỹ.', 4, 'published'),
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000011', 'Bảo tàng có khu ngoài trời rất hay, phù hợp đi cùng gia đình.', 5, 'published'),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000011', 'Nội dung trưng bày phong phú, nên đọc trước sơ đồ khu tham quan.', 4, 'published'),
('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000012', 'Cầu Vàng rất đẹp, thời tiết trên núi thay đổi nhanh.', 5, 'published'),
('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000012', 'Giá vé cao nhưng trải nghiệm cáp treo và cảnh quan đáng thử.', 4, 'published'),
('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000013', 'Bãi biển sạch, đẹp, thuận tiện tìm nhà hàng và khách sạn.', 5, 'published'),
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000013', 'Buổi chiều khá đông nhưng không khí rất thoải mái.', 4, 'published'),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000014', 'Hang động và chùa rất đẹp, cần chuẩn bị leo bậc thang.', 5, 'published'),
('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000014', 'Tầm nhìn từ trên núi rất đáng công đi.', 4, 'published'),
('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000015', 'Cảnh biển và rừng rất đẹp, nên đi ban ngày để an toàn.', 5, 'published'),
('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000015', 'Đường lên một số đoạn cong, cần lái xe cẩn thận.', 4, 'published'),
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000016', 'Phù hợp đi buổi tối, vòng quay nhìn thành phố khá đẹp.', 4, 'published'),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000016', 'Nhiều trò chơi, nên kiểm tra lịch hoạt động trước khi đi.', 4, 'published'),
('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000017', 'Kinh thành Huế rất rộng, nên thuê thuyết minh hoặc audio guide.', 5, 'published'),
('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000017', 'Địa điểm di sản ấn tượng, nhưng cần tránh giờ nắng gắt.', 5, 'published'),
('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000018', 'Chùa yên tĩnh, cảnh sông Hương rất đẹp.', 5, 'published'),
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000018', 'Nên kết hợp đi thuyền trên sông Hương để trọn trải nghiệm.', 4, 'published'),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000019', 'Kiến trúc lăng rất độc đáo, nhiều chi tiết trang trí đẹp.', 5, 'published'),
('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000019', 'Có nhiều bậc thang, nên chuẩn bị giày phù hợp.', 4, 'published'),
('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000020', 'Không gian xanh và hồ nước rất thư thái.', 5, 'published'),
('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000020', 'Điểm đến hơi xa trung tâm nhưng rất đáng ghé.', 4, 'published'),
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000021', 'Cầu đẹp nhất vào buổi tối khi lên đèn.', 5, 'published'),
('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000021', 'Vị trí trung tâm, dễ kết hợp đi bộ dọc sông Hương.', 4, 'published');

-- ============================================================
-- INSERT notifications
-- ============================================================

INSERT INTO notifications (destination_id, title, content, type, status) VALUES
('20000000-0000-0000-0000-000000000001', 'Khuyến nghị đặt vé sớm', 'Dinh Độc Lập thường đông khách vào cuối tuần, nên đi sớm để tránh xếp hàng.', 'news', 'active'),
('20000000-0000-0000-0000-000000000012', 'Lưu ý thời tiết trên núi', 'Bà Nà Hills có thể nhiều mây và mưa nhẹ, du khách nên chuẩn bị áo khoác.', 'warning', 'active'),
('20000000-0000-0000-0000-000000000017', 'Giờ tham quan mùa cao điểm', 'Kinh thành Huế có lượng khách cao vào mùa lễ hội, nên kiểm tra lịch trước khi đi.', 'news', 'active'),
(NULL, 'Dữ liệu demo WebGIS Việt Nam', 'Seed đã có cụm TP.HCM, Hà Nội, Đà Nẵng và Thừa Thiên Huế để test bản đồ, route và detail.', 'news', 'active');

-- ============================================================
-- INSERT weather_info
-- ============================================================

INSERT INTO weather_info (destination_id, temperature, humidity, weather_status, wind_speed, location_geom, observed_at) VALUES
('20000000-0000-0000-0000-000000000001', 32.1, 70, 'Sunny', 8.2, ST_SetSRID(ST_MakePoint(106.6953, 10.7770), 4326), now() - interval '20 minutes'),
('20000000-0000-0000-0000-000000000002', 31.8, 72, 'Cloudy', 7.8, ST_SetSRID(ST_MakePoint(106.6990, 10.7798), 4326), now() - interval '25 minutes'),
('20000000-0000-0000-0000-000000000003', 31.9, 71, 'Cloudy', 7.5, ST_SetSRID(ST_MakePoint(106.6992, 10.7797), 4326), now() - interval '30 minutes'),
('20000000-0000-0000-0000-000000000004', 32.5, 68, 'Sunny', 9.0, ST_SetSRID(ST_MakePoint(106.7042, 10.7716), 4326), now() - interval '35 minutes'),
('20000000-0000-0000-0000-000000000005', 32.3, 69, 'Sunny', 8.8, ST_SetSRID(ST_MakePoint(106.7219, 10.7947), 4326), now() - interval '40 minutes'),
('20000000-0000-0000-0000-000000000006', 32.0, 74, 'Cloudy', 6.9, ST_SetSRID(ST_MakePoint(106.6369, 10.7678), 4326), now() - interval '45 minutes'),
('20000000-0000-0000-0000-000000000007', 27.8, 76, 'Cloudy', 5.6, ST_SetSRID(ST_MakePoint(105.8520, 21.0287), 4326), now() - interval '20 minutes'),
('20000000-0000-0000-0000-000000000008', 28.0, 75, 'Cloudy', 5.4, ST_SetSRID(ST_MakePoint(105.8356, 21.0280), 4326), now() - interval '25 minutes'),
('20000000-0000-0000-0000-000000000009', 27.6, 77, 'Rainy', 6.2, ST_SetSRID(ST_MakePoint(105.8342, 21.0368), 4326), now() - interval '30 minutes'),
('20000000-0000-0000-0000-000000000010', 27.7, 76, 'Rainy', 6.0, ST_SetSRID(ST_MakePoint(105.8401, 21.0355), 4326), now() - interval '35 minutes'),
('20000000-0000-0000-0000-000000000011', 27.5, 78, 'Cloudy', 5.8, ST_SetSRID(ST_MakePoint(105.7983, 21.0404), 4326), now() - interval '40 minutes'),
('20000000-0000-0000-0000-000000000012', 22.5, 86, 'Cloudy', 10.1, ST_SetSRID(ST_MakePoint(107.9960, 15.9970), 4326), now() - interval '20 minutes'),
('20000000-0000-0000-0000-000000000013', 30.2, 73, 'Sunny', 9.7, ST_SetSRID(ST_MakePoint(108.2497, 16.0617), 4326), now() - interval '25 minutes'),
('20000000-0000-0000-0000-000000000014', 30.5, 72, 'Sunny', 8.9, ST_SetSRID(ST_MakePoint(108.2647, 16.0044), 4326), now() - interval '30 minutes'),
('20000000-0000-0000-0000-000000000015', 29.4, 78, 'Cloudy', 11.2, ST_SetSRID(ST_MakePoint(108.3060, 16.1150), 4326), now() - interval '35 minutes'),
('20000000-0000-0000-0000-000000000016', 30.0, 74, 'Sunny', 8.5, ST_SetSRID(ST_MakePoint(108.2265, 16.0399), 4326), now() - interval '40 minutes'),
('20000000-0000-0000-0000-000000000017', 29.2, 80, 'Cloudy', 6.4, ST_SetSRID(ST_MakePoint(107.5779, 16.4691), 4326), now() - interval '20 minutes'),
('20000000-0000-0000-0000-000000000018', 28.9, 81, 'Cloudy', 6.6, ST_SetSRID(ST_MakePoint(107.5449, 16.4537), 4326), now() - interval '25 minutes'),
('20000000-0000-0000-0000-000000000019', 29.5, 79, 'Sunny', 6.1, ST_SetSRID(ST_MakePoint(107.5906, 16.3982), 4326), now() - interval '30 minutes'),
('20000000-0000-0000-0000-000000000020', 29.1, 82, 'Rainy', 5.9, ST_SetSRID(ST_MakePoint(107.5657, 16.3869), 4326), now() - interval '35 minutes'),
('20000000-0000-0000-0000-000000000021', 29.3, 80, 'Cloudy', 6.3, ST_SetSRID(ST_MakePoint(107.5886, 16.4674), 4326), now() - interval '40 minutes');

-- ============================================================
-- INSERT traffic_info
-- ============================================================

INSERT INTO traffic_info (destination_id, congestion_level, status, description, location_geom, observed_at) VALUES
('20000000-0000-0000-0000-000000000001', 3, 'Đông đúc', 'Khu vực Nam Kỳ Khởi Nghĩa đông xe vào giờ cao điểm.', ST_SetSRID(ST_MakePoint(106.6953, 10.7770), 4326), now() - interval '10 minutes'),
('20000000-0000-0000-0000-000000000002', 2, 'Kẹt xe nhẹ', 'Đường quanh Công xã Paris có nhiều khách du lịch dừng chụp ảnh.', ST_SetSRID(ST_MakePoint(106.6990, 10.7798), 4326), now() - interval '12 minutes'),
('20000000-0000-0000-0000-000000000003', 2, 'Kẹt xe nhẹ', 'Khu vực trước Bưu điện có xe du lịch đón trả khách.', ST_SetSRID(ST_MakePoint(106.6992, 10.7797), 4326), now() - interval '14 minutes'),
('20000000-0000-0000-0000-000000000004', 3, 'Đông đúc', 'Khu tài chính Quận 1 đông vào cuối giờ chiều.', ST_SetSRID(ST_MakePoint(106.7042, 10.7716), 4326), now() - interval '16 minutes'),
('20000000-0000-0000-0000-000000000005', 4, 'Kẹt xe nhẹ', 'Nguyễn Hữu Cảnh thường đông xe hướng vào Landmark 81.', ST_SetSRID(ST_MakePoint(106.7219, 10.7947), 4326), now() - interval '18 minutes'),
('20000000-0000-0000-0000-000000000006', 2, 'Đường thông thoáng', 'Khu vực Đầm Sen ổn định ngoài khung giờ tan tầm.', ST_SetSRID(ST_MakePoint(106.6369, 10.7678), 4326), now() - interval '20 minutes'),
('20000000-0000-0000-0000-000000000007', 3, 'Đông đúc', 'Khu Hồ Gươm đông khách đi bộ vào cuối tuần.', ST_SetSRID(ST_MakePoint(105.8520, 21.0287), 4326), now() - interval '10 minutes'),
('20000000-0000-0000-0000-000000000008', 2, 'Đường thông thoáng', 'Khu Văn Miếu lưu lượng xe vừa phải.', ST_SetSRID(ST_MakePoint(105.8356, 21.0280), 4326), now() - interval '12 minutes'),
('20000000-0000-0000-0000-000000000009', 3, 'Đông đúc', 'Khu Ba Đình đông đoàn tham quan buổi sáng.', ST_SetSRID(ST_MakePoint(105.8342, 21.0368), 4326), now() - interval '14 minutes'),
('20000000-0000-0000-0000-000000000010', 2, 'Đường thông thoáng', 'Hoàng Diệu di chuyển ổn định, dễ kết hợp tuyến đi bộ.', ST_SetSRID(ST_MakePoint(105.8401, 21.0355), 4326), now() - interval '16 minutes'),
('20000000-0000-0000-0000-000000000011', 2, 'Kẹt xe nhẹ', 'Nguyễn Văn Huyên có thể đông xe giờ tan học.', ST_SetSRID(ST_MakePoint(105.7983, 21.0404), 4326), now() - interval '18 minutes'),
('20000000-0000-0000-0000-000000000012', 2, 'Đường thông thoáng', 'Tuyến lên Bà Nà ổn định, cần lưu ý thời tiết trên núi.', ST_SetSRID(ST_MakePoint(107.9960, 15.9970), 4326), now() - interval '10 minutes'),
('20000000-0000-0000-0000-000000000013', 3, 'Đông đúc', 'Đường Võ Nguyên Giáp đông khách vào buổi chiều.', ST_SetSRID(ST_MakePoint(108.2497, 16.0617), 4326), now() - interval '12 minutes'),
('20000000-0000-0000-0000-000000000014', 2, 'Đường thông thoáng', 'Khu Ngũ Hành Sơn dễ di chuyển ngoài mùa cao điểm.', ST_SetSRID(ST_MakePoint(108.2647, 16.0044), 4326), now() - interval '14 minutes'),
('20000000-0000-0000-0000-000000000015', 2, 'Đường thông thoáng', 'Đường lên Sơn Trà thoáng nhưng có nhiều đoạn cua.', ST_SetSRID(ST_MakePoint(108.3060, 16.1150), 4326), now() - interval '16 minutes'),
('20000000-0000-0000-0000-000000000016', 3, 'Kẹt xe nhẹ', 'Khu Asia Park đông hơn vào buổi tối và cuối tuần.', ST_SetSRID(ST_MakePoint(108.2265, 16.0399), 4326), now() - interval '18 minutes'),
('20000000-0000-0000-0000-000000000017', 3, 'Đông đúc', 'Khu Kinh thành Huế đông đoàn tham quan vào buổi sáng.', ST_SetSRID(ST_MakePoint(107.5779, 16.4691), 4326), now() - interval '10 minutes'),
('20000000-0000-0000-0000-000000000018', 2, 'Đường thông thoáng', 'Tuyến ven sông đến chùa Thiên Mụ thường dễ đi.', ST_SetSRID(ST_MakePoint(107.5449, 16.4537), 4326), now() - interval '12 minutes'),
('20000000-0000-0000-0000-000000000019', 2, 'Kẹt xe nhẹ', 'Đường vào lăng có thể đông xe du lịch theo đoàn.', ST_SetSRID(ST_MakePoint(107.5906, 16.3982), 4326), now() - interval '14 minutes'),
('20000000-0000-0000-0000-000000000020', 1, 'Đường thông thoáng', 'Khu lăng Minh Mạng xa trung tâm, lưu lượng xe thấp.', ST_SetSRID(ST_MakePoint(107.5657, 16.3869), 4326), now() - interval '16 minutes'),
('20000000-0000-0000-0000-000000000021', 3, 'Đông đúc', 'Khu cầu Trường Tiền đông người đi bộ vào buổi tối.', ST_SetSRID(ST_MakePoint(107.5886, 16.4674), 4326), now() - interval '18 minutes');

COMMIT;
