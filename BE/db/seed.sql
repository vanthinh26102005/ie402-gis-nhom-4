-- Demo seed data for Quang Tri, Hue, and Da Nang.
-- Coordinates use WGS84 longitude/latitude order for PostGIS Point values.

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

INSERT INTO provinces (id, name, code, description, boundary_geom) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Quang Tri',
  'QT',
  'Tinh mien Trung co nhieu di tich lich su, bien dao va cac diem du lich gan DMZ.',
  ST_GeomFromText('POLYGON((106.85 16.30, 107.40 16.30, 107.40 17.25, 106.85 17.25, 106.85 16.30))', 4326)
),
(
  '22222222-2222-2222-2222-222222222222',
  'Hue',
  'HUE',
  'Thanh pho di san voi quan the co do, song Huong, lang tam va diem den van hoa.',
  ST_GeomFromText('POLYGON((107.15 15.95, 108.20 15.95, 108.20 16.80, 107.15 16.80, 107.15 15.95))', 4326)
),
(
  '33333333-3333-3333-3333-333333333333',
  'Da Nang',
  'DNG',
  'Thanh pho bien va trung tam du lich cua mien Trung, ket noi Hue va Quang Nam.',
  ST_GeomFromText('POLYGON((107.80 15.85, 108.35 15.85, 108.35 16.25, 107.80 16.25, 107.80 15.85))', 4326)
);

INSERT INTO destination_categories (id, name, description) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Di tich lich su', 'Cac diem den gan voi lich su, chien tranh, co do va di san.'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Bien dao', 'Bai bien, dao va cac diem du lich ven bien.'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Thien nhien', 'Nui, hang dong, canh quan tu nhien va khu sinh thai.'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Van hoa - tam linh', 'Chua, den, lang nghe, dia diem van hoa va tin nguong.');

INSERT INTO tourist_destinations (
  id, province_id, category_id, name, description, address,
  open_time, close_time, ticket_price, image_url, video_url, rating, location_geom
) VALUES
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  '11111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'Dia dao Vinh Moc',
  'He thong dia dao lich su tai Vinh Linh, phu hop hien thi nhu mot diem tham quan lich su tren ban do.',
  'Vinh Thach, Vinh Linh, Quang Tri',
  '07:00',
  '17:00',
  50000,
  'https://example.com/images/dia-dao-vinh-moc.jpg',
  NULL,
  4.7,
  ST_SetSRID(ST_MakePoint(107.0981, 17.0833), 4326)
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
  '11111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'Thanh co Quang Tri',
  'Di tich lich su trung tam thi xa Quang Tri, la diem den quan trong trong tuyen du lich hoai niem.',
  'Phuong 2, thi xa Quang Tri, Quang Tri',
  '07:00',
  '18:00',
  0,
  'https://example.com/images/thanh-co-quang-tri.jpg',
  NULL,
  4.6,
  ST_SetSRID(ST_MakePoint(107.1894, 16.7506), 4326)
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
  '22222222-2222-2222-2222-222222222222',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'Kinh thanh Hue',
  'Quan the di tich co do Hue, phu hop lam diem neo chinh cho du lich di san tren ban do.',
  'Phu Hau, Hue',
  '07:00',
  '17:30',
  200000,
  'https://example.com/images/kinh-thanh-hue.jpg',
  NULL,
  4.8,
  ST_SetSRID(ST_MakePoint(107.5779, 16.4691), 4326)
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4',
  '22222222-2222-2222-2222-222222222222',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
  'Chua Thien Mu',
  'Ngoi chua noi tieng ben song Huong, gan trung tam Hue va de ket hop voi tour van hoa.',
  'Duong Nguyen Phuc Nguyen, Hue',
  '06:00',
  '18:00',
  0,
  'https://example.com/images/chua-thien-mu.jpg',
  NULL,
  4.7,
  ST_SetSRID(ST_MakePoint(107.5452, 16.4537), 4326)
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5',
  '33333333-3333-3333-3333-333333333333',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
  'Ngu Hanh Son',
  'Cum nui da voi hang dong, chua va tam nhin ra khu vuc bien phia nam Da Nang.',
  'Hoa Hai, Ngu Hanh Son, Da Nang',
  '07:00',
  '17:30',
  40000,
  'https://example.com/images/ngu-hanh-son.jpg',
  NULL,
  4.6,
  ST_SetSRID(ST_MakePoint(108.2647, 16.0044), 4326)
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6',
  '33333333-3333-3333-3333-333333333333',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
  'Ba Na Hills',
  'Khu du lich tren nui voi cap treo, cau Vang va khi hau mat me, phu hop demo route tu trung tam Da Nang.',
  'Hoa Ninh, Hoa Vang, Da Nang',
  '08:00',
  '17:00',
  900000,
  'https://example.com/images/ba-na-hills.jpg',
  NULL,
  4.5,
  ST_SetSRID(ST_MakePoint(107.9959, 15.9970), 4326)
);

