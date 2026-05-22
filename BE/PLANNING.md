# Backend Database Planning

## Muc Tieu

Thiet ke tang du lieu PostgreSQL/PostGIS cho he thong GIS du lich 2D, giup Backend API va Frontend dung chung mot nguon du lieu co cau truc ro rang.

Pham vi nay tap trung vao database layer cua `BE/`, vi source hien tai moi co ket noi PostgreSQL co ban qua `config/db.js`, Docker Compose, `.env.example`, va chua co schema/migration/seed.

Muc tieu cua task la lam don gian, dung muc cho do an sinh vien, nhung van co tinh thuc te:

- Co PostGIS de luu va query du lieu ban do 2D.
- Co schema toi thieu theo bao cao.
- Co seed data mien Trung: Quang Tri, Hue, Da Nang.
- Co huong dan reset DB ro rang cho may moi clone repo.
- San sang de Backend API build cac endpoint danh sach diem du lich, dich vu, thoi tiet, giao thong va GeoJSON.

## Pham Vi Source

Can xem va dieu chinh neu can:

- `BE/config/db.js`
- `BE/docker-compose.yml`
- `BE/.env.example`
- `BE/package.json`

Tao moi:

- `BE/db/schema.sql`
- `BE/db/seed.sql`
- `BE/db/README.md`
- `BE/db/queries/`
- `BE/db/migrations/` neu nhom muon quan ly version schema sau nay

Khong nen mo rong sang auth/API CRUD day du trong task nay. Phan API nen chi chuan bi query helper va response shape de phoi hop voi issue backend API.

## Huong Thiet Ke

### Nguyen Tac Don Gian

- Dung SQL thu cong de de review va phu hop do an.
- Tranh ORM trong giai do dau, vi du an dang dung `pg` truc tiep.
- Uu tien schema de hieu, khoa ngoai ro rang, constraint co ban.
- Dung `geometry(Point, 4326)` cho cac doi tuong co toa do.
- Dung `geometry(Polygon, 4326)` cho ranh gioi tinh, nhung seed co the de `NULL` neu chua co polygon chinh xac.
- Luu toa do theo chuan WGS84, thu tu PostGIS la `longitude, latitude`.

### Diem Lam Cho Du An Dac Biet Hon

Them mot lop logic nho nhung huu ich cho GIS du lich 2D:

- Tao index GIST cho cac cot geometry.
- Chuan bi query mau:
  - Lay destinations/services dang GeoJSON.
  - Tim dich vu gan mot diem du lich.
  - Loc diem du lich theo tinh/category.
  - Lay weather/traffic gan khu vuc ban do.
- Seed data theo tuyen du lich Quang Tri - Hue - Da Nang de FE co ban do lien mach thay vi du lieu roi rac.

## Database Schema Toi Thieu

### 1. Extension

Bat PostGIS trong `schema.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 2. Bang `provinces`

Dung cho tinh/thanh pho.

Cot chinh:

- `id uuid primary key`
- `name varchar(100) not null unique`
- `code varchar(20) not null unique`
- `description text`
- `boundary_geom geometry(Polygon, 4326)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### 3. Bang `destination_categories`

Dung cho loai hinh du lich.

Cot chinh:

- `id uuid primary key`
- `name varchar(100) not null unique`
- `description text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Seed goi y:

- Di tich lich su
- Bien dao
- Thien nhien
- Van hoa - tam linh

### 4. Bang `tourist_destinations`

Dung cho diem du lich/POI.

Cot chinh:

- `id uuid primary key`
- `province_id uuid not null references provinces(id)`
- `category_id uuid references destination_categories(id)`
- `name varchar(150) not null`
- `description text`
- `address text`
- `open_time time`
- `close_time time`
- `ticket_price numeric(12,2) default 0`
- `image_url text`
- `video_url text`
- `rating numeric(2,1) default 0 check (rating >= 0 and rating <= 5)`
- `location_geom geometry(Point, 4326) not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraint:

- Unique tuong doi: `(province_id, name)`.
- GIST index tren `location_geom`.

### 5. Bang `service_facilities`

Dung cho khach san, nha hang, y te, bai do xe, tram xang.

Cot chinh:

