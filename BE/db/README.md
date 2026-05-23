# Backend Database Documentation

This folder contains the PostgreSQL/PostGIS database layer for the 2D tourism GIS backend.

The setup is designed for a student project: simple to run, explicit to review, and still close to real backend practice.

## What This Database Supports

The schema supports these report entities:

- Province
- DestinationCategory
- TouristDestination
- ServiceFacility
- User
- TourPlan
- TourPlanDetail
- Review
- Notification
- WeatherInfo
- TrafficInfo

The physical SQL table names use snake_case:

- `provinces`
- `destination_categories`
- `tourist_destinations`
- `service_facilities`
- `users`
- `tour_plans`
- `tour_plan_details`
- `reviews`
- `notifications`
- `weather_info`
- `traffic_info`

## Requirements

Install these before running the database:

- Docker
- Docker Compose
- Node.js
- npm

No local `psql` installation is required for the default flow. The npm scripts run SQL through the existing Node `pg` dependency.

## Environment Variables

Copy the example file:

```bash
cd BE
cp .env.example .env
```

Default values:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

DB_PORT=5432
DB_HOST=localhost
DB_USER=gis_user
DB_PASSWORD=gis_password
DB_DATABASE=gis_db
DATABASE_URL=postgresql://gis_user:gis_password@localhost:5432/gis_db
```

`DATABASE_URL` is preferred by the database runner and `config/db.js`. If it is missing, the code falls back to `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_DATABASE`.

## Start The Database

From the backend folder:

```bash
cd BE
docker compose up -d
```

Check the container:

```bash
docker ps
```

Expected container name:

```text
gis_postgres
```

The Docker image is:

```text
postgis/postgis:16-3.4
```

This image is required because the plain `postgres` image does not include PostGIS.

## Apply Schema

From `BE/`:

```bash
npm run db:schema
```

This runs:

```bash
node db/scripts/run-sql.js db/schema.sql
```

Important behavior:

- `schema.sql` enables `postgis`.
- `schema.sql` enables `pgcrypto` for `gen_random_uuid()`.
- `schema.sql` drops and recreates application tables.
- Running `db:schema` will remove existing application data.

## Apply Seed Data

From `BE/`:

```bash
npm run db:seed
```

This inserts demo data for:

- Quang Tri
- Hue
- Da Nang

Minimum seed contents:

- 3 provinces
- 4 destination categories
- 6 tourist destinations
- 6 service facilities
- 2 users
- 1 tour plan
- 3 tour plan details
- 3 reviews
- 3 notifications
- 3 weather records
- 3 traffic records

## Reset Database

For normal development reset:

```bash
cd BE
npm run db:reset
```

This applies schema first, then seed:

```bash
npm run db:schema
npm run db:seed
```

For a full Docker volume reset:

```bash
cd BE
docker compose down -v
docker compose up -d
npm run db:reset
```

Use full volume reset when:

- The database container has stale state.
- PostGIS extension setup is broken.
- A teammate wants the same clean database from a fresh clone.

## Verify Database

After reset, run:

```bash
npm run db:verify
```

This checks:

- PostGIS is available.
- There are at least 3 provinces.
- There are at least 6 tourist destinations.
- There are at least 6 service facilities.
- All GIS geometry columns use SRID 4326.

If this command passes, the database satisfies the main acceptance criteria for this task.

## Geometry Rules

All map coordinates use SRID 4326.

Point columns:

- `tourist_destinations.location_geom geometry(Point, 4326)`
- `service_facilities.location_geom geometry(Point, 4326)`
- `weather_info.location_geom geometry(Point, 4326)`
- `traffic_info.location_geom geometry(Point, 4326)`

Polygon column:

- `provinces.boundary_geom geometry(Polygon, 4326)`

PostGIS point order is:

```text
longitude, latitude
```

Correct:

```sql
ST_SetSRID(ST_MakePoint(107.5779, 16.4691), 4326)
```

Incorrect:

```sql
ST_SetSRID(ST_MakePoint(16.4691, 107.5779), 4326)
```

The seeded province polygons are rough demo rectangles. They are useful for frontend map testing, but they are not official administrative boundaries.

## Main Tables

### `provinces`

Stores province/city records.

Important fields:

- `name`
- `code`
- `description`
- `boundary_geom`

Constraints:

- `name` is unique.
- `code` is unique.
- `boundary_geom` uses SRID 4326.

### `destination_categories`

Stores tourism categories such as historical, beach/island, nature, and culture/spiritual.

Important fields:

- `name`
- `description`

### `tourist_destinations`

Stores tourism points of interest.

Important fields:

- `province_id`
- `category_id`
- `name`
- `description`
- `address`
- `open_time`
- `close_time`
- `ticket_price`
- `rating`
- `location_geom`

Constraints:

- `(province_id, name)` is unique.
- `rating` must be from 0 to 5.
- `ticket_price` cannot be negative.
- `location_geom` is required.

### `service_facilities`

Stores supporting services for tourists.

Allowed service types:

- `hotel`
- `restaurant`
- `parking`
- `medical`
- `gas_station`
- `other`

Constraints:

- `(province_id, name)` is unique.
- `rating` must be from 0 to 5.
- `location_geom` is required.

### `users`

Stores normal users and admins.

Allowed roles:

- `user`
- `admin`

Note: Seed passwords are demo hash strings only. They are not real login credentials.

### `tour_plans` and `tour_plan_details`

`tour_plans` stores tour metadata.

`tour_plan_details` stores destinations in a tour and their visit order.

Constraints:

- A tour detail must reference one tour and one destination.
- `visit_order` must be greater than 0.
- One tour cannot reuse the same order number.
- One tour cannot include the same destination twice.

### `reviews`

Stores destination reviews.

Constraints:

- `score` must be from 1 to 5.
- `status` must be `pending`, `published`, or `hidden`.
- One user can review one destination once.

### `notifications`

Stores destination-specific or general notifications.

Allowed types:

- `event`
- `warning`
- `maintenance`
- `news`

Allowed statuses:

- `active`
- `inactive`

### `weather_info`

Stores point-based weather observations.

This is intentionally simple. It is enough for:

- showing weather markers on the map
- displaying latest weather for a destination
- testing weather APIs

### `traffic_info`

Stores point-based traffic observations.

For this project, traffic uses `Point` instead of `LineString`. That keeps the implementation simple while still allowing the frontend to show traffic markers and warnings.

## Indexes

Spatial GIST indexes exist on:

- `provinces.boundary_geom`
- `tourist_destinations.location_geom`
- `service_facilities.location_geom`
- `weather_info.location_geom`
- `traffic_info.location_geom`

Normal indexes exist for common filters:

- destination by province
- destination by category
- service by province and type
- review by destination and status
- notification by destination and status
- latest weather by destination
- latest traffic by destination

## Query Helpers

SQL examples are stored in `BE/db/queries/`.

These files are not automatically executed. They document the query shape that backend API services/controllers should reuse.

Recommended API response shape:

```json
{
  "data": [],
  "meta": {},
  "error": null
}
```

Recommended GeoJSON response shape:

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

### `queries/destinations.sql`

Contains:

- list destinations
- filter by province/category
- get destination detail with latest weather and traffic
- keyword search

### `queries/services.sql`

Contains:

- list services
- filter by province/type
- find nearest services from a coordinate
- find services near a destination

### `queries/geo.sql`

Contains:

- destinations as GeoJSON FeatureCollection
- services as GeoJSON FeatureCollection
- provinces as GeoJSON FeatureCollection

### `queries/weather-traffic.sql`

Contains:

- latest weather per destination
- latest traffic per destination
- weather inside a map viewport
- traffic inside a map viewport

## Verification SQL

After `npm run db:reset`, connect to the container:

```bash
docker exec -it gis_postgres psql -U gis_user -d gis_db
```

Check PostGIS:

```sql
SELECT postgis_full_version();
```

Check seed counts:

```sql
SELECT COUNT(*) AS province_count FROM provinces;
SELECT COUNT(*) AS destination_count FROM tourist_destinations;
SELECT COUNT(*) AS service_count FROM service_facilities;
```

Expected minimum:

```text
province_count >= 3
destination_count >= 6
service_count >= 6
```

Check geometry SRID:

```sql
SELECT DISTINCT ST_SRID(location_geom) FROM tourist_destinations;
SELECT DISTINCT ST_SRID(location_geom) FROM service_facilities;
SELECT DISTINCT ST_SRID(location_geom) FROM weather_info;
SELECT DISTINCT ST_SRID(location_geom) FROM traffic_info;
```

Expected result:

```text
4326
```

Check sample GeoJSON:

```sql
SELECT ST_AsGeoJSON(location_geom)::json
FROM tourist_destinations
LIMIT 1;
```

## Backend Usage Example

Use `config/db.js` in services or controllers:

```js
import { query } from "../config/db.js";