INSERT INTO service_facilities (
  id, province_id, name, type, address, phone, rating, description, location_geom
) VALUES
(
  'cccccccc-cccc-cccc-cccc-ccccccccccc1',
  '11111111-1111-1111-1111-111111111111',
  'Khach san Sai Gon Dong Ha',
  'hotel',
  'Dong Ha, Quang Tri',
  '0233-000-0001',
  4.1,
  'Khach san demo gan trung tam Dong Ha de FE test lop dich vu luu tru.',
  ST_SetSRID(ST_MakePoint(107.1002, 16.8163), 4326)
),
(
  'cccccccc-cccc-cccc-cccc-ccccccccccc2',
  '11111111-1111-1111-1111-111111111111',
  'Nha hang Song Hieu',
  'restaurant',
  'Dong Ha, Quang Tri',
  '0233-000-0002',
  4.0,
  'Nha hang demo cho diem dung chan tren tuyen Quang Tri.',
  ST_SetSRID(ST_MakePoint(107.0959, 16.8137), 4326)
),
(
  'cccccccc-cccc-cccc-cccc-ccccccccccc3',
  '22222222-2222-2222-2222-222222222222',
  'Hue Heritage Hotel',
  'hotel',
  'Trung tam Hue',
  '0234-000-0001',
  4.3,
  'Khach san demo gan khu vuc Kinh thanh Hue.',
  ST_SetSRID(ST_MakePoint(107.5900, 16.4667), 4326)
),
(
  'cccccccc-cccc-cccc-cccc-ccccccccccc4',
  '22222222-2222-2222-2222-222222222222',
  'Bai do xe Hoang Thanh',
  'parking',
  'Gan Kinh thanh Hue',
  '0234-000-0002',
  3.9,
  'Bai do xe demo de test filter dich vu bai do.',
  ST_SetSRID(ST_MakePoint(107.5798, 16.4708), 4326)
),
(
  'cccccccc-cccc-cccc-cccc-ccccccccccc5',
  '33333333-3333-3333-3333-333333333333',
  'Trung tam y te Ngu Hanh Son',
  'medical',
  'Ngu Hanh Son, Da Nang',
  '0236-000-0001',
  4.0,
  'Diem y te demo gan khu vuc Ngu Hanh Son.',
  ST_SetSRID(ST_MakePoint(108.2580, 16.0138), 4326)
),
(
  'cccccccc-cccc-cccc-cccc-ccccccccccc6',
  '33333333-3333-3333-3333-333333333333',
  'Tram xang Hoa Vang',
  'gas_station',
  'Hoa Vang, Da Nang',
  '0236-000-0002',
  3.8,
  'Tram xang demo phuc vu route di Ba Na Hills.',
  ST_SetSRID(ST_MakePoint(108.0551, 16.0315), 4326)
);

