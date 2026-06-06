-- Rich demo seed for the 2D GIS tourism project.
-- Password for every seeded account: Password123!
--
-- Image audit:
-- - Quang Tri coast/fishing boat: https://unsplash.com/photos/two-fishermen-on-a-blue-boat-with-a-flag-fI05-1R9WNU
-- - Hue Imperial City: https://unsplash.com/photos/a-large-building-with-a-tower-in-the-background-cxjgyw3GrTU
-- - Hue pagoda/lăng tẩm: verified Hue/Thua Thien Hue Unsplash assets.
-- - Da Nang Golden Bridge: https://unsplash.com/photos/giant-hands-support-a-golden-bridge-in-vietnam-pXiXeosLOAk
-- - Hoi An Ancient Town: https://unsplash.com/photos/a-street-with-buildings-and-lanterns-hanging-from-the-ceiling-1YwZh1zQ-qc
-- - My Khe Beach: https://unsplash.com/photos/a-beach-with-a-lot-of-people-on-it-Mpow32rPgAg
-- - Marble Mountains: https://unsplash.com/photos/brown-and-black-rock-formation-C4MXKa5_fFE
-- - Dragon Bridge: https://unsplash.com/photos/a-bridge-lit-up-at-night-over-a-body-of-water-5tkmOEar4wU
-- - Minh Mang Tomb: https://unsplash.com/photos/a-stone-walkway-leading-to-a-building-with-a-pagoda-in-the-background-zVH6fbSMU9A
-- - My Son Sanctuary: https://unsplash.com/photos/a-bunch-of-bricks-that-are-stacked-together-NyMQ9w7gDBA
-- - An Bang Beach: https://unsplash.com/photos/a-small-boat-floating-on-top-of-a-large-body-of-water-oriLSL62wz8
-- - Hoi An lantern street: https://unsplash.com/photos/colorful-lanterns-hang-from-trees-and-buildings-tj9LPxkFRx0
--
-- This file intentionally avoids source.unsplash.com because that endpoint is random and
-- can return undefined or geographically wrong images.

TRUNCATE TABLE
  traffic_info,
  weather_info,
  notifications,
  reviews,
  tour_plan_details,
  tour_plans,
  service_facilities,
  tourist_destinations,
  destination_categories,
  users,
  provinces
RESTART IDENTITY CASCADE;

INSERT INTO provinces (id, name, code, description, boundary_geom) VALUES
('01000000-0000-4000-8000-000000000001', 'Quảng Trị', 'QT', 'Không gian du lịch lịch sử, biển và cửa ngõ tuyến hành lang Đông Tây.', ST_SetSRID(ST_GeomFromText('POLYGON((106.55 16.30, 107.45 16.30, 107.45 17.25, 106.55 17.25, 106.55 16.30))'), 4326)),
('01000000-0000-4000-8000-000000000002', 'Thừa Thiên Huế', 'TTH', 'Vùng di sản cố đô, sông Hương, đầm phá và các tuyến tham quan văn hóa.', ST_SetSRID(ST_GeomFromText('POLYGON((107.15 15.95, 108.20 15.95, 108.20 16.80, 107.15 16.80, 107.15 15.95))'), 4326)),
('01000000-0000-4000-8000-000000000003', 'Đà Nẵng', 'DNG', 'Đô thị biển, trung tâm dịch vụ và điểm trung chuyển du lịch miền Trung.', ST_SetSRID(ST_GeomFromText('POLYGON((107.80 15.85, 108.35 15.85, 108.35 16.25, 107.80 16.25, 107.80 15.85))'), 4326)),
('01000000-0000-4000-8000-000000000004', 'Quảng Nam', 'QNM', 'Không gian di sản Hội An - Mỹ Sơn, làng nghề, biển và du lịch cộng đồng.', ST_SetSRID(ST_GeomFromText('POLYGON((107.20 15.15, 108.75 15.15, 108.75 16.05, 107.20 16.05, 107.20 15.15))'), 4326));

INSERT INTO destination_categories (id, name, description) VALUES
('02000000-0000-4000-8000-000000000001', 'Di sản văn hóa', 'Di sản, đô thị cổ, công trình kiến trúc và không gian văn hóa.'),
('02000000-0000-4000-8000-000000000002', 'Di tích lịch sử', 'Điểm đến gắn với lịch sử, chiến tranh và ký ức địa phương.'),
('02000000-0000-4000-8000-000000000003', 'Bãi biển', 'Bãi tắm, cửa biển và hoạt động ven biển.'),
('02000000-0000-4000-8000-000000000004', 'Sinh thái', 'Đầm phá, núi, rừng, bán đảo và trải nghiệm thiên nhiên.'),
('02000000-0000-4000-8000-000000000005', 'Tâm linh', 'Chùa, nhà thờ, thánh địa và không gian tín ngưỡng.'),
('02000000-0000-4000-8000-000000000006', 'Ẩm thực', 'Khu vực trải nghiệm đặc sản địa phương.'),
('02000000-0000-4000-8000-000000000007', 'Bảo tàng', 'Trưng bày, giáo dục di sản và dữ liệu tham quan trong nhà.'),
('02000000-0000-4000-8000-000000000008', 'Giải trí', 'Khu vui chơi, cáp treo, show diễn và tổ hợp dịch vụ.');

INSERT INTO tourist_destinations
(id, province_id, category_id, name, description, address, open_time, close_time, ticket_price, image_url, rating, location_geom)
VALUES
('03000000-0000-4000-8000-000000000001', '01000000-0000-4000-8000-000000000001', '02000000-0000-4000-8000-000000000003', 'Biển Cửa Việt', 'Cửa biển lớn của Quảng Trị, phù hợp theo dõi du lịch biển, mật độ khách theo mùa và rủi ro thời tiết ven biển.', 'Thị trấn Cửa Việt, Gio Linh, Quảng Trị', '05:00', '22:00', 0, 'https://images.unsplash.com/photo-1774007685362-544ef150162e?auto=format&fit=crop&w=1600&q=80', 4.5, ST_SetSRID(ST_MakePoint(107.1670, 16.9090), 4326)),
('03000000-0000-4000-8000-000000000002', '01000000-0000-4000-8000-000000000001', '02000000-0000-4000-8000-000000000003', 'Bãi biển Cửa Tùng', 'Bãi biển phía bắc tỉnh, thường được ghép tuyến với Vịnh Mốc và các điểm lịch sử ven biển.', 'Thị trấn Cửa Tùng, Vĩnh Linh, Quảng Trị', '05:00', '21:00', 0, 'https://images.unsplash.com/photo-1774007685362-544ef150162e?auto=format&fit=crop&w=1600&q=80', 4.3, ST_SetSRID(ST_MakePoint(107.1000, 17.0000), 4326)),
('03000000-0000-4000-8000-000000000003', '01000000-0000-4000-8000-000000000001', '02000000-0000-4000-8000-000000000004', 'Làng biển Gio Hải', 'Điểm quan sát sinh kế ven biển, phù hợp demo lớp dữ liệu dịch vụ, thời tiết và giao thông theo thời gian.', 'Xã Gio Hải, Gio Linh, Quảng Trị', '05:00', '20:00', 0, 'https://images.unsplash.com/photo-1774007685362-544ef150162e?auto=format&fit=crop&w=1600&q=80', 4.1, ST_SetSRID(ST_MakePoint(107.1440, 16.9300), 4326)),
('03000000-0000-4000-8000-000000000004', '01000000-0000-4000-8000-000000000001', '02000000-0000-4000-8000-000000000003', 'Cảng cá Cửa Việt', 'Nút dịch vụ hậu cần ven biển, có thể dùng để phân tích luồng di chuyển và mật độ hoạt động theo khung giờ.', 'Khu cảng Cửa Việt, Quảng Trị', '04:30', '18:00', 0, 'https://images.unsplash.com/photo-1774007685362-544ef150162e?auto=format&fit=crop&w=1600&q=80', 4.0, ST_SetSRID(ST_MakePoint(107.1760, 16.9010), 4326)),
('03000000-0000-4000-8000-000000000005', '01000000-0000-4000-8000-000000000002', '02000000-0000-4000-8000-000000000001', 'Kinh thành Huế', 'Không gian di sản trọng điểm của cố đô, phù hợp quản lý điểm tham quan, vé, đánh giá và biến động khách.', 'Phường Thuận Thành, thành phố Huế', '07:00', '17:30', 200000, 'https://images.unsplash.com/photo-1567272131881-8ce2275deb67?auto=format&fit=crop&w=1600&q=80', 4.8, ST_SetSRID(ST_MakePoint(107.5775, 16.4692), 4326)),
('03000000-0000-4000-8000-000000000006', '01000000-0000-4000-8000-000000000002', '02000000-0000-4000-8000-000000000005', 'Chùa Thiên Mụ', 'Biểu tượng tâm linh bên sông Hương, thường nằm trong tuyến city tour Huế nửa ngày.', 'Đường Nguyễn Phúc Nguyên, thành phố Huế', '06:00', '18:00', 0, 'https://images.unsplash.com/photo-1674798201360-745535e67e6e?auto=format&fit=crop&w=1600&q=80', 4.7, ST_SetSRID(ST_MakePoint(107.5450, 16.4539), 4326)),
('03000000-0000-4000-8000-000000000007', '01000000-0000-4000-8000-000000000002', '02000000-0000-4000-8000-000000000001', 'Đại Nội Huế - Ngọ Môn', 'Cổng chính của Hoàng thành, phù hợp mô phỏng tuyến tham quan đi bộ và phân cụm điểm check-in.', 'Khu Đại Nội, thành phố Huế', '07:00', '17:30', 200000, 'https://images.unsplash.com/photo-1567272131881-8ce2275deb67?auto=format&fit=crop&w=1600&q=80', 4.7, ST_SetSRID(ST_MakePoint(107.5788, 16.4677), 4326)),
('03000000-0000-4000-8000-000000000008', '01000000-0000-4000-8000-000000000002', '02000000-0000-4000-8000-000000000004', 'Sông Hương trung tâm Huế', 'Trục cảnh quan dùng để minh họa lớp quan sát thời tiết, sự kiện và dịch vụ ven sông.', 'Khu vực cầu Trường Tiền, thành phố Huế', '00:00', '23:59', 0, 'https://images.unsplash.com/photo-1567272131881-8ce2275deb67?auto=format&fit=crop&w=1600&q=80', 4.5, ST_SetSRID(ST_MakePoint(107.5890, 16.4665), 4326)),
('03000000-0000-4000-8000-000000000009', '01000000-0000-4000-8000-000000000003', '02000000-0000-4000-8000-000000000008', 'Cầu Vàng Bà Nà Hills', 'Điểm đến biểu tượng trên tuyến Bà Nà, cần quản lý vé, khung giờ cao điểm và điều kiện thời tiết núi.', 'Khu du lịch Bà Nà Hills, Hòa Vang, Đà Nẵng', '08:00', '17:00', 900000, 'https://images.unsplash.com/photo-1747137129095-b693a7ad08d0?auto=format&fit=crop&w=1600&q=80', 4.8, ST_SetSRID(ST_MakePoint(107.9960, 15.9950), 4326)),
('03000000-0000-4000-8000-000000000010', '01000000-0000-4000-8000-000000000003', '02000000-0000-4000-8000-000000000008', 'Bà Nà Hills Fantasy Park', 'Tổ hợp vui chơi trong nhà, phù hợp quản trị dịch vụ, sức chứa và kế hoạch tour gia đình.', 'Khu du lịch Bà Nà Hills, Đà Nẵng', '08:00', '17:00', 900000, 'https://images.unsplash.com/photo-1747137129095-b693a7ad08d0?auto=format&fit=crop&w=1600&q=80', 4.6, ST_SetSRID(ST_MakePoint(107.9990, 15.9975), 4326)),
('03000000-0000-4000-8000-000000000011', '01000000-0000-4000-8000-000000000003', '02000000-0000-4000-8000-000000000004', 'Tuyến cáp treo Bà Nà', 'Hạ tầng di chuyển lên núi, giúp demo dữ liệu giao thông và điều kiện vận hành theo thời gian.', 'Bà Nà - Núi Chúa, Đà Nẵng', '08:00', '17:00', 900000, 'https://images.unsplash.com/photo-1747137129095-b693a7ad08d0?auto=format&fit=crop&w=1600&q=80', 4.6, ST_SetSRID(ST_MakePoint(107.9935, 15.9985), 4326)),
('03000000-0000-4000-8000-000000000012', '01000000-0000-4000-8000-000000000003', '02000000-0000-4000-8000-000000000004', 'Vườn hoa Le Jardin d''Amour', 'Cụm cảnh quan trong Bà Nà, phù hợp gắn dữ liệu thời tiết, lượt khách và tuyến tham quan ngắn.', 'Bà Nà Hills, Hòa Vang, Đà Nẵng', '08:00', '17:00', 900000, 'https://images.unsplash.com/photo-1747137129095-b693a7ad08d0?auto=format&fit=crop&w=1600&q=80', 4.5, ST_SetSRID(ST_MakePoint(107.9974, 15.9964), 4326)),
('03000000-0000-4000-8000-000000000013', '01000000-0000-4000-8000-000000000004', '02000000-0000-4000-8000-000000000001', 'Phố cổ Hội An', 'Di sản đô thị cổ với mật độ điểm dịch vụ cao, phù hợp mô phỏng dữ liệu khách theo giờ và tuyến đi bộ.', 'Phường Minh An, Hội An, Quảng Nam', '07:00', '22:00', 120000, 'https://images.unsplash.com/photo-1761150285834-7ab9ce6dbfd4?auto=format&fit=crop&w=1600&q=80', 4.9, ST_SetSRID(ST_MakePoint(108.3278, 15.8801), 4326)),
('03000000-0000-4000-8000-000000000014', '01000000-0000-4000-8000-000000000004', '02000000-0000-4000-8000-000000000001', 'Chùa Cầu Hội An', 'Biểu tượng kiến trúc trong lõi phố cổ, phù hợp quản lý điểm check-in và luồng khách đi bộ.', 'Đường Nguyễn Thị Minh Khai, Hội An', '07:00', '21:00', 120000, 'https://images.unsplash.com/photo-1761150285834-7ab9ce6dbfd4?auto=format&fit=crop&w=1600&q=80', 4.8, ST_SetSRID(ST_MakePoint(108.3269, 15.8779), 4326)),
('03000000-0000-4000-8000-000000000015', '01000000-0000-4000-8000-000000000004', '02000000-0000-4000-8000-000000000006', 'Chợ đêm Hội An', 'Không gian ẩm thực và mua sắm buổi tối, phù hợp demo dữ liệu hoạt động thay đổi theo thời gian.', 'Khu An Hội, Hội An, Quảng Nam', '17:00', '23:00', 0, 'https://images.unsplash.com/photo-1761150285834-7ab9ce6dbfd4?auto=format&fit=crop&w=1600&q=80', 4.6, ST_SetSRID(ST_MakePoint(108.3250, 15.8760), 4326)),
('03000000-0000-4000-8000-000000000016', '01000000-0000-4000-8000-000000000004', '02000000-0000-4000-8000-000000000004', 'Bến thuyền sông Hoài', 'Điểm trải nghiệm thuyền và đèn hoa đăng, dùng tốt cho lớp dữ liệu dịch vụ, thời tiết và khung giờ đông khách.', 'Bờ sông Hoài, Hội An, Quảng Nam', '16:00', '22:30', 150000, 'https://images.unsplash.com/photo-1664650440553-ab53804814b3?auto=format&fit=crop&w=1600&q=80', 4.5, ST_SetSRID(ST_MakePoint(108.3260, 15.8752), 4326));