- `id uuid primary key`
- `province_id uuid not null references provinces(id)`
- `name varchar(150) not null`
- `type varchar(50) not null`
- `address text`
- `phone varchar(30)`
- `rating numeric(2,1) default 0 check (rating >= 0 and rating <= 5)`
- `description text`
- `location_geom geometry(Point, 4326) not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraint:

- `type in ('hotel', 'restaurant', 'parking', 'medical', 'gas_station', 'other')`
- GIST index tren `location_geom`.

### 6. Bang `users`

Dung cho nguoi dung va admin.

Cot chinh:

- `id uuid primary key`
- `full_name varchar(120) not null`
- `email varchar(150) not null unique`
- `password_hash text not null`
- `role varchar(20) not null default 'user'`
- `avatar text`
- `birthday date`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraint:

- `role in ('user', 'admin')`

Luu y: Khong seed password that. Neu can seed user test thi dung hash mau va ghi chu ro trong `seed.sql`.

### 7. Bang `tour_plans`

Dung cho metadata lich trinh.

Cot chinh:

- `id uuid primary key`
- `user_id uuid not null references users(id) on delete cascade`
- `title varchar(150) not null`
- `description text`
- `total_distance_km numeric(8,2)`
- `estimated_duration_minutes integer`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### 8. Bang `tour_plan_details`

Dung cho danh sach diem den trong tour.

Cot chinh:

- `id uuid primary key`
- `tour_plan_id uuid not null references tour_plans(id) on delete cascade`
- `destination_id uuid not null references tourist_destinations(id)`
- `visit_order integer not null`
- `note text`
- `created_at timestamptz not null default now()`

Constraint:

- Unique `(tour_plan_id, visit_order)`.
- Unique `(tour_plan_id, destination_id)`.

### 9. Bang `reviews`

Dung cho danh gia diem du lich.

Cot chinh:

- `id uuid primary key`
- `user_id uuid not null references users(id) on delete cascade`
- `destination_id uuid not null references tourist_destinations(id) on delete cascade`
- `content text`
- `score integer not null check (score >= 1 and score <= 5)`
- `status varchar(20) not null default 'published'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraint:

- `status in ('pending', 'published', 'hidden')`
- Unique `(user_id, destination_id)` neu moi user chi duoc danh gia mot lan.

### 10. Bang `notifications`

Dung cho thong bao theo diem du lich hoac thong bao chung.

Cot chinh:

- `id uuid primary key`
- `destination_id uuid references tourist_destinations(id) on delete set null`
- `title varchar(150) not null`
- `content text not null`
- `type varchar(50) not null`
- `status varchar(20) not null default 'active'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraint:

- `type in ('event', 'warning', 'maintenance', 'news')`
- `status in ('active', 'inactive')`

### 11. Bang `weather_info`

Dung cho thoi tiet tai diem/khu vuc.

Cot chinh:

- `id uuid primary key`
- `destination_id uuid references tourist_destinations(id) on delete set null`
- `temperature numeric(4,1)`
- `humidity integer check (humidity >= 0 and humidity <= 100)`
- `weather_status varchar(80)`
- `wind_speed numeric(5,2)`
- `location_geom geometry(Point, 4326) not null`
- `observed_at timestamptz not null default now()`
- `created_at timestamptz not null default now()`

Constraint:

- GIST index tren `location_geom`.

### 12. Bang `traffic_info`

Dung cho tinh trang giao thong tai diem/khu vuc. Trong pham vi sinh vien, dung Point thay vi LineString de don gian.

Cot chinh:

- `id uuid primary key`
- `destination_id uuid references tourist_destinations(id) on delete set null`
- `congestion_level integer not null check (congestion_level >= 0 and congestion_level <= 5)`
- `status varchar(80) not null`
- `description text`
- `location_geom geometry(Point, 4326) not null`
- `observed_at timestamptz not null default now()`
- `created_at timestamptz not null default now()`

Constraint:

- GIST index tren `location_geom`.

## Seed Data

Acceptance seed toi thieu:

- 3 provinces:
  - Quang Tri
  - Hue
  - Da Nang
- It nhat 6 tourist destinations:
  - Dia dao Vinh Moc
  - Thanh co Quang Tri
  - Kinh thanh Hue
  - Chua Thien Mu
  - Ngu Hanh Son
  - Ba Na Hills
- It nhat 6 service facilities:
  - Moi tinh co it nhat 2 dich vu.
  - Co du loai `hotel`, `restaurant`, `parking`, `medical` de FE test filter.
- It nhat 4 categories.
- Mot vai review, notification, weather, traffic mau.

Yeu cau seed:

- Dung toa do that gan dung khu vuc mien Trung.
- Dung `ST_SetSRID(ST_MakePoint(lng, lat), 4326)` cho Point.
- Seed nen co `ON CONFLICT DO NOTHING` hoac reset bang truoc khi insert de chay lai duoc.
- Khong can seed polygon ranh gioi tinh neu chua co du lieu chuan; co the de `boundary_geom = NULL`.

## Docker Va Moi Truong

### Docker Compose

`BE/docker-compose.yml` nen doi image:

```yaml
image: postgis/postgis:16-3.4
```

Ly do: image `postgres:latest` khong co san PostGIS, nen `CREATE EXTENSION postgis` co the fail tren may moi.

Volume hien tai nen kiem tra lai:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

### `.env.example`

Can dong bo voi Docker Compose:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=gis_user
DB_PASSWORD=gis_password
DB_DATABASE=gis_db
FRONTEND_URL=http://localhost:3000
```

