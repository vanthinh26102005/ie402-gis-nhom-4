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