INSERT INTO service_facilities
(id, province_id, name, type, address, phone, rating, description, location_geom)
VALUES
('04000000-0000-4000-8000-000000000001', '01000000-0000-4000-8000-000000000001', 'Cửa Việt Beach Resort', 'hotel', 'Cửa Việt, Gio Linh, Quảng Trị', '0233 381 1001', 4.3, 'Lưu trú sát biển, phù hợp tour nghỉ dưỡng ngắn ngày.', ST_SetSRID(ST_MakePoint(107.1645, 16.9075), 4326)),
('04000000-0000-4000-8000-000000000002', '01000000-0000-4000-8000-000000000001', 'Nhà hàng Hải sản Cửa Việt', 'restaurant', 'Khu du lịch Cửa Việt, Quảng Trị', '0233 382 2211', 4.4, 'Nhà hàng hải sản ven biển.', ST_SetSRID(ST_MakePoint(107.1680, 16.9060), 4326)),
('04000000-0000-4000-8000-000000000003', '01000000-0000-4000-8000-000000000001', 'Bãi đỗ xe Cửa Tùng', 'parking', 'Cửa Tùng, Vĩnh Linh', '0233 377 9000', 4.0, 'Bãi đỗ xe cho xe khách và xe cá nhân.', ST_SetSRID(ST_MakePoint(107.0990, 16.9985), 4326)),
('04000000-0000-4000-8000-000000000004', '01000000-0000-4000-8000-000000000001', 'Trạm y tế Gio Hải', 'medical', 'Gio Hải, Gio Linh', '0233 383 0115', 4.1, 'Điểm hỗ trợ y tế gần khu biển.', ST_SetSRID(ST_MakePoint(107.1400, 16.9280), 4326)),
('04000000-0000-4000-8000-000000000005', '01000000-0000-4000-8000-000000000001', 'Cây xăng Cửa Việt', 'gas_station', 'Đường ven biển Cửa Việt', '0233 385 7788', 4.0, 'Trạm nhiên liệu gần tuyến du lịch ven biển.', ST_SetSRID(ST_MakePoint(107.1600, 16.9000), 4326)),
('04000000-0000-4000-8000-000000000006', '01000000-0000-4000-8000-000000000002', 'Khách sạn Morin Huế', 'hotel', '30 Lê Lợi, Huế', '0234 382 3526', 4.6, 'Khách sạn trung tâm gần sông Hương.', ST_SetSRID(ST_MakePoint(107.5900, 16.4668), 4326)),
('04000000-0000-4000-8000-000000000007', '01000000-0000-4000-8000-000000000002', 'Nhà hàng Cơm Huế Cố Đô', 'restaurant', 'Trung tâm thành phố Huế', '0234 399 2001', 4.5, 'Ẩm thực Huế cho nhóm tour.', ST_SetSRID(ST_MakePoint(107.5840, 16.4640), 4326)),
('04000000-0000-4000-8000-000000000008', '01000000-0000-4000-8000-000000000002', 'Bãi đỗ xe Đại Nội', 'parking', 'Cửa Ngăn, Đại Nội Huế', '0234 355 1000', 4.2, 'Bãi đỗ xe gần Hoàng thành.', ST_SetSRID(ST_MakePoint(107.5798, 16.4688), 4326)),
('04000000-0000-4000-8000-000000000009', '01000000-0000-4000-8000-000000000002', 'Bệnh viện Trung ương Huế', 'medical', '16 Lê Lợi, Huế', '0234 382 2325', 4.5, 'Cơ sở y tế lớn trong vùng lõi đô thị.', ST_SetSRID(ST_MakePoint(107.5908, 16.4623), 4326)),
('04000000-0000-4000-8000-000000000010', '01000000-0000-4000-8000-000000000002', 'Trạm xăng Lê Duẩn Huế', 'gas_station', 'Đường Lê Duẩn, Huế', '0234 352 6789', 4.0, 'Trạm nhiên liệu gần Đại Nội.', ST_SetSRID(ST_MakePoint(107.5770, 16.4735), 4326)),
('04000000-0000-4000-8000-000000000011', '01000000-0000-4000-8000-000000000003', 'Mercure Danang French Village Bana Hills', 'hotel', 'Bà Nà Hills, Hòa Vang', '0236 379 9888', 4.7, 'Lưu trú trên đỉnh Bà Nà.', ST_SetSRID(ST_MakePoint(107.9980, 15.9960), 4326)),
('04000000-0000-4000-8000-000000000012', '01000000-0000-4000-8000-000000000003', 'Nhà hàng Beer Plaza Bà Nà', 'restaurant', 'Bà Nà Hills, Đà Nẵng', '0236 379 1888', 4.4, 'Không gian ăn uống cho đoàn đông.', ST_SetSRID(ST_MakePoint(107.9970, 15.9952), 4326)),
('04000000-0000-4000-8000-000000000013', '01000000-0000-4000-8000-000000000003', 'Bãi đỗ xe Suối Mơ Bà Nà', 'parking', 'Chân núi Bà Nà, Hòa Vang', '0236 379 1000', 4.3, 'Điểm đỗ xe trước khi lên cáp treo.', ST_SetSRID(ST_MakePoint(108.0160, 15.9970), 4326)),
('04000000-0000-4000-8000-000000000014', '01000000-0000-4000-8000-000000000003', 'Phòng y tế Bà Nà Hills', 'medical', 'Khu du lịch Bà Nà Hills', '0236 379 1999', 4.2, 'Hỗ trợ y tế trong khu du lịch.', ST_SetSRID(ST_MakePoint(107.9995, 15.9965), 4326)),
('04000000-0000-4000-8000-000000000015', '01000000-0000-4000-8000-000000000003', 'Trạm nhiên liệu Hòa Ninh', 'gas_station', 'Hòa Ninh, Hòa Vang, Đà Nẵng', '0236 368 1001', 4.1, 'Trạm nhiên liệu gần tuyến lên Bà Nà.', ST_SetSRID(ST_MakePoint(108.0300, 15.9900), 4326)),
('04000000-0000-4000-8000-000000000016', '01000000-0000-4000-8000-000000000004', 'Little Riverside Hoi An', 'hotel', 'Hội An, Quảng Nam', '0235 386 9999', 4.7, 'Lưu trú ven sông gần phố cổ.', ST_SetSRID(ST_MakePoint(108.3330, 15.8765), 4326)),
('04000000-0000-4000-8000-000000000017', '01000000-0000-4000-8000-000000000004', 'Nhà hàng Cao lầu Hội An', 'restaurant', 'Phố cổ Hội An', '0235 391 1222', 4.6, 'Ẩm thực địa phương trong lõi phố cổ.', ST_SetSRID(ST_MakePoint(108.3285, 15.8785), 4326)),
('04000000-0000-4000-8000-000000000018', '01000000-0000-4000-8000-000000000004', 'Bãi đỗ xe An Hội', 'parking', 'Khu An Hội, Hội An', '0235 386 7000', 4.2, 'Bãi xe phục vụ phố cổ và chợ đêm.', ST_SetSRID(ST_MakePoint(108.3238, 15.8758), 4326)),
('04000000-0000-4000-8000-000000000019', '01000000-0000-4000-8000-000000000004', 'Trung tâm y tế Hội An', 'medical', 'Hội An, Quảng Nam', '0235 386 4750', 4.2, 'Điểm y tế gần vùng lõi du lịch.', ST_SetSRID(ST_MakePoint(108.3360, 15.8830), 4326)),
('04000000-0000-4000-8000-000000000020', '01000000-0000-4000-8000-000000000004', 'Trạm xăng Cẩm Phô', 'gas_station', 'Cẩm Phô, Hội An', '0235 391 9001', 4.0, 'Trạm nhiên liệu gần cửa ngõ phố cổ.', ST_SetSRID(ST_MakePoint(108.3215, 15.8825), 4326));