## Script Va Lenh Chay

Nen them npm scripts trong `BE/package.json`:

```json
{
  "scripts": {
    "db:schema": "psql \"$DATABASE_URL\" -f db/schema.sql",
    "db:seed": "psql \"$DATABASE_URL\" -f db/seed.sql",
    "db:reset": "npm run db:schema && npm run db:seed"
  }
}
```

Neu khong dung `DATABASE_URL`, ghi huong dan Docker exec trong `BE/db/README.md`:

```bash
docker compose up -d
docker exec -i gis_postgres psql -U gis_user -d gis_db < db/schema.sql
docker exec -i gis_postgres psql -U gis_user -d gis_db < db/seed.sql
```

Reset sach DB:

```bash
docker compose down -v
docker compose up -d
docker exec -i gis_postgres psql -U gis_user -d gis_db < db/schema.sql
docker exec -i gis_postgres psql -U gis_user -d gis_db < db/seed.sql
```

## Query Helper Can Chuan Bi

Dat query SQL mau trong `BE/db/queries/` de backend API dung lai:

- `destinations.sql`
  - list destinations
  - filter by province/category
  - return GeoJSON geometry
- `services.sql`
  - list services
  - filter by type/province
  - find nearest services from longitude/latitude
- `geo.sql`
  - province polygons as GeoJSON
  - destinations/services as GeoJSON FeatureCollection
- `weather-traffic.sql`
  - latest weather by destination
  - latest traffic by destination

Response shape backend nen thong nhat:

```json
{
  "data": [],
  "meta": {},
  "error": null
}
```

GeoJSON response goi y:

```json
{
  "data": {
    "type": "FeatureCollection",
    "features": []
  },
  "meta": {},
  "error": null
}
```

## Thu Tu Thuc Hien

1. Cap nhat Docker Compose sang PostGIS image va sua volume path neu can.
2. Dong bo `.env.example` voi Docker Compose va `config/db.js`.
3. Tao `BE/db/schema.sql`.
4. Tao `BE/db/seed.sql`.
5. Tao `BE/db/README.md` voi lenh apply schema, seed, reset DB.
6. Them npm scripts neu chon chay qua `psql`.
7. Tao query SQL mau trong `BE/db/queries/`.
8. Chay Docker DB tu clean volume va apply schema/seed.
9. Verify bang SQL count va kiem tra SRID:

```sql
SELECT COUNT(*) FROM provinces;
SELECT COUNT(*) FROM tourist_destinations;
SELECT COUNT(*) FROM service_facilities;
SELECT ST_SRID(location_geom) FROM tourist_destinations LIMIT 1;
```

## Acceptance Criteria Checklist

- [ ] Docker DB chay duoc tren may moi clone repo.
- [ ] `CREATE EXTENSION postgis` thanh cong.
- [ ] Apply `schema.sql` thanh cong.
- [ ] Apply `seed.sql` thanh cong.
- [ ] Co it nhat 3 province.
- [ ] Co it nhat 6 tourist destinations.
- [ ] Co it nhat 6 service facilities.
- [ ] Cac bang GIS dung SRID 4326.
- [ ] Co GIST index cho cac cot geometry.
- [ ] `.env.example` ket noi duoc DB Docker mac dinh.
- [ ] Co huong dan reset DB ro rang trong `BE/db/README.md`.
- [ ] Query helper/SQL mau thong nhat voi response shape cua Backend API.

## Ranh Gioi Khong Lam Trong Task Nay

- Khong lam day du authentication/JWT.
- Khong lam admin CRUD hoan chinh.
- Khong import shapefile ranh gioi tinh that.
- Khong toi uu routing duong di thuc te.
- Khong them ORM neu chua co nhu cau ro rang.

Nhung cac diem tren co the la task tiep theo sau khi database layer on dinh.
