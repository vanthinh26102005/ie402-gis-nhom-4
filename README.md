# IE402 GIS Nhom 4 - Setup Guide

Tai lieu nay huong dan setup va chay toan bo du an gom:
- Backend: ExpressJS + PostgreSQL
- Frontend: Next.js

## 1) Yeu cau he thong

Can cai dat san:
- Node.js 20+
- npm 10+
- Docker Desktop (de chay PostgreSQL)

Kiem tra nhanh:

```powershell
node -v
npm -v
docker -v
docker compose version
```

## 2) Cau truc thu muc

```text
ie402-gis-nhom-4/
  be/    # backend
  fe/    # frontend
```

## 3) Cai dependencies

Chay tung lenh sau tai thu muc goc du an:

```powershell
npm --prefix be install
npm --prefix fe install
```

## 4) Chay PostgreSQL bang Docker

Backend dang dung ket noi DB qua cac bien moi truong sau:
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_DATABASE

Gia tri mac dinh phu hop voi file docker-compose hien tai trong [be/docker-compose.yml](be/docker-compose.yml):
- DB_HOST=localhost
- DB_PORT=5432
- DB_USER=gis_user
- DB_PASSWORD=gis_password
- DB_DATABASE=gis_db

Khoi dong DB:

```powershell
cd be
docker compose up -d
docker compose ps
```

Kiem tra DB san sang:

```powershell
docker exec gis_postgres pg_isready -U gis_user -d gis_db
```

Neu thay thong bao accepting connections la OK.

## 5) Chay Backend

Backend mac dinh dung cong 3000. De tranh trung cong voi frontend, nen chay backend o cong 3001:

```powershell
$env:PORT="3001"
$env:DB_HOST="localhost"
$env:DB_PORT="5432"
$env:DB_USER="gis_user"
$env:DB_PASSWORD="gis_password"
$env:DB_DATABASE="gis_db"
npm --prefix be run dev
```

Kiem tra nhanh backend:

```powershell
Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:3001/users" -UseBasicParsing
```

## 6) Chay Frontend

Mo terminal khac, chay:

```powershell
npm --prefix fe run dev
```

Truy cap:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 7) Quy trinh chay nhanh (copy paste)

```powershell
# 1) install
npm --prefix be install
npm --prefix fe install

# 2) db
cd be
docker compose up -d
cd ..

# 3) backend
$env:PORT="3001"
$env:DB_HOST="localhost"
$env:DB_PORT="5432"
$env:DB_USER="gis_user"
$env:DB_PASSWORD="gis_password"
$env:DB_DATABASE="gis_db"
npm --prefix be run dev

# 4) frontend (terminal moi)
npm --prefix fe run dev
```

## 8) Loi thuong gap

1. Docker chua bat
- Dau hieu: docker compose up -d bao loi ket noi engine.
- Cach sua: mo Docker Desktop, doi trang thai Running roi chay lai.

2. Port 3000 da duoc su dung
- Dau hieu: frontend khong len duoc o 3000.
- Cach sua: dung process dang chiem cong hoac de Next.js doi cong tu dong.

3. Backend khong ket noi DB
- Dau hieu: ECONNREFUSED khi backend start.
- Cach sua: dam bao container postgres dang Up, va bien DB_* dung nhu muc 4.

## 9) Dung he thong

Dung frontend/backend bang Ctrl + C tai cac terminal dang chay.
Dung DB container:

```powershell
cd be
docker compose down
```

## 10) Audit source code va backlog cai tien thuc te

Muc tieu uu tien la bien ung dung tu ban demo co nhieu man hinh sang cong cu WebGIS co the tin duoc khi nguoi dung lap lich trinh, xem rui ro di lai, va admin van hanh du lieu.

### 10.1 Noi dau thuc te cua nguoi dung

1. Luu tour chua that su luu ben vung.
- Frontend `FE/lib/api/tours.ts` da goi API `/tours` that; `FE/components/tours/CreateTourForm.tsx` da dung `react-hook-form`, lay diem den tu API va validate field-level.
- Backend `POST/GET/PUT/DELETE /api/tours` da bat auth, luu vao `tour_plans` va `tour_plan_details` theo `req.user.id`, chi cho user doc/sua/xoa tour cua minh.
- Viec con lai: lam trang danh sach/detail tour da luu, gan ket qua OSRM vao tour, va them test API ownership.