WITH seed_password AS (
  SELECT crypt('Password123!', gen_salt('bf', 10)) AS password_hash
),
seed_users(id, full_name, email, role, avatar) AS (
  VALUES
  ('05000000-0000-4000-8000-000000000001'::uuid, 'Admin GIS Tourism', 'admin@gis-tour.local', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000002'::uuid, 'Điều phối viên miền Trung', 'operator@gis-tour.local', 'admin', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000003'::uuid, 'Nguyễn Hoàng Minh', 'minh.nguyen@example.com', 'user', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000004'::uuid, 'Trần Gia Linh', 'linh.tran@example.com', 'user', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000005'::uuid, 'Phạm Đức Anh', 'anh.pham@example.com', 'user', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000006'::uuid, 'Lê Thảo Vy', 'vy.le@example.com', 'user', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000007'::uuid, 'Võ Minh Khoa', 'khoa.vo@example.com', 'user', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000008'::uuid, 'Đỗ Ngọc Mai', 'mai.do@example.com', 'user', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000009'::uuid, 'Bùi Hải Sơn', 'son.bui@example.com', 'user', 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000010'::uuid, 'Hoàng Yến Nhi', 'nhi.hoang@example.com', 'user', 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=512&q=80')
)
INSERT INTO users (id, full_name, email, password_hash, role, avatar)
SELECT seed_users.id, seed_users.full_name, seed_users.email, seed_password.password_hash, seed_users.role, seed_users.avatar
FROM seed_users
CROSS JOIN seed_password;

INSERT INTO tour_plans (id, user_id, title, description, total_distance_km, estimated_duration_minutes) VALUES
('06000000-0000-4000-8000-000000000001', '05000000-0000-4000-8000-000000000003', 'Huế di sản 2 ngày', 'Tuyến city tour Huế với Đại Nội, Thiên Mụ và sông Hương.', 18.5, 480),
('06000000-0000-4000-8000-000000000002', '05000000-0000-4000-8000-000000000004', 'Bà Nà cuối tuần', 'Lịch trình Bà Nà Hills cho gia đình, tập trung vé, cáp treo và khu vui chơi.', 42.0, 540),
('06000000-0000-4000-8000-000000000003', '05000000-0000-4000-8000-000000000005', 'Hội An về đêm', 'Tour đi bộ phố cổ, chợ đêm và bến thuyền sông Hoài.', 3.2, 300),
('06000000-0000-4000-8000-000000000004', '05000000-0000-4000-8000-000000000006', 'Biển Quảng Trị 1 ngày', 'Lộ trình Cửa Việt - Cửa Tùng phục vụ demo bản đồ ven biển.', 32.0, 420),
('06000000-0000-4000-8000-000000000005', '05000000-0000-4000-8000-000000000007', 'Miền Trung di sản', 'Tuyến dài ngày nối Huế, Đà Nẵng và Hội An.', 168.0, 2400);

INSERT INTO tour_plan_details (id, tour_plan_id, destination_id, visit_order, note) VALUES
('06100000-0000-4000-8000-000000000001', '06000000-0000-4000-8000-000000000001', '03000000-0000-4000-8000-000000000005', 1, 'Dự kiến 2026-07-10 08:30-11:30. Ưu tiên buổi sáng để tránh nắng.'),
('06100000-0000-4000-8000-000000000002', '06000000-0000-4000-8000-000000000001', '03000000-0000-4000-8000-000000000006', 2, 'Dự kiến 2026-07-10 15:00-16:30. Kết hợp tuyến sông Hương.'),
('06100000-0000-4000-8000-000000000003', '06000000-0000-4000-8000-000000000001', '03000000-0000-4000-8000-000000000008', 3, 'Dự kiến 2026-07-10 18:30-20:00. Đi bộ ven sông buổi tối.'),
('06100000-0000-4000-8000-000000000004', '06000000-0000-4000-8000-000000000002', '03000000-0000-4000-8000-000000000009', 1, 'Dự kiến 2026-07-18 09:00-11:00. Đặt vé trước, kiểm tra thời tiết núi.'),
('06100000-0000-4000-8000-000000000005', '06000000-0000-4000-8000-000000000002', '03000000-0000-4000-8000-000000000010', 2, 'Dự kiến 2026-07-18 13:00-16:00. Khung giờ phù hợp gia đình có trẻ em.'),
('06100000-0000-4000-8000-000000000006', '06000000-0000-4000-8000-000000000003', '03000000-0000-4000-8000-000000000013', 1, 'Dự kiến 2026-08-02 16:30-18:00. Bắt đầu trước khi phố lên đèn.'),
('06100000-0000-4000-8000-000000000007', '06000000-0000-4000-8000-000000000003', '03000000-0000-4000-8000-000000000015', 2, 'Dự kiến 2026-08-02 18:30-20:00. Ăn tối và mua sắm.'),
('06100000-0000-4000-8000-000000000008', '06000000-0000-4000-8000-000000000003', '03000000-0000-4000-8000-000000000016', 3, 'Dự kiến 2026-08-02 20:15-21:30. Đi thuyền ngắn trên sông Hoài.'),
('06100000-0000-4000-8000-000000000009', '06000000-0000-4000-8000-000000000004', '03000000-0000-4000-8000-000000000001', 1, 'Dự kiến 2026-08-12 07:00-10:30. Theo dõi gió ven biển.'),
('06100000-0000-4000-8000-000000000010', '06000000-0000-4000-8000-000000000004', '03000000-0000-4000-8000-000000000002', 2, 'Dự kiến 2026-08-12 15:00-17:30. Tắm biển cuối ngày.'),
('06100000-0000-4000-8000-000000000011', '06000000-0000-4000-8000-000000000005', '03000000-0000-4000-8000-000000000005', 1, 'Ngày Huế trong tuyến di sản miền Trung.'),
('06100000-0000-4000-8000-000000000012', '06000000-0000-4000-8000-000000000005', '03000000-0000-4000-8000-000000000009', 2, 'Ngày Đà Nẵng, ưu tiên kiểm tra vận hành cáp treo.'),
('06100000-0000-4000-8000-000000000013', '06000000-0000-4000-8000-000000000005', '03000000-0000-4000-8000-000000000013', 3, 'Ngày Hội An, nên kết thúc sau khi phố cổ lên đèn.');

INSERT INTO reviews (id, user_id, destination_id, score, content, status, created_at) VALUES
('07000000-0000-4000-8000-000000000001', '05000000-0000-4000-8000-000000000003', '03000000-0000-4000-8000-000000000005', 5, 'Dữ liệu giờ mở cửa và bản đồ điểm vào rất hữu ích khi lên lịch.', 'published', now() - interval '26 days'),
('07000000-0000-4000-8000-000000000002', '05000000-0000-4000-8000-000000000004', '03000000-0000-4000-8000-000000000006', 5, 'Không gian yên tĩnh, nên đi sáng sớm hoặc cuối chiều.', 'published', now() - interval '22 days'),
('07000000-0000-4000-8000-000000000003', '05000000-0000-4000-8000-000000000005', '03000000-0000-4000-8000-000000000009', 5, 'Cần theo dõi thời tiết vì mây mù thay đổi khá nhanh.', 'published', now() - interval '20 days'),
('07000000-0000-4000-8000-000000000004', '05000000-0000-4000-8000-000000000006', '03000000-0000-4000-8000-000000000013', 5, 'Phố cổ rất đông sau 18h, bản đồ dịch vụ giúp chọn đường đi tốt hơn.', 'published', now() - interval '18 days'),
('07000000-0000-4000-8000-000000000005', '05000000-0000-4000-8000-000000000007', '03000000-0000-4000-8000-000000000001', 4, 'Biển sạch, nên có cảnh báo gió theo khung giờ.', 'published', now() - interval '16 days'),
('07000000-0000-4000-8000-000000000006', '05000000-0000-4000-8000-000000000008', '03000000-0000-4000-8000-000000000015', 4, 'Chợ đêm phù hợp gia đình nhưng cần xem trước điểm gửi xe.', 'published', now() - interval '14 days'),
('07000000-0000-4000-8000-000000000007', '05000000-0000-4000-8000-000000000009', '03000000-0000-4000-8000-000000000002', 4, 'Khá yên tĩnh, tuyến ven biển nên có lớp giao thông riêng.', 'published', now() - interval '12 days'),
('07000000-0000-4000-8000-000000000008', '05000000-0000-4000-8000-000000000010', '03000000-0000-4000-8000-000000000014', 5, 'Điểm check-in nhỏ nhưng rất đông, cần gợi ý thời điểm ít khách.', 'published', now() - interval '10 days'),
('07000000-0000-4000-8000-000000000009', '05000000-0000-4000-8000-000000000003', '03000000-0000-4000-8000-000000000010', 4, 'Khu vui chơi ổn, chi phí cao nên cần hiển thị rõ ngân sách tour.', 'published', now() - interval '9 days'),
('07000000-0000-4000-8000-000000000010', '05000000-0000-4000-8000-000000000004', '03000000-0000-4000-8000-000000000016', 5, 'Đi thuyền buổi tối đẹp, cần đặt lịch theo slot.', 'pending', now() - interval '7 days');

