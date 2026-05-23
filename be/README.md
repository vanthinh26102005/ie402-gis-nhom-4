# Backend API

Express API server for the GIS tourism project.

## Run

```powershell
npm --prefix be install
npm --prefix be run dev
```

The default backend URL is `http://localhost:3001`. Copy `be/.env.example` to `be/.env` when local overrides are needed.

## Environment

```text
PORT=3001
FRONTEND_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=gis_user
DB_PASSWORD=gis_password
DB_DATABASE=gis_db
```

## Response Shape

Success:

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

Error:

```json
{
  "data": null,
  "meta": {},
  "error": {
    "message": "Route GET /missing not found",
    "code": "NOT_FOUND"
  }
}
```

List endpoints include `meta.total`.

## Public Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/categories`
- `GET /api/destinations`
- `GET /api/destinations/:id`
- `GET /api/services`
- `GET /api/tours`
- `POST /api/tours`
- `GET /api/tours/:id`
- `GET /api/reviews`
- `POST /api/reviews`
- `GET /api/notifications`
- `GET /api/weather`
- `GET /api/traffic`

## Admin Endpoints

- `GET /api/admin/destinations`
- `GET /api/admin/destinations/:id`
- `POST /api/admin/destinations`
- `PUT /api/admin/destinations/:id`
- `DELETE /api/admin/destinations/:id`
- `GET /api/admin/services`
- `GET /api/admin/services/:id`
- `POST /api/admin/services`
- `PUT /api/admin/services/:id`
- `DELETE /api/admin/services/:id`
- `GET /api/admin/categories`
- `GET /api/admin/categories/:id`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/:id`
- `DELETE /api/admin/categories/:id`
- `GET /api/admin/notifications`
- `GET /api/admin/notifications/:id`
- `POST /api/admin/notifications`
- `PUT /api/admin/notifications/:id`
- `DELETE /api/admin/notifications/:id`
- `GET /api/admin/reviews`
- `GET /api/admin/reviews/:id`
- `PATCH /api/admin/reviews/:id/moderate`
- `GET /api/admin/weather`
- `GET /api/admin/weather/:id`
- `POST /api/admin/weather`
- `PUT /api/admin/weather/:id`
- `DELETE /api/admin/weather/:id`
- `GET /api/admin/traffic`
- `GET /api/admin/traffic/:id`
- `POST /api/admin/traffic`
- `PUT /api/admin/traffic/:id`
- `DELETE /api/admin/traffic/:id`

## Notes

Data is currently mock and in-memory so the frontend can integrate against stable contracts before DB/PostGIS work lands. Replace service implementations with shared query helpers when the database schema is ready.

Auth is a mock contract only. Login and register return a user object plus a `mock-token-*` token; no real password hashing, JWT signing, or authorization middleware is implemented yet.