2. Review submit da tao review that trong DB tu user hien tai.
- Frontend `FE/lib/api/reviews.ts` da goi API `/reviews` that, khong con timeout fake.
- Backend `POST /api/reviews` da bat auth, lay `req.user.id`, insert vao bang `reviews` voi status `pending`.
- Public list chi tra review `published`; admin list/detail/moderate doc DB that.
- Viec con lai: them test auth/duplicate review va hien thong bao UX tot hon khi user chua dang nhap.

3. Route planner moi dung de ve duong, chua du ho tro quyet dinh di lai.
- UI co chon phuong tien, nhung request dang gui mac dinh `driving`.
- Map 2D da co layer weather/traffic that theo `observed_at`, nhung route planner chua tinh rui ro theo tung chang.
- De xuat: map phuong tien sang `driving/walking/cycling`, them nhieu waypoint, tinh tong gia ve, gio dong/mo cua, canh bao mua/un tac/cam duong theo chang, va goi y diem dung dich vu gan tuyen.

4. Du lieu va thong diep san pham dang lech nhau.
- Constants va homepage noi Quang Tri - Hue - Da Nang, trong khi seed/db local co the dang la cum HCM/HN/Da Nang/Hue hoac 3 province tuy moi truong.
- Tac dong: filter, copy tren UI, va demo de bi sai ngu canh.
- De xuat: khong hardcode tinh/thanh tren FE; lay province/category/count tu API.

### 10.2 Cac tab/trang con mock, thieu du lieu, hoac con tho so

| Khu vuc | Trang/file | Hien trang | Uu tien |
| --- | --- | --- | --- |
| Admin login | `FE/app/admin/login/page.tsx` | Da thay placeholder bang login form that; can tiep tuc verify role server-side neu can | Cao |
| Admin dashboard | `FE/app/admin/page.tsx` | Da doc KPI/API that, them weather/traffic stats va freshness coverage 24h; can tiep tuc them chart nang cao | Cao |
| Admin destinations form | `FE/components/admin/DestinationForm.tsx` | Da dung `react-hook-form`, validation field-level, categories/provinces tu API, submit create/update that | Done |
| Admin edit destination | `FE/app/admin/destinations/[id]/edit/page.tsx` | Da doc destination that qua API admin, khong dung `mockDestinations` | Done |
| Admin notifications | `FE/app/admin/notifications/page.tsx` | Con dung `mockNotifications` | Cao |
| Admin weather | `FE/app/admin/weather/page.tsx` | Da thay mock bang PostGIS CRUD, filter, pagination, stats, `react-hook-form` validation | Done |
| Admin traffic | `FE/app/admin/traffic/page.tsx` | Da thay mock bang PostGIS CRUD, filter, pagination, stats, `react-hook-form` validation | Done |
| Admin review detail | `FE/app/admin/reviews/[id]/moderate/page.tsx` | Da doc API admin that va moderate qua backend, khong dung `mockReviews` | Done |
| Tours create | `FE/components/tours/CreateTourForm.tsx` | Da dung API destination/tour that, `react-hook-form`, va backend Postgres theo user hien tai | Done |
| Destination detail | `FE/components/destinations/DestinationDetail.tsx` | Thoi tiet/giao thong hien thi nhu block demo, chua co action/khuyen nghi | Trung binh |
| Weather traffic user | `FE/components/weather-traffic/WeatherTrafficDashboard.tsx` | Copy con noi mock/demo, can doi sang ngon ngu du lieu that | Thap |

### 10.3 Cai tien UI/UX nen lam

1. Tang mat do thong tin co ich, giam card trang tri.
- Dashboard/admin nen uu tien KPI, hang doi, bang co filter, action ro rang.
- Cac man map/route nen co panel tac vu ngan gon, ket qua co trang thai va loi co cach khoi phuc.

2. Lam data states day du.
- Moi trang API can co loading skeleton, empty state co huong dan, error state co nut thu lai.
- Form submit can disable button khi dang luu va hien success/error gan noi nguoi dung thao tac.

3. Cai thien kha nang ra quyet dinh cua du khach.
- Destination card/detail nen hien "Dang mo cua/dong cua", khoang gia ve, thoi tiet moi nhat, muc un tac, va CTA "Them vao tour".
- Route result nen hien danh sach diem dung, thoi gian tham quan du kien, tong chi phi ve, canh bao theo tung diem.

4. Giam hardcode va copy lech du lieu.
- Province/category/count tren homepage, filter, admin dashboard phai lay tu API.
- Khong de UI noi "mien Trung" neu data seed dang co HCM/HN.