INSERT INTO notifications (id, destination_id, title, content, type, status) VALUES
('08000000-0000-4000-8000-000000000001', '03000000-0000-4000-8000-000000000001', 'Cảnh báo gió mạnh ven biển Quảng Trị', 'Du khách nên kiểm tra thời tiết trước khi đi Cửa Việt và Cửa Tùng trong khung 15:00-18:00.', 'warning', 'active'),
('08000000-0000-4000-8000-000000000002', '03000000-0000-4000-8000-000000000005', 'Khuyến nghị đi Đại Nội vào buổi sáng', 'Lượng khách tại Kinh thành Huế thường tăng sau 09:30, nên đặt lịch sớm để giảm chờ đợi.', 'news', 'active'),
('08000000-0000-4000-8000-000000000003', '03000000-0000-4000-8000-000000000009', 'Bà Nà kiểm tra vận hành cáp treo', 'Một số tuyến cáp treo có thể thay đổi thời gian vận hành theo thời tiết trên núi.', 'maintenance', 'active'),
('08000000-0000-4000-8000-000000000004', '03000000-0000-4000-8000-000000000013', 'Hội An tăng cường phố đi bộ buổi tối', 'Khu phố cổ ưu tiên đi bộ sau 17:00, nên xem trước bãi đỗ xe An Hội.', 'event', 'active'),
('08000000-0000-4000-8000-000000000005', NULL, 'Cập nhật dữ liệu thời tiết theo giờ', 'Lớp bản đồ thời tiết đã có dữ liệu mẫu sáng, trưa và chiều cho các điểm trọng tâm.', 'news', 'active');

WITH destination_weather(destination_id, lon, lat, base_temp, base_humidity, base_wind, status_morning, status_noon, status_afternoon) AS (
  VALUES
  ('03000000-0000-4000-8000-000000000001'::uuid, 107.1670, 16.9090, 30.0, 78, 18.0, 'Nắng nhẹ', 'Nắng nóng', 'Gió biển mạnh'),
  ('03000000-0000-4000-8000-000000000002'::uuid, 107.1000, 17.0000, 29.0, 80, 17.0, 'Nắng nhẹ', 'Nắng nóng', 'Có mây'),
  ('03000000-0000-4000-8000-000000000003'::uuid, 107.1440, 16.9300, 29.5, 79, 16.0, 'Có mây', 'Nắng', 'Gió nhẹ'),
  ('03000000-0000-4000-8000-000000000004'::uuid, 107.1760, 16.9010, 30.0, 81, 19.0, 'Có mây', 'Nắng', 'Gió biển mạnh'),
  ('03000000-0000-4000-8000-000000000005'::uuid, 107.5775, 16.4692, 28.5, 76, 8.0, 'Dịu mát', 'Nắng', 'Mưa rào nhẹ'),
  ('03000000-0000-4000-8000-000000000006'::uuid, 107.5450, 16.4539, 28.0, 77, 7.0, 'Dịu mát', 'Nắng', 'Có mây'),
  ('03000000-0000-4000-8000-000000000007'::uuid, 107.5788, 16.4677, 28.7, 75, 8.0, 'Dịu mát', 'Nắng', 'Có mây'),
  ('03000000-0000-4000-8000-000000000008'::uuid, 107.5890, 16.4665, 28.3, 78, 9.0, 'Sương nhẹ', 'Nắng', 'Mưa rào nhẹ'),
  ('03000000-0000-4000-8000-000000000009'::uuid, 107.9960, 15.9950, 22.0, 84, 12.0, 'Sương mù', 'Có mây', 'Mưa rào'),
  ('03000000-0000-4000-8000-000000000010'::uuid, 107.9990, 15.9975, 22.5, 83, 11.0, 'Sương mù', 'Có mây', 'Mưa rào'),
  ('03000000-0000-4000-8000-000000000011'::uuid, 107.9935, 15.9985, 22.2, 85, 13.0, 'Sương mù', 'Gió nhẹ', 'Mưa rào'),
  ('03000000-0000-4000-8000-000000000012'::uuid, 107.9974, 15.9964, 22.8, 82, 10.0, 'Sương nhẹ', 'Có mây', 'Có mưa'),
  ('03000000-0000-4000-8000-000000000013'::uuid, 108.3278, 15.8801, 29.0, 79, 9.0, 'Nắng nhẹ', 'Nắng nóng', 'Dịu mát'),
  ('03000000-0000-4000-8000-000000000014'::uuid, 108.3269, 15.8779, 29.2, 78, 8.0, 'Nắng nhẹ', 'Nắng nóng', 'Dịu mát'),
  ('03000000-0000-4000-8000-000000000015'::uuid, 108.3250, 15.8760, 28.8, 80, 7.0, 'Nắng nhẹ', 'Nắng nóng', 'Dịu mát'),
  ('03000000-0000-4000-8000-000000000016'::uuid, 108.3260, 15.8752, 28.6, 81, 8.0, 'Nắng nhẹ', 'Nắng', 'Dịu mát')
),
time_slots(slot_index, observed_offset, temp_delta, humidity_delta, wind_delta) AS (
  VALUES
  (1, interval '8 hours', -1.0, 3, -2.0),
  (2, interval '4 hours', 2.0, -4, 1.0),
  (3, interval '1 hour', 0.0, 1, 3.0)
)
INSERT INTO weather_info (destination_id, temperature, humidity, wind_speed, weather_status, location_geom, observed_at)
SELECT
  d.destination_id,
  d.base_temp + t.temp_delta,
  d.base_humidity + t.humidity_delta,
  d.base_wind + t.wind_delta,
  CASE t.slot_index WHEN 1 THEN d.status_morning WHEN 2 THEN d.status_noon ELSE d.status_afternoon END,
  ST_SetSRID(ST_MakePoint(d.lon, d.lat), 4326),
  now() - t.observed_offset
FROM destination_weather d
CROSS JOIN time_slots t;

WITH destination_traffic(destination_id, lon, lat, route_name, base_level) AS (
  VALUES
  ('03000000-0000-4000-8000-000000000001'::uuid, 107.1670, 16.9090, 'Đường ven biển Cửa Việt', 2),
  ('03000000-0000-4000-8000-000000000002'::uuid, 107.1000, 17.0000, 'Tuyến Cửa Tùng - Vĩnh Linh', 2),
  ('03000000-0000-4000-8000-000000000003'::uuid, 107.1440, 16.9300, 'Đường vào Gio Hải', 1),
  ('03000000-0000-4000-8000-000000000004'::uuid, 107.1760, 16.9010, 'Đường vào cảng Cửa Việt', 3),
  ('03000000-0000-4000-8000-000000000005'::uuid, 107.5775, 16.4692, 'Lê Duẩn - Đại Nội', 3),
  ('03000000-0000-4000-8000-000000000006'::uuid, 107.5450, 16.4539, 'Nguyễn Phúc Nguyên', 2),
  ('03000000-0000-4000-8000-000000000007'::uuid, 107.5788, 16.4677, 'Cửa Ngăn - Ngọ Môn', 3),
  ('03000000-0000-4000-8000-000000000008'::uuid, 107.5890, 16.4665, 'Lê Lợi ven sông Hương', 2),
  ('03000000-0000-4000-8000-000000000009'::uuid, 107.9960, 15.9950, 'Tuyến lên Bà Nà Hills', 4),
  ('03000000-0000-4000-8000-000000000010'::uuid, 107.9990, 15.9975, 'Nội khu Fantasy Park', 3),
  ('03000000-0000-4000-8000-000000000011'::uuid, 107.9935, 15.9985, 'Ga cáp treo Bà Nà', 4),
  ('03000000-0000-4000-8000-000000000012'::uuid, 107.9974, 15.9964, 'Tuyến vườn hoa Bà Nà', 2),
  ('03000000-0000-4000-8000-000000000013'::uuid, 108.3278, 15.8801, 'Trần Phú phố cổ', 4),
  ('03000000-0000-4000-8000-000000000014'::uuid, 108.3269, 15.8779, 'Nguyễn Thị Minh Khai', 4),
  ('03000000-0000-4000-8000-000000000015'::uuid, 108.3250, 15.8760, 'Khu An Hội', 5),
  ('03000000-0000-4000-8000-000000000016'::uuid, 108.3260, 15.8752, 'Bờ sông Hoài', 4)
),
time_slots(slot_index, observed_offset, level_delta, speed_delta) AS (
  VALUES
  (1, interval '8 hours', -1, 8),
  (2, interval '4 hours', 0, 2),
  (3, interval '1 hour', 1, -6)
)
INSERT INTO traffic_info (destination_id, congestion_level, status, description, location_geom, observed_at)
SELECT
  d.destination_id,
  LEAST(5, GREATEST(0, d.base_level + t.level_delta)),
  CASE
    WHEN LEAST(5, GREATEST(0, d.base_level + t.level_delta)) >= 5 THEN 'Rất đông'
    WHEN LEAST(5, GREATEST(0, d.base_level + t.level_delta)) = 4 THEN 'Đông'
    WHEN LEAST(5, GREATEST(0, d.base_level + t.level_delta)) = 3 THEN 'Trung bình'
    WHEN LEAST(5, GREATEST(0, d.base_level + t.level_delta)) = 2 THEN 'Ổn định'
    ELSE 'Thông thoáng'
  END,
  d.route_name || ' - cập nhật theo khung giờ demo.',
  ST_SetSRID(ST_MakePoint(d.lon, d.lat), 4326),
  now() - t.observed_offset
FROM destination_traffic d
CROSS JOIN time_slots t;

-- Additional rich demo data for fuller admin dashboards, map exploration, reviews,
-- routing, and temporal GIS demos. Image URLs below were checked through Unsplash
-- stable photo pages/download redirects and intentionally stay on images.unsplash.com.