INSERT INTO users (id, full_name, email, password_hash, role, avatar, birthday) VALUES
(
  'dddddddd-dddd-dddd-dddd-ddddddddddd1',
  'Demo User',
  'user.demo@gis.local',
  '$2b$10$demo.password.hash.for.local.seed.only',
  'user',
  NULL,
  '2002-01-15'
),
(
  'dddddddd-dddd-dddd-dddd-ddddddddddd2',
  'Admin Demo',
  'admin.demo@gis.local',
  '$2b$10$demo.password.hash.for.local.seed.only',
  'admin',
  NULL,
  '2000-09-01'
);

INSERT INTO tour_plans (
  id, user_id, title, description, total_distance_km, estimated_duration_minutes
) VALUES
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
  'dddddddd-dddd-dddd-dddd-ddddddddddd1',
  'Tuyen di san mien Trung 3 ngay',
  'Lich trinh demo ket noi Quang Tri, Hue va Da Nang cho FE test hien thi tour.',
  260.00,
  540
);

INSERT INTO tour_plan_details (tour_plan_id, destination_id, visit_order, note) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 1, 'Bat dau voi Thanh co Quang Tri.'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 2, 'Di chuyen vao Hue tham quan Kinh thanh.'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 3, 'Ket thuc bang Ngu Hanh Son tai Da Nang.');

INSERT INTO reviews (user_id, destination_id, content, score, status) VALUES
('dddddddd-dddd-dddd-dddd-ddddddddddd1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Diem den lich su ro rang, phu hop hoc tap va tham quan.', 5, 'published'),
('dddddddd-dddd-dddd-dddd-ddddddddddd1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Khu di san rong, can danh nhieu thoi gian de tham quan.', 5, 'published'),
('dddddddd-dddd-dddd-dddd-ddddddddddd2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 'Can hien thi them dich vu gan diem den tren ban do.', 4, 'published');

INSERT INTO notifications (destination_id, title, content, type, status) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Gio mo cua mua he', 'Khu vuc Kinh thanh Hue ap dung gio mo cua mua he trong du lieu demo.', 'news', 'active'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6', 'Luu y thoi tiet tren nui', 'Du khach nen kiem tra thoi tiet truoc khi di Ba Na Hills.', 'warning', 'active'),
(NULL, 'Du lieu demo GIS mien Trung', 'He thong da co du lieu mau cho Quang Tri, Hue va Da Nang.', 'news', 'active');

INSERT INTO weather_info (
  destination_id, temperature, humidity, weather_status, wind_speed, location_geom, observed_at
) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 27.5, 82, 'Nhieu may', 7.20, ST_SetSRID(ST_MakePoint(107.0981, 17.0833), 4326), now() - interval '1 hour'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 29.0, 76, 'Nang nhe', 5.50, ST_SetSRID(ST_MakePoint(107.5779, 16.4691), 4326), now() - interval '45 minutes'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 30.2, 70, 'Nang', 6.10, ST_SetSRID(ST_MakePoint(108.2647, 16.0044), 4326), now() - interval '30 minutes');

INSERT INTO traffic_info (
  destination_id, congestion_level, status, description, location_geom, observed_at
) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 1, 'Thong thoang', 'Duong vao Thanh co Quang Tri thong thoang trong du lieu demo.', ST_SetSRID(ST_MakePoint(107.1894, 16.7506), 4326), now() - interval '20 minutes'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 3, 'Dong cuc bo', 'Khu vuc quanh Kinh thanh Hue co the dong vao gio cao diem.', ST_SetSRID(ST_MakePoint(107.5779, 16.4691), 4326), now() - interval '15 minutes'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6', 2, 'On dinh', 'Tuyen duong len Ba Na Hills on dinh, phu hop demo routing.', ST_SetSRID(ST_MakePoint(107.9959, 15.9970), 4326), now() - interval '10 minutes');

COMMIT;