5. Nang accessibility.
- Error message dung `role="alert"`.
- Icon-only button can co `aria-label`.
- Bang lon can co `overflow-x-auto`; mobile nen co card layout cho cac danh sach quan trong.

### 10.4 Yeu cau admin va phan quyen

1. UI quan tri chi hien khi user co `role = admin`.
- Header/nav user khong nen lo link admin cho user thuong.
- Cac workspace nhu map/route chi render link `Quan tri` neu `user.role === "admin"`.
- Admin layout can chan non-admin bang man hinh "Khong co quyen quan tri".

2. Backend van la lop bao ve chinh.
- API `/api/admin/*` da co middleware `authenticate` va `requireAdmin`.
- Khong chi dua vao frontend guard vi user co the goi API truc tiep.

3. Nen bo fallback secret khi deploy.
- `JWT_SECRET` can bat buoc trong production.
- Can thong nhat chien luoc token: cookie HTTP-only la chinh, local/session storage chi nen dung toi thieu cho UI state.

### 10.5 Roadmap de trien khai tiep

1. Phase 1 - Lam du lieu that cho workflow cot loi.
- Tour CRUD Postgres.
- Review create Postgres + auth.
- Admin destination create/update/detail that.
- Admin review detail/moderate that.

2. Phase 2 - Hoan thien van hanh admin.
- Notifications CRUD Postgres.
- Weather/traffic CRUD Postgres da co cho admin; viec con lai la import CSV/GeoJSON va chart nang cao.
- Dashboard da co weather/traffic stats va data freshness; viec con lai la trend chart truc quan va lien ket den ban ghi can sua.

3. Phase 3 - Nang cap tra nghiem du khach.
- Multi-stop route planner.
- Tour saved detail page.
- Weather/traffic risk scoring theo tuyen.
- Goi y dich vu gan diem den/tuyen duong.

4. Phase 4 - Chat luong va demo.
- E2E test cho login admin, route planner, tao tour, submit review.
- Seed data thong nhat voi copy san pham.
- Build khong phu thuoc network font bang cach self-host font hoac dung system font.

### 10.6 Dap ung yeu cau do an GIS 2D

1. Quan ly va thong ke du lieu.
- Backend dang co PostGIS schema cho `tourist_destinations`, `service_facilities`, `weather_info`, `traffic_info`, `reviews`, `tour_plans`.
- Admin dashboard da doc KPI/API that, them weather/traffic stats, ti le freshness trong 24h, va canh bao du lieu thieu/cu.
- De dat rubric tot hon: them bieu do trend truc quan, import du lieu hang loat, va lien ket tu KPI den ban ghi can sua.

2. The hien du lieu tren ban do 2D.
- `/map` da render marker diem den, dich vu, weather, traffic tren Leaflet/OpenStreetMap.
- Layer panel cho phep bat/tat tung lop: destinations, services, weather, traffic, route.
- Weather/traffic marker dung toa do PostGIS `location_geom`, tra ve them `geometry` GeoJSON va `location` lat/lng.

3. Du lieu tren ban do thay doi theo thoi gian.
- API `GET /api/weather` va `GET /api/traffic` da ho tro:
  - `mode=latest`: ban ghi moi nhat moi diem.
  - `mode=at&at=<ISO date>`: ban ghi moi nhat tai hoac truoc moc thoi gian.
  - `mode=all&from=<ISO date>&to=<ISO date>&bbox=minLng,minLat,maxLng,maxLat&limit=1000`: timeline de ve ban do theo thoi gian va loc khong gian.
- `/map` da co Temporal GIS slider/playback, mode `Moi nhat / Tai moc / Tich luy`, toggle chi hien canh bao, va legend mau cho weather/traffic.
- Logic chon ban ghi theo thoi gian nam o `FE/lib/map/temporal.ts` va co test trong `FE/lib/map-data.test.ts`.

4. Gap con lai de do an thuyet phuc hon.
- Admin weather/traffic da co CRUD PostGIS that; can them import CSV/GeoJSON neu can demo nhanh.
- Them choropleth/heatmap theo province hoac grid neu mon hoc yeu cau thong ke khong gian ro hon marker.
- Fetch weather/traffic theo bbox khi map pan/zoom de tranh load tat ca du lieu khi seed lon.
- Tinh route-risk bang weather/traffic gan tuyen thay vi chi hien marker doc lap.
- Them endpoint aggregate nhu `/api/weather/stats` va `/api/traffic/stats` de dashboard thong ke khong phai tinh o client.