INSERT INTO tourist_destinations
(id, province_id, category_id, name, description, address, open_time, close_time, ticket_price, image_url, rating, location_geom)
VALUES
('03000000-0000-4000-8000-000000000017', '01000000-0000-4000-8000-000000000001', '02000000-0000-4000-8000-000000000002', 'Địa đạo Vịnh Mốc', 'Di tích lịch sử ven biển Vĩnh Linh, phù hợp phân tích tuyến tham quan Cửa Tùng - Vịnh Mốc theo thời gian và thời tiết.', 'Vĩnh Thạch, Vĩnh Linh, Quảng Trị', '07:00', '17:00', 40000, 'https://images.unsplash.com/photo-1774007685362-544ef150162e?auto=format&fit=crop&w=1600&q=80', 4.7, ST_SetSRID(ST_MakePoint(107.1059, 17.0760), 4326)),
('03000000-0000-4000-8000-000000000018', '01000000-0000-4000-8000-000000000001', '02000000-0000-4000-8000-000000000002', 'Thành cổ Quảng Trị', 'Không gian tưởng niệm trong trung tâm thị xã, cần quản lý lịch đoàn, mật độ khách và tuyến kết nối di tích.', 'Phường 2, thị xã Quảng Trị, Quảng Trị', '07:00', '18:00', 0, 'https://images.unsplash.com/photo-1774007685362-544ef150162e?auto=format&fit=crop&w=1600&q=80', 4.6, ST_SetSRID(ST_MakePoint(107.1880, 16.7469), 4326)),
('03000000-0000-4000-8000-000000000019', '01000000-0000-4000-8000-000000000001', '02000000-0000-4000-8000-000000000002', 'Cầu Hiền Lương - Sông Bến Hải', 'Điểm di tích biểu tượng trên vĩ tuyến 17, phù hợp demo lớp dữ liệu lịch sử kết hợp giao thông theo mốc giờ.', 'Vĩnh Linh, Quảng Trị', '07:00', '18:00', 0, 'https://images.unsplash.com/photo-1774007685362-544ef150162e?auto=format&fit=crop&w=1600&q=80', 4.6, ST_SetSRID(ST_MakePoint(107.0058, 17.0006), 4326)),
('03000000-0000-4000-8000-000000000020', '01000000-0000-4000-8000-000000000001', '02000000-0000-4000-8000-000000000003', 'Bãi biển Mỹ Thủy', 'Bãi biển phía nam Quảng Trị, thích hợp mô phỏng cảnh báo gió, sóng và lựa chọn tuyến ven biển.', 'Hải An, Hải Lăng, Quảng Trị', '05:00', '21:00', 0, 'https://images.unsplash.com/photo-1774007685362-544ef150162e?auto=format&fit=crop&w=1600&q=80', 4.2, ST_SetSRID(ST_MakePoint(107.2825, 16.6948), 4326)),
('03000000-0000-4000-8000-000000000021', '01000000-0000-4000-8000-000000000002', '02000000-0000-4000-8000-000000000001', 'Lăng Minh Mạng', 'Quần thể lăng tẩm yên tĩnh phía tây Huế, phù hợp tuyến di sản trong ngày và phân tích cung đường ngoại ô.', 'Hương Thọ, thành phố Huế', '07:00', '17:30', 150000, 'https://images.unsplash.com/photo-1674798201360-745535e67e6e?auto=format&fit=crop&w=1600&q=80', 4.7, ST_SetSRID(ST_MakePoint(107.5695, 16.3863), 4326)),
('03000000-0000-4000-8000-000000000022', '01000000-0000-4000-8000-000000000002', '02000000-0000-4000-8000-000000000001', 'Lăng Khải Định', 'Công trình lăng tẩm nổi bật về kiến trúc, thường được ghép với Minh Mạng và Tự Đức trong tour di sản Huế.', 'Thủy Bằng, thành phố Huế', '07:00', '17:30', 150000, 'https://images.unsplash.com/photo-1674798201360-745535e67e6e?auto=format&fit=crop&w=1600&q=80', 4.7, ST_SetSRID(ST_MakePoint(107.5905, 16.3981), 4326)),
('03000000-0000-4000-8000-000000000023', '01000000-0000-4000-8000-000000000002', '02000000-0000-4000-8000-000000000006', 'Chợ Đông Ba', 'Không gian ẩm thực và mua sắm trung tâm Huế, hữu ích cho demo mật độ dịch vụ và giao thông giờ cao điểm.', 'Trần Hưng Đạo, thành phố Huế', '06:00', '19:00', 0, 'https://images.unsplash.com/photo-1567272131881-8ce2275deb67?auto=format&fit=crop&w=1600&q=80', 4.4, ST_SetSRID(ST_MakePoint(107.5881, 16.4743), 4326)),
('03000000-0000-4000-8000-000000000024', '01000000-0000-4000-8000-000000000002', '02000000-0000-4000-8000-000000000004', 'Đồi Vọng Cảnh', 'Điểm ngắm sông Hương và rừng thông, phù hợp gợi ý khung giờ hoàng hôn và phân tích thời tiết theo giờ.', 'Thủy Biều, thành phố Huế', '05:30', '19:00', 0, 'https://images.unsplash.com/photo-1674798201360-745535e67e6e?auto=format&fit=crop&w=1600&q=80', 4.4, ST_SetSRID(ST_MakePoint(107.5650, 16.4330), 4326)),
('03000000-0000-4000-8000-000000000025', '01000000-0000-4000-8000-000000000003', '02000000-0000-4000-8000-000000000003', 'Bãi biển Mỹ Khê', 'Bãi biển đô thị đông khách của Đà Nẵng, cần lớp thời tiết, gió biển, dịch vụ và giao thông ven biển theo khung giờ.', 'Võ Nguyên Giáp, Sơn Trà, Đà Nẵng', '05:00', '22:00', 0, 'https://images.unsplash.com/photo-1708776480405-7ae14fe1d4c4?auto=format&fit=crop&w=1600&q=80', 4.7, ST_SetSRID(ST_MakePoint(108.2496, 16.0544), 4326)),
('03000000-0000-4000-8000-000000000026', '01000000-0000-4000-8000-000000000003', '02000000-0000-4000-8000-000000000004', 'Ngũ Hành Sơn', 'Cụm núi đá và hang động phía nam Đà Nẵng, phù hợp tuyến bán ngày kết hợp làng đá Non Nước.', 'Hòa Hải, Ngũ Hành Sơn, Đà Nẵng', '07:00', '17:30', 40000, 'https://images.unsplash.com/photo-1587623896311-9ff56996ba2d?auto=format&fit=crop&w=1600&q=80', 4.6, ST_SetSRID(ST_MakePoint(108.2639, 15.9955), 4326)),
('03000000-0000-4000-8000-000000000027', '01000000-0000-4000-8000-000000000003', '02000000-0000-4000-8000-000000000005', 'Chùa Linh Ứng Sơn Trà', 'Điểm tâm linh trên bán đảo Sơn Trà, thường chịu ảnh hưởng gió và mật độ xe du lịch cuối tuần.', 'Bãi Bụt, Sơn Trà, Đà Nẵng', '06:00', '18:30', 0, 'https://images.unsplash.com/photo-1639458131380-4d71538ef1df?auto=format&fit=crop&w=1600&q=80', 4.7, ST_SetSRID(ST_MakePoint(108.2775, 16.1000), 4326)),
('03000000-0000-4000-8000-000000000028', '01000000-0000-4000-8000-000000000003', '02000000-0000-4000-8000-000000000001', 'Cầu Rồng Đà Nẵng', 'Cầu biểu tượng trung tâm thành phố, phù hợp hiển thị cảnh báo giao thông và sự kiện cuối tuần.', 'An Hải Tây, Sơn Trà, Đà Nẵng', '00:00', '23:59', 0, 'https://images.unsplash.com/photo-1639458131380-4d71538ef1df?auto=format&fit=crop&w=1600&q=80', 4.6, ST_SetSRID(ST_MakePoint(108.2277, 16.0610), 4326)),
('03000000-0000-4000-8000-000000000029', '01000000-0000-4000-8000-000000000004', '02000000-0000-4000-8000-000000000001', 'Thánh địa Mỹ Sơn', 'Di sản Chăm tại Duy Xuyên, cần quản lý tuyến di sản xa đô thị và rủi ro mưa nắng theo buổi.', 'Duy Phú, Duy Xuyên, Quảng Nam', '06:30', '17:30', 150000, 'https://images.unsplash.com/photo-1693751849654-ea3e974a262c?auto=format&fit=crop&w=1600&q=80', 4.7, ST_SetSRID(ST_MakePoint(108.1220, 15.7650), 4326)),
('03000000-0000-4000-8000-000000000030', '01000000-0000-4000-8000-000000000004', '02000000-0000-4000-8000-000000000004', 'Rừng dừa Bảy Mẫu', 'Trải nghiệm thuyền thúng và du lịch cộng đồng Cẩm Thanh, cần theo dõi thời tiết, gió và khung giờ đông khách.', 'Cẩm Thanh, Hội An, Quảng Nam', '07:00', '17:30', 150000, 'https://images.unsplash.com/photo-1664650440553-ab53804814b3?auto=format&fit=crop&w=1600&q=80', 4.5, ST_SetSRID(ST_MakePoint(108.3740, 15.8790), 4326)),
('03000000-0000-4000-8000-000000000031', '01000000-0000-4000-8000-000000000004', '02000000-0000-4000-8000-000000000001', 'Làng gốm Thanh Hà', 'Làng nghề truyền thống gần Hội An, phù hợp dữ liệu dịch vụ thủ công, lớp đánh giá và tuyến gia đình.', 'Thanh Hà, Hội An, Quảng Nam', '08:00', '17:30', 35000, 'https://images.unsplash.com/photo-1761150285834-7ab9ce6dbfd4?auto=format&fit=crop&w=1600&q=80', 4.4, ST_SetSRID(ST_MakePoint(108.3070, 15.8807), 4326)),
('03000000-0000-4000-8000-000000000032', '01000000-0000-4000-8000-000000000004', '02000000-0000-4000-8000-000000000003', 'Bãi biển An Bàng', 'Bãi biển gần Hội An, phù hợp gợi ý thời điểm đi biển, tuyến từ phố cổ và cảnh báo mưa gió theo ngày.', 'Cẩm An, Hội An, Quảng Nam', '05:00', '22:00', 0, 'https://images.unsplash.com/photo-1681910834344-5b8ea80dc525?auto=format&fit=crop&w=1600&q=80', 4.5, ST_SetSRID(ST_MakePoint(108.3380, 15.9140), 4326));