export async function listDestinations() {
  const result = await query(
    `
    SELECT id, name, rating, ST_AsGeoJSON(location_geom)::json AS geometry
    FROM tourist_destinations
    ORDER BY name
    `
  );

  return result.rows;
}
```

Do not concatenate user input into SQL strings.

Correct:

```js
await query("SELECT * FROM tourist_destinations WHERE id = $1", [id]);
```

Incorrect:

```js
await query(`SELECT * FROM tourist_destinations WHERE id = '${id}'`);
```

## Troubleshooting

### `type "geometry" does not exist`

PostGIS is not enabled or the database is not using the PostGIS image.

Fix:

```bash
cd BE
docker compose down -v
docker compose up -d
npm run db:reset
```

### `connect ECONNREFUSED 127.0.0.1:5432`

The database container is not running or is still starting.

Fix:

```bash
cd BE
docker compose up -d
docker ps
```

Then run:

```bash
npm run db:reset
```

### `database "gis_db" does not exist`

The Docker container was created with different environment values.

Fix:

```bash
cd BE
docker compose down -v
docker compose up -d
npm run db:reset
```

### Port `5432` is already in use

Another PostgreSQL service is using the same port.

Option 1: stop the other PostgreSQL service.

Option 2: change Docker port mapping in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"
```

Then update `.env`:

```env
DB_PORT=5433
DATABASE_URL=postgresql://gis_user:gis_password@localhost:5433/gis_db
```

## Implementation Boundary

This database layer does not implement:

- JWT authentication
- admin CRUD controllers
- route optimization
- real-time weather provider integration
- official province boundary import

Those should be separate backend issues after the database layer is stable.
