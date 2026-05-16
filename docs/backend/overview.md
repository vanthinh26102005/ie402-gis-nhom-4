# Backend Guide

## Stack

Backend hiện tại nằm trong `be/`:

- Node.js.
- Express.js.
- PostgreSQL qua `pg`.
- Docker Compose cho database.

Source hiện có:

- `be/server.js`
- `be/config/db.js`
- `be/routes/index.js`
- `be/routes/users.js`
- `be/docker-compose.yml`
- `be/.env.example`

## Mục Tiêu Kiến Trúc

Backend nên tách rõ các lớp:

```text
be/
  config/
  controllers/
  routes/
  services/
  middlewares/
  db/
  utils/
  server.js
```

Không nên viết toàn bộ logic trong route. Route chỉ nhận request và gọi controller/service.

## API Group Đề Xuất

### System

- `GET /api/health`

### Auth/User

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`

### Destinations

- `GET /api/destinations`
- `GET /api/destinations/:id`
- `POST /api/admin/destinations`
- `PUT /api/admin/destinations/:id`
- `DELETE /api/admin/destinations/:id`

### Categories

- `GET /api/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/:id`
- `DELETE /api/admin/categories/:id`

### Services

- `GET /api/services`
- `POST /api/admin/services`
- `PUT /api/admin/services/:id`
- `DELETE /api/admin/services/:id`

### Tours

- `GET /api/tours`
- `POST /api/tours`
- `GET /api/tours/:id`

### Reviews

- `GET /api/reviews`
- `POST /api/reviews`
- `GET /api/admin/reviews`
- `PATCH /api/admin/reviews/:id/moderate`

### Notifications, Weather, Traffic

- `GET /api/notifications`
- `GET /api/weather`
- `GET /api/traffic`
- `POST/PUT/DELETE /api/admin/notifications`
- `POST/PUT /api/admin/weather`
- `POST/PUT /api/admin/traffic`

### GIS/GeoJSON

- `GET /api/geo/provinces`
- `GET /api/geo/roads`
- `GET /api/geo/tourist-places`
- `GET /api/geo/services`

## Response Shape Gợi Ý

```json
{
  "data": [],
  "meta": {},
  "error": null
}
```

Với lỗi:

```json
{
  "data": null,
  "meta": {},
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR"
  }
}
```

## Environment

`.env.example` nên giữ đủ:

- `PORT=3001`
- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USER=gis_user`
- `DB_PASSWORD=gis_password`
- `DB_DATABASE=gis_db`
- `FRONTEND_URL=http://localhost:3000`

## Testing Tối Thiểu

- Backend start không lỗi.
- `GET /api/health` trả `200`.
- Database connect được.
- API list destinations/services trả JSON.
- Admin CRUD trả status đúng.