INSERT INTO service_facilities
(id, province_id, name, type, address, phone, rating, description, location_geom)
VALUES
('04000000-0000-4000-8000-000000000021', '01000000-0000-4000-8000-000000000001', 'Nhà hàng biển Mỹ Thủy', 'restaurant', 'Hải An, Hải Lăng, Quảng Trị', '0233 390 1122', 4.2, 'Hải sản địa phương gần bãi biển Mỹ Thủy.', ST_SetSRID(ST_MakePoint(107.2790, 16.6940), 4326)),
('04000000-0000-4000-8000-000000000022', '01000000-0000-4000-8000-000000000001', 'Bãi đỗ xe Vịnh Mốc', 'parking', 'Vĩnh Thạch, Vĩnh Linh, Quảng Trị', '0233 382 9002', 4.1, 'Bãi đỗ xe cho đoàn tham quan địa đạo.', ST_SetSRID(ST_MakePoint(107.1068, 17.0755), 4326)),
('04000000-0000-4000-8000-000000000023', '01000000-0000-4000-8000-000000000001', 'Quảng Trị Heritage Homestay', 'hotel', 'Thị xã Quảng Trị, Quảng Trị', '0233 386 2233', 4.3, 'Lưu trú nhỏ phục vụ tuyến di tích trung tâm.', ST_SetSRID(ST_MakePoint(107.1892, 16.7478), 4326)),
('04000000-0000-4000-8000-000000000024', '01000000-0000-4000-8000-000000000001', 'Trạm xăng Hải Lăng', 'gas_station', 'QL1A, Hải Lăng, Quảng Trị', '0233 387 6001', 4.0, 'Điểm tiếp nhiên liệu trên tuyến nam Quảng Trị.', ST_SetSRID(ST_MakePoint(107.2300, 16.7000), 4326)),
('04000000-0000-4000-8000-000000000025', '01000000-0000-4000-8000-000000000002', 'Nhà vườn Kim Long', 'restaurant', 'Kim Long, Huế', '0234 352 3344', 4.5, 'Ẩm thực sân vườn gần tuyến Thiên Mụ - lăng tẩm.', ST_SetSRID(ST_MakePoint(107.5500, 16.4490), 4326)),
('04000000-0000-4000-8000-000000000026', '01000000-0000-4000-8000-000000000002', 'Bãi đỗ xe Lăng Minh Mạng', 'parking', 'Hương Thọ, Huế', '0234 388 1002', 4.1, 'Bãi đỗ xe phục vụ tuyến lăng Minh Mạng.', ST_SetSRID(ST_MakePoint(107.5686, 16.3869), 4326)),
('04000000-0000-4000-8000-000000000027', '01000000-0000-4000-8000-000000000002', 'Khách sạn Boutique Huế', 'hotel', 'Trung tâm Huế', '0234 391 8899', 4.4, 'Lưu trú cho khách city tour.', ST_SetSRID(ST_MakePoint(107.5864, 16.4681), 4326)),
('04000000-0000-4000-8000-000000000028', '01000000-0000-4000-8000-000000000002', 'Trạm y tế Thủy Bằng', 'medical', 'Thủy Bằng, Huế', '0234 382 1133', 4.0, 'Hỗ trợ y tế gần cụm lăng tẩm.', ST_SetSRID(ST_MakePoint(107.5920, 16.4000), 4326)),
('04000000-0000-4000-8000-000000000029', '01000000-0000-4000-8000-000000000003', 'Khách sạn biển Mỹ Khê', 'hotel', 'Võ Nguyên Giáp, Đà Nẵng', '0236 393 8899', 4.6, 'Lưu trú ven biển phục vụ tuyến Mỹ Khê - Sơn Trà.', ST_SetSRID(ST_MakePoint(108.2470, 16.0560), 4326)),
('04000000-0000-4000-8000-000000000030', '01000000-0000-4000-8000-000000000003', 'Nhà hàng hải sản Sơn Trà', 'restaurant', 'Sơn Trà, Đà Nẵng', '0236 391 4567', 4.5, 'Nhà hàng hải sản gần tuyến biển.', ST_SetSRID(ST_MakePoint(108.2500, 16.0610), 4326)),
('04000000-0000-4000-8000-000000000031', '01000000-0000-4000-8000-000000000003', 'Bãi đỗ xe Ngũ Hành Sơn', 'parking', 'Hòa Hải, Đà Nẵng', '0236 396 7788', 4.2, 'Bãi đỗ xe gần cổng tham quan Ngũ Hành Sơn.', ST_SetSRID(ST_MakePoint(108.2630, 15.9968), 4326)),
('04000000-0000-4000-8000-000000000032', '01000000-0000-4000-8000-000000000003', 'Trạm y tế Sơn Trà', 'medical', 'Sơn Trà, Đà Nẵng', '0236 382 1100', 4.1, 'Hỗ trợ y tế tuyến Sơn Trà.', ST_SetSRID(ST_MakePoint(108.2420, 16.0670), 4326)),
('04000000-0000-4000-8000-000000000033', '01000000-0000-4000-8000-000000000003', 'Trạm xăng Võ Văn Kiệt', 'gas_station', 'Võ Văn Kiệt, Đà Nẵng', '0236 368 7788', 4.0, 'Trạm nhiên liệu trên tuyến trung tâm ra biển.', ST_SetSRID(ST_MakePoint(108.2320, 16.0600), 4326)),
('04000000-0000-4000-8000-000000000034', '01000000-0000-4000-8000-000000000004', 'My Son Heritage Cafe', 'restaurant', 'Duy Phú, Duy Xuyên, Quảng Nam', '0235 377 1234', 4.2, 'Điểm nghỉ cho khách sau khi tham quan Mỹ Sơn.', ST_SetSRID(ST_MakePoint(108.1250, 15.7660), 4326)),
('04000000-0000-4000-8000-000000000035', '01000000-0000-4000-8000-000000000004', 'Bãi đỗ xe Thánh địa Mỹ Sơn', 'parking', 'Duy Phú, Duy Xuyên, Quảng Nam', '0235 373 9001', 4.2, 'Bãi đỗ xe cho đoàn tham quan Mỹ Sơn.', ST_SetSRID(ST_MakePoint(108.1240, 15.7656), 4326)),
('04000000-0000-4000-8000-000000000036', '01000000-0000-4000-8000-000000000004', 'Cẩm Thanh Eco Lodge', 'hotel', 'Cẩm Thanh, Hội An', '0235 392 7788', 4.5, 'Lưu trú sinh thái gần rừng dừa Bảy Mẫu.', ST_SetSRID(ST_MakePoint(108.3710, 15.8800), 4326)),
('04000000-0000-4000-8000-000000000037', '01000000-0000-4000-8000-000000000004', 'Trạm y tế Cẩm Thanh', 'medical', 'Cẩm Thanh, Hội An', '0235 392 1100', 4.0, 'Hỗ trợ y tế gần khu thuyền thúng.', ST_SetSRID(ST_MakePoint(108.3690, 15.8785), 4326)),
('04000000-0000-4000-8000-000000000038', '01000000-0000-4000-8000-000000000004', 'An Bàng Beach Cafe', 'restaurant', 'Cẩm An, Hội An', '0235 386 6788', 4.4, 'Cafe và bữa nhẹ ven biển An Bàng.', ST_SetSRID(ST_MakePoint(108.3370, 15.9144), 4326)),
('04000000-0000-4000-8000-000000000039', '01000000-0000-4000-8000-000000000004', 'Bãi đỗ xe An Bàng', 'parking', 'Cẩm An, Hội An', '0235 386 8899', 4.1, 'Bãi đỗ xe phục vụ khu biển An Bàng.', ST_SetSRID(ST_MakePoint(108.3355, 15.9140), 4326)),
('04000000-0000-4000-8000-000000000040', '01000000-0000-4000-8000-000000000004', 'Trạm xăng Cửa Đại', 'gas_station', 'Cửa Đại, Hội An', '0235 391 7788', 4.0, 'Trạm nhiên liệu trên tuyến Hội An - biển.', ST_SetSRID(ST_MakePoint(108.3490, 15.8890), 4326));

