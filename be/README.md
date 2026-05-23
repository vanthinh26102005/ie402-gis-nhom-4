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
JWT_SECRET=change-this-long-random-secret
BCRYPT_SALT_ROUNDS=10
RESET_PASSWORD_TOKEN_MINUTES=15
MAIL_FROM=GIS Tourism <no-reply@gis.local>
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=username
# SMTP_PASSWORD=password
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
- `POST /api/auth/forgot-password`
- `PATCH /api/auth/reset-password/:token`
- `POST /api/auth/logout`
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

Auth uses PostgreSQL, bcrypt password hashing, JWT access tokens, and an HTTP-only `accessToken` cookie. The demo seed users are:

- `user.demo@gis.local` / `Password123!`
- `admin.demo@gis.local` / `Password123!`

When SMTP settings are not provided, reset-password email content is written to the backend console for local development.

## Auth Examples

### Register

`POST /api/auth/register`

```json
{
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

Response `201`:

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nguyen Van A",
      "email": "a@example.com",
      "role": "user",
      "avatar": null,
      "birthday": null,
      "createdAt": "2026-05-23T12:00:00.000Z",
      "updatedAt": "2026-05-23T12:00:00.000Z"
    },
    "accessToken": "jwt",
    "expiresIn": "2h"
  },
  "meta": {},
  "error": null
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "a@example.com",
  "password": "Password123!",
  "rememberMe": true
}
```

Response `200` sets an HTTP-only `accessToken` cookie:

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nguyen Van A",
      "email": "a@example.com",
      "role": "user",
      "avatar": null,
      "birthday": null,
      "createdAt": "2026-05-23T12:00:00.000Z",
      "updatedAt": "2026-05-23T12:00:00.000Z"
    },
    "rememberMe": true,
    "accessToken": "jwt",
    "expiresIn": "30d"
  },
  "meta": {},
  "error": null
}
```

### Current User

`GET /api/users/me`

Send the cookie automatically from the browser, or use:

```text
Authorization: Bearer jwt
```

Response `200`:

```json
{
  "data": {
    "id": "uuid",
    "name": "Nguyen Van A",
    "email": "a@example.com",
    "role": "user",
    "avatar": null,
    "birthday": null,
    "createdAt": "2026-05-23T12:00:00.000Z",
    "updatedAt": "2026-05-23T12:00:00.000Z"
  },
  "meta": {},
  "error": null
}
```

### Forgot Password

`POST /api/auth/forgot-password`

```json
{
  "email": "a@example.com"
}
```

Response `200`:

```json
{
  "data": {
    "message": "If the email exists, a password reset link has been sent."
  },
  "meta": {},
  "error": null
}
```

### Reset Password

`PATCH /api/auth/reset-password/:token`

```json
{
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

Response `200`:

```json
{
  "data": {
    "message": "Password has been reset successfully."
  },
  "meta": {},
  "error": null
}
```

### Logout

`POST /api/auth/logout`

Response `200` clears the auth cookie:

```json
{
  "data": {
    "message": "Logged out successfully."
  },
  "meta": {},
  "error": null
}
```