WITH seed_password AS (
  SELECT crypt('Password123!', gen_salt('bf', 10)) AS password_hash
),
seed_users(id, full_name, email, role, avatar) AS (
  VALUES
  ('05000000-0000-4000-8000-000000000011'::uuid, 'Quản trị dữ liệu Huế', 'hue.admin@gis-tour.local', 'admin', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000012'::uuid, 'Quản trị tuyến Đà Nẵng', 'danang.admin@gis-tour.local', 'admin', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000013'::uuid, 'Nguyễn Thanh Tâm', 'tam.nguyen@example.com', 'user', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000014'::uuid, 'Trần Bảo Châu', 'chau.tran@example.com', 'user', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000015'::uuid, 'Lê Quốc Huy', 'huy.le@example.com', 'user', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000016'::uuid, 'Phạm Ngọc Hân', 'han.pham@example.com', 'user', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000017'::uuid, 'Đặng Minh Triết', 'triet.dang@example.com', 'user', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000018'::uuid, 'Vũ Khánh Ly', 'ly.vu@example.com', 'user', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000019'::uuid, 'Huỳnh Nhật Nam', 'nam.huynh@example.com', 'user', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000020'::uuid, 'Đỗ Minh Anh', 'minhanh.do@example.com', 'user', 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000021'::uuid, 'Bùi Phương Thảo', 'thao.bui@example.com', 'user', 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000022'::uuid, 'Cao Gia Bảo', 'bao.cao@example.com', 'user', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000023'::uuid, 'Mai Thu Trang', 'trang.mai@example.com', 'user', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=512&q=80'),
  ('05000000-0000-4000-8000-000000000024'::uuid, 'Hồ Duy Khánh', 'khanh.ho@example.com', 'user', 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=512&q=80')
)
INSERT INTO users (id, full_name, email, password_hash, role, avatar)
SELECT seed_users.id, seed_users.full_name, seed_users.email, seed_password.password_hash, seed_users.role, seed_users.avatar
FROM seed_users
CROSS JOIN seed_password;

INSERT INTO tour_plans (id, user_id, title, description, total_distance_km, estimated_duration_minutes) VALUES
('06000000-0000-4000-8000-000000000006', '05000000-0000-4000-8000-000000000013', 'Quảng Trị ký ức và biển', 'Lịch trình kết hợp Vịnh Mốc, Hiền Lương, Cửa Tùng và Mỹ Thủy.', 86.5, 660),
('06000000-0000-4000-8000-000000000007', '05000000-0000-4000-8000-000000000014', 'Huế lăng tẩm trong ngày', 'Tuyến lăng Minh Mạng, Khải Định, Thiên Mụ và chợ Đông Ba.', 34.2, 540),
('06000000-0000-4000-8000-000000000008', '05000000-0000-4000-8000-000000000015', 'Đà Nẵng biển và bán đảo', 'Mỹ Khê, Sơn Trà, Cầu Rồng và dịch vụ ven biển.', 29.4, 480),
('06000000-0000-4000-8000-000000000009', '05000000-0000-4000-8000-000000000016', 'Ngũ Hành Sơn - Hội An', 'Tuyến từ Đà Nẵng vào Hội An, phù hợp gia đình và nhóm nhỏ.', 38.8, 600),
('06000000-0000-4000-8000-000000000010', '05000000-0000-4000-8000-000000000017', 'Mỹ Sơn - làng nghề Hội An', 'Tuyến di sản Chăm, Thanh Hà, phố cổ và sông Hoài.', 72.0, 720),
('06000000-0000-4000-8000-000000000011', '05000000-0000-4000-8000-000000000018', 'Hội An sinh thái 2 ngày', 'Rừng dừa Bảy Mẫu, An Bàng, phố cổ và chợ đêm.', 22.6, 840),
('06000000-0000-4000-8000-000000000012', '05000000-0000-4000-8000-000000000019', 'Miền Trung 4 tỉnh', 'Tuyến mẫu dài ngày qua Quảng Trị, Huế, Đà Nẵng và Quảng Nam.', 302.5, 3600);

INSERT INTO tour_plan_details (id, tour_plan_id, destination_id, visit_order, note) VALUES
('06100000-0000-4000-8000-000000000014', '06000000-0000-4000-8000-000000000006', '03000000-0000-4000-8000-000000000017', 1, 'Dự kiến 2026-07-05 08:00-10:00. Theo dõi nhiệt độ và gió ven biển.'),
('06100000-0000-4000-8000-000000000015', '06000000-0000-4000-8000-000000000006', '03000000-0000-4000-8000-000000000019', 2, 'Dự kiến 2026-07-05 10:40-11:40. Dừng ngắn tại cụm cầu - sông.'),
('06100000-0000-4000-8000-000000000016', '06000000-0000-4000-8000-000000000006', '03000000-0000-4000-8000-000000000002', 3, 'Dự kiến 2026-07-05 15:00-17:00. Tắm biển cuối ngày.'),
('06100000-0000-4000-8000-000000000017', '06000000-0000-4000-8000-000000000006', '03000000-0000-4000-8000-000000000020', 4, 'Dự kiến 2026-07-06 08:00-10:00. Kiểm tra cảnh báo sóng.'),
('06100000-0000-4000-8000-000000000018', '06000000-0000-4000-8000-000000000007', '03000000-0000-4000-8000-000000000021', 1, 'Dự kiến 2026-07-12 08:00-10:00.'),
('06100000-0000-4000-8000-000000000019', '06000000-0000-4000-8000-000000000007', '03000000-0000-4000-8000-000000000022', 2, 'Dự kiến 2026-07-12 10:30-12:00.'),
('06100000-0000-4000-8000-000000000020', '06000000-0000-4000-8000-000000000007', '03000000-0000-4000-8000-000000000006', 3, 'Dự kiến 2026-07-12 15:00-16:00.'),
('06100000-0000-4000-8000-000000000021', '06000000-0000-4000-8000-000000000007', '03000000-0000-4000-8000-000000000023', 4, 'Dự kiến 2026-07-12 17:00-18:30. Ăn tối và mua đặc sản.'),
('06100000-0000-4000-8000-000000000022', '06000000-0000-4000-8000-000000000008', '03000000-0000-4000-8000-000000000025', 1, 'Dự kiến 2026-07-20 06:00-08:00.'),
('06100000-0000-4000-8000-000000000023', '06000000-0000-4000-8000-000000000008', '03000000-0000-4000-8000-000000000027', 2, 'Dự kiến 2026-07-20 09:00-11:00.'),
('06100000-0000-4000-8000-000000000024', '06000000-0000-4000-8000-000000000008', '03000000-0000-4000-8000-000000000028', 3, 'Dự kiến 2026-07-20 19:30-21:00.'),
('06100000-0000-4000-8000-000000000025', '06000000-0000-4000-8000-000000000009', '03000000-0000-4000-8000-000000000026', 1, 'Dự kiến 2026-08-04 08:00-10:30.'),
('06100000-0000-4000-8000-000000000026', '06000000-0000-4000-8000-000000000009', '03000000-0000-4000-8000-000000000032', 2, 'Dự kiến 2026-08-04 15:30-17:30.'),
('06100000-0000-4000-8000-000000000027', '06000000-0000-4000-8000-000000000009', '03000000-0000-4000-8000-000000000013', 3, 'Dự kiến 2026-08-04 18:30-21:00.'),
('06100000-0000-4000-8000-000000000028', '06000000-0000-4000-8000-000000000010', '03000000-0000-4000-8000-000000000029', 1, 'Dự kiến 2026-08-15 07:30-10:30.'),
('06100000-0000-4000-8000-000000000029', '06000000-0000-4000-8000-000000000010', '03000000-0000-4000-8000-000000000031', 2, 'Dự kiến 2026-08-15 14:30-16:00.'),
('06100000-0000-4000-8000-000000000030', '06000000-0000-4000-8000-000000000010', '03000000-0000-4000-8000-000000000016', 3, 'Dự kiến 2026-08-15 19:30-21:00.'),
('06100000-0000-4000-8000-000000000031', '06000000-0000-4000-8000-000000000011', '03000000-0000-4000-8000-000000000030', 1, 'Dự kiến 2026-08-21 08:30-11:00.'),
('06100000-0000-4000-8000-000000000032', '06000000-0000-4000-8000-000000000011', '03000000-0000-4000-8000-000000000032', 2, 'Dự kiến 2026-08-21 15:30-17:30.'),
('06100000-0000-4000-8000-000000000033', '06000000-0000-4000-8000-000000000011', '03000000-0000-4000-8000-000000000015', 3, 'Dự kiến 2026-08-21 18:30-20:30.'),
('06100000-0000-4000-8000-000000000034', '06000000-0000-4000-8000-000000000012', '03000000-0000-4000-8000-000000000018', 1, 'Ngày Quảng Trị trong tuyến 4 tỉnh.'),
('06100000-0000-4000-8000-000000000035', '06000000-0000-4000-8000-000000000012', '03000000-0000-4000-8000-000000000021', 2, 'Ngày Huế lăng tẩm.'),
('06100000-0000-4000-8000-000000000036', '06000000-0000-4000-8000-000000000012', '03000000-0000-4000-8000-000000000025', 3, 'Ngày Đà Nẵng biển.'),
('06100000-0000-4000-8000-000000000037', '06000000-0000-4000-8000-000000000012', '03000000-0000-4000-8000-000000000029', 4, 'Ngày Mỹ Sơn.'),
('06100000-0000-4000-8000-000000000038', '06000000-0000-4000-8000-000000000012', '03000000-0000-4000-8000-000000000013', 5, 'Kết thúc ở phố cổ Hội An.');

INSERT INTO reviews (id, user_id, destination_id, score, content, status, created_at) VALUES
('07000000-0000-4000-8000-000000000011', '05000000-0000-4000-8000-000000000013', '03000000-0000-4000-8000-000000000017', 5, 'Điểm lịch sử rất đáng đi, nên xem trước thời tiết vì tuyến ven biển khá nắng.', 'published', now() - interval '6 days'),
('07000000-0000-4000-8000-000000000012', '05000000-0000-4000-8000-000000000014', '03000000-0000-4000-8000-000000000019', 4, 'Tuyến dừng ngắn nhưng ý nghĩa, bản đồ nên gợi ý thêm bãi đỗ xe.', 'published', now() - interval '6 days'),
('07000000-0000-4000-8000-000000000013', '05000000-0000-4000-8000-000000000015', '03000000-0000-4000-8000-000000000021', 5, 'Không gian đẹp và dễ đi nếu có lộ trình rõ theo thứ tự lăng tẩm.', 'published', now() - interval '5 days'),
('07000000-0000-4000-8000-000000000014', '05000000-0000-4000-8000-000000000016', '03000000-0000-4000-8000-000000000022', 5, 'Kiến trúc rất ấn tượng, nên đi buổi sáng để tránh nắng.', 'published', now() - interval '5 days'),
('07000000-0000-4000-8000-000000000015', '05000000-0000-4000-8000-000000000017', '03000000-0000-4000-8000-000000000023', 4, 'Chợ đông nhưng nhiều món ngon, cần xem tình trạng giao thông trước khi đến.', 'published', now() - interval '4 days'),
('07000000-0000-4000-8000-000000000016', '05000000-0000-4000-8000-000000000018', '03000000-0000-4000-8000-000000000025', 5, 'Biển đẹp, thông tin gió và mưa theo giờ rất cần cho lịch tắm biển.', 'published', now() - interval '4 days'),
('07000000-0000-4000-8000-000000000017', '05000000-0000-4000-8000-000000000019', '03000000-0000-4000-8000-000000000026', 4, 'Nên có cảnh báo bậc thang và thời gian leo cho gia đình có trẻ nhỏ.', 'published', now() - interval '4 days'),
('07000000-0000-4000-8000-000000000018', '05000000-0000-4000-8000-000000000020', '03000000-0000-4000-8000-000000000027', 5, 'Đường lên Sơn Trà cần theo dõi giao thông, view rất đẹp.', 'published', now() - interval '3 days'),
('07000000-0000-4000-8000-000000000019', '05000000-0000-4000-8000-000000000021', '03000000-0000-4000-8000-000000000028', 4, 'Khu vực cuối tuần đông, bản đồ cảnh báo rất hữu ích.', 'published', now() - interval '3 days'),
('07000000-0000-4000-8000-000000000020', '05000000-0000-4000-8000-000000000022', '03000000-0000-4000-8000-000000000029', 5, 'Nên đi sớm vì đường xa và nắng mạnh vào trưa.', 'published', now() - interval '3 days'),
('07000000-0000-4000-8000-000000000021', '05000000-0000-4000-8000-000000000023', '03000000-0000-4000-8000-000000000030', 4, 'Trải nghiệm vui, cần đặt slot thuyền để tránh chờ.', 'published', now() - interval '2 days'),
('07000000-0000-4000-8000-000000000022', '05000000-0000-4000-8000-000000000024', '03000000-0000-4000-8000-000000000031', 4, 'Làng nghề phù hợp gia đình, nên có gợi ý thời lượng tham quan.', 'published', now() - interval '2 days'),
('07000000-0000-4000-8000-000000000023', '05000000-0000-4000-8000-000000000013', '03000000-0000-4000-8000-000000000032', 5, 'An Bàng rất hợp buổi chiều, cần xem mưa và gió trước khi đi.', 'published', now() - interval '2 days'),
('07000000-0000-4000-8000-000000000024', '05000000-0000-4000-8000-000000000014', '03000000-0000-4000-8000-000000000030', 4, 'Thuyền thúng đông vào cuối tuần nhưng điều phối tốt.', 'pending', now() - interval '1 day'),
('07000000-0000-4000-8000-000000000025', '05000000-0000-4000-8000-000000000015', '03000000-0000-4000-8000-000000000018', 5, 'Không gian trang nghiêm, nên có thông tin bối cảnh lịch sử ngắn gọn.', 'published', now() - interval '1 day');

INSERT INTO notifications (id, destination_id, title, content, type, status) VALUES
('08000000-0000-4000-8000-000000000006', '03000000-0000-4000-8000-000000000017', 'Vịnh Mốc nên đi buổi sáng', 'Khung 08:00-10:00 thường dễ tham quan hơn, tránh nắng gắt ven biển.', 'news', 'active'),
('08000000-0000-4000-8000-000000000007', '03000000-0000-4000-8000-000000000025', 'Mỹ Khê có gió mạnh buổi chiều', 'Du khách nên kiểm tra lớp thời tiết trước khi tắm biển sau 15:00.', 'warning', 'active'),
('08000000-0000-4000-8000-000000000008', '03000000-0000-4000-8000-000000000028', 'Cầu Rồng đông vào tối cuối tuần', 'Nên xem tình trạng giao thông trung tâm trước khi đến khu Cầu Rồng.', 'event', 'active'),
('08000000-0000-4000-8000-000000000009', '03000000-0000-4000-8000-000000000029', 'Mỹ Sơn ưu tiên khung sáng', 'Tuyến xa đô thị, nên xuất phát sớm và kiểm tra cảnh báo mưa rào.', 'news', 'active'),
('08000000-0000-4000-8000-000000000010', '03000000-0000-4000-8000-000000000030', 'Rừng dừa cần đặt lịch thuyền', 'Một số khung giờ cuối tuần có thể đông, nên đặt slot trước.', 'event', 'active'),
('08000000-0000-4000-8000-000000000011', '03000000-0000-4000-8000-000000000032', 'An Bàng theo dõi mưa ven biển', 'Lớp thời tiết tuần đã có dữ liệu quá khứ, hiện tại và tương lai gần.', 'warning', 'active'),
('08000000-0000-4000-8000-000000000012', NULL, 'Bổ sung dữ liệu temporal 7 ngày', 'Seed rich đã có dữ liệu thời tiết và giao thông nhiều mốc giờ cho toàn bộ điểm du lịch.', 'news', 'active');

WITH destination_weather AS (
  SELECT
    d.id AS destination_id,
    ST_X(d.location_geom) AS lon,
    ST_Y(d.location_geom) AS lat,
    p.code AS province_code,
    c.name AS category_name,
    CASE
      WHEN p.code = 'DNG' AND d.name ILIKE '%Bà Nà%' THEN 22.0
      WHEN p.code = 'DNG' AND d.name ILIKE '%Mỹ Khê%' THEN 29.5
      WHEN c.name = 'Bãi biển' THEN 30.0
      WHEN c.name = 'Sinh thái' THEN 27.8
      ELSE 28.6
    END AS base_temp,
    CASE
      WHEN c.name = 'Bãi biển' THEN 80
      WHEN p.code = 'DNG' AND d.name ILIKE '%Bà Nà%' THEN 86
      ELSE 76
    END AS base_humidity,
    CASE
      WHEN c.name = 'Bãi biển' THEN 18.0
      WHEN p.code = 'DNG' AND d.name ILIKE '%Sơn Trà%' THEN 15.0
      ELSE 9.0
    END AS base_wind
  FROM tourist_destinations d
  JOIN provinces p ON p.id = d.province_id
  LEFT JOIN destination_categories c ON c.id = d.category_id
),
time_slots(slot_index, day_offset, time_of_day, temp_delta, humidity_delta, wind_delta) AS (
  VALUES
  (1, -3, time '07:00', -1.4, 4, -2.0),
  (2, -3, time '12:00', 2.4, -5, 1.5),
  (3, -3, time '16:00', 0.6, 1, 3.0),
  (4, -3, time '20:00', -1.0, 5, 0.5),
  (1, -2, time '07:00', -1.2, 5, -1.5),
  (2, -2, time '12:00', 2.2, -4, 1.0),
  (3, -2, time '16:00', 0.4, 2, 2.5),
  (4, -2, time '20:00', -0.8, 5, 0.5),
  (1, -1, time '07:00', -1.0, 4, -1.0),
  (2, -1, time '12:00', 2.6, -6, 1.2),
  (3, -1, time '16:00', 0.9, 1, 3.2),
  (4, -1, time '20:00', -0.6, 4, 0.8),
  (1, 0, time '07:00', -0.8, 4, -1.0),
  (2, 0, time '12:00', 2.8, -5, 1.5),
  (3, 0, time '16:00', 1.0, 1, 3.4),
  (4, 0, time '20:00', -0.5, 5, 1.0),
  (1, 1, time '07:00', -0.9, 5, -1.2),
  (2, 1, time '12:00', 2.4, -4, 1.0),
  (3, 1, time '16:00', 0.3, 5, 4.0),
  (4, 1, time '20:00', -0.7, 7, 1.8),
  (1, 2, time '07:00', -1.1, 6, -0.8),
  (2, 2, time '12:00', 1.9, -2, 1.5),
  (3, 2, time '16:00', 0.0, 8, 4.5),
  (4, 2, time '20:00', -0.9, 9, 2.0),
  (1, 3, time '07:00', -1.0, 5, -1.0),
  (2, 3, time '12:00', 2.1, -3, 1.2),
  (3, 3, time '16:00', 0.5, 4, 3.0),
  (4, 3, time '20:00', -0.8, 6, 1.0)
)
INSERT INTO weather_info (destination_id, temperature, humidity, wind_speed, weather_status, location_geom, observed_at)
SELECT
  d.destination_id,
  ROUND((d.base_temp + t.temp_delta)::numeric, 1),
  LEAST(100, GREATEST(45, d.base_humidity + t.humidity_delta)),
  ROUND((d.base_wind + t.wind_delta)::numeric, 1),
  CASE
    WHEN d.province_code = 'DNG' AND t.slot_index = 1 AND t.day_offset IN (-1, 0, 1) THEN 'Có sương mù'
    WHEN t.day_offset IN (1, 2) AND t.slot_index IN (3, 4) THEN 'Mưa rào'
    WHEN d.category_name = 'Bãi biển' AND t.slot_index = 3 THEN 'Gió biển mạnh'
    WHEN t.slot_index = 2 AND d.base_temp + t.temp_delta >= 31 THEN 'Nắng nóng'
    WHEN t.slot_index = 4 THEN 'Nhiều mây'
    ELSE 'Nắng ráo'
  END,
  ST_SetSRID(ST_MakePoint(d.lon, d.lat), 4326),
  date_trunc('day', now()) + (t.day_offset * interval '1 day') + t.time_of_day
FROM destination_weather d
CROSS JOIN time_slots t;

WITH destination_traffic AS (
  SELECT
    d.id AS destination_id,
    ST_X(d.location_geom) AS lon,
    ST_Y(d.location_geom) AS lat,
    p.code AS province_code,
    c.name AS category_name,
    CASE
      WHEN d.name ILIKE '%Cầu Rồng%' THEN 'Cầu Rồng - Võ Văn Kiệt'
      WHEN d.name ILIKE '%Mỹ Khê%' THEN 'Võ Nguyên Giáp - Mỹ Khê'
      WHEN d.name ILIKE '%Hội An%' OR p.code = 'QNM' THEN 'Tuyến Hội An - Quảng Nam'
      WHEN p.code = 'TTH' THEN 'Tuyến trung tâm Huế - lăng tẩm'
      WHEN p.code = 'QT' THEN 'Tuyến ven biển và di tích Quảng Trị'
      ELSE 'Tuyến tham quan chính'
    END AS route_name,
    CASE
      WHEN d.name ILIKE '%Chợ%' OR d.name ILIKE '%Cầu Rồng%' OR d.name ILIKE '%Chợ đêm%' THEN 4
      WHEN d.name ILIKE '%Bà Nà%' OR d.name ILIKE '%Mỹ Khê%' OR d.name ILIKE '%Phố cổ%' THEN 3
      WHEN c.name = 'Bãi biển' THEN 2
      ELSE 2
    END AS base_level
  FROM tourist_destinations d
  JOIN provinces p ON p.id = d.province_id
  LEFT JOIN destination_categories c ON c.id = d.category_id
),
time_slots(slot_index, day_offset, time_of_day, level_delta) AS (
  VALUES
  (1, -3, time '07:00', -1),
  (2, -3, time '12:00', 0),
  (3, -3, time '16:00', 1),
  (4, -3, time '20:00', 1),
  (1, -2, time '07:00', 0),
  (2, -2, time '12:00', 0),
  (3, -2, time '16:00', 1),
  (4, -2, time '20:00', 0),
  (1, -1, time '07:00', -1),
  (2, -1, time '12:00', 0),
  (3, -1, time '16:00', 1),
  (4, -1, time '20:00', 1),
  (1, 0, time '07:00', 0),
  (2, 0, time '12:00', 1),
  (3, 0, time '16:00', 2),
  (4, 0, time '20:00', 1),
  (1, 1, time '07:00', 0),
  (2, 1, time '12:00', 1),
  (3, 1, time '16:00', 2),
  (4, 1, time '20:00', 2),
  (1, 2, time '07:00', -1),
  (2, 2, time '12:00', 0),
  (3, 2, time '16:00', 1),
  (4, 2, time '20:00', 1),
  (1, 3, time '07:00', 0),
  (2, 3, time '12:00', 1),
  (3, 3, time '16:00', 2),
  (4, 3, time '20:00', 1)
)
INSERT INTO traffic_info (destination_id, congestion_level, status, description, location_geom, observed_at)
SELECT
  d.destination_id,
  LEAST(5, GREATEST(0, d.base_level + t.level_delta)),
  CASE
    WHEN LEAST(5, GREATEST(0, d.base_level + t.level_delta)) >= 5 THEN 'Ùn tắc'
    WHEN LEAST(5, GREATEST(0, d.base_level + t.level_delta)) = 4 THEN 'Đông'
    WHEN LEAST(5, GREATEST(0, d.base_level + t.level_delta)) = 3 THEN 'Chậm'
    WHEN LEAST(5, GREATEST(0, d.base_level + t.level_delta)) = 2 THEN 'Ổn định'
    ELSE 'Thông thoáng'
  END,
  d.route_name || ' - dữ liệu seed theo ngày và khung giờ để demo temporal GIS.',
  ST_SetSRID(ST_MakePoint(d.lon, d.lat), 4326),
  date_trunc('day', now()) + (t.day_offset * interval '1 day') + t.time_of_day
FROM destination_traffic d
CROSS JOIN time_slots t;
