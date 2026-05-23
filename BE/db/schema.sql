-- PostgreSQL/PostGIS schema for the 2D tourism GIS backend.
-- This file is intentionally reset-friendly for student development:
-- running it drops and recreates all application tables.

BEGIN;

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS traffic_info CASCADE;
DROP TABLE IF EXISTS weather_info CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS tour_plan_details CASCADE;
DROP TABLE IF EXISTS tour_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS service_facilities CASCADE;
DROP TABLE IF EXISTS tourist_destinations CASCADE;
DROP TABLE IF EXISTS destination_categories CASCADE;
DROP TABLE IF EXISTS provinces CASCADE;

DROP FUNCTION IF EXISTS set_updated_at();

CREATE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE provinces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL UNIQUE,
  code varchar(20) NOT NULL UNIQUE,
  description text,
  boundary_geom geometry(Polygon, 4326),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE destination_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tourist_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  province_id uuid NOT NULL REFERENCES provinces(id) ON DELETE RESTRICT,
  category_id uuid REFERENCES destination_categories(id) ON DELETE SET NULL,
  name varchar(150) NOT NULL,
  description text,
  address text,
  open_time time,
  close_time time,
  ticket_price numeric(12,2) NOT NULL DEFAULT 0 CHECK (ticket_price >= 0),
  image_url text,
  video_url text,
  rating numeric(2,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  location_geom geometry(Point, 4326) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tourist_destinations_province_name_unique UNIQUE (province_id, name),
  CONSTRAINT tourist_destinations_open_close_check CHECK (
    open_time IS NULL OR close_time IS NULL OR open_time < close_time
  )
);

CREATE TABLE service_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  province_id uuid NOT NULL REFERENCES provinces(id) ON DELETE RESTRICT,
  name varchar(150) NOT NULL,
  type varchar(50) NOT NULL,
  address text,
  phone varchar(30),
  rating numeric(2,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  description text,
  location_geom geometry(Point, 4326) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT service_facilities_type_check CHECK (
    type IN ('hotel', 'restaurant', 'parking', 'medical', 'gas_station', 'other')
  ),
  CONSTRAINT service_facilities_province_name_unique UNIQUE (province_id, name)
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name varchar(120) NOT NULL,
  email varchar(150) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role varchar(20) NOT NULL DEFAULT 'user',
  avatar text,
  birthday date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'))
);

CREATE TABLE tour_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title varchar(150) NOT NULL,
  description text,
  total_distance_km numeric(8,2) CHECK (total_distance_km IS NULL OR total_distance_km >= 0),
  estimated_duration_minutes integer CHECK (
    estimated_duration_minutes IS NULL OR estimated_duration_minutes >= 0
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tour_plan_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_plan_id uuid NOT NULL REFERENCES tour_plans(id) ON DELETE CASCADE,
  destination_id uuid NOT NULL REFERENCES tourist_destinations(id) ON DELETE RESTRICT,
  visit_order integer NOT NULL CHECK (visit_order > 0),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tour_plan_details_order_unique UNIQUE (tour_plan_id, visit_order),
  CONSTRAINT tour_plan_details_destination_unique UNIQUE (tour_plan_id, destination_id)
);

CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  destination_id uuid NOT NULL REFERENCES tourist_destinations(id) ON DELETE CASCADE,
  content text,
  score integer NOT NULL CHECK (score >= 1 AND score <= 5),
  status varchar(20) NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_status_check CHECK (status IN ('pending', 'published', 'hidden')),
  CONSTRAINT reviews_user_destination_unique UNIQUE (user_id, destination_id)
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid REFERENCES tourist_destinations(id) ON DELETE SET NULL,
  title varchar(150) NOT NULL,
  content text NOT NULL,
  type varchar(50) NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notifications_type_check CHECK (type IN ('event', 'warning', 'maintenance', 'news')),
  CONSTRAINT notifications_status_check CHECK (status IN ('active', 'inactive'))
);

CREATE TABLE weather_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid REFERENCES tourist_destinations(id) ON DELETE SET NULL,
  temperature numeric(4,1),
  humidity integer CHECK (humidity IS NULL OR (humidity >= 0 AND humidity <= 100)),
  weather_status varchar(80),
  wind_speed numeric(5,2) CHECK (wind_speed IS NULL OR wind_speed >= 0),
  location_geom geometry(Point, 4326) NOT NULL,
  observed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE traffic_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid REFERENCES tourist_destinations(id) ON DELETE SET NULL,
  congestion_level integer NOT NULL CHECK (congestion_level >= 0 AND congestion_level <= 5),
  status varchar(80) NOT NULL,
  description text,
  location_geom geometry(Point, 4326) NOT NULL,
  observed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX provinces_boundary_geom_gix ON provinces USING gist (boundary_geom);
CREATE INDEX tourist_destinations_location_geom_gix ON tourist_destinations USING gist (location_geom);
CREATE INDEX service_facilities_location_geom_gix ON service_facilities USING gist (location_geom);
CREATE INDEX weather_info_location_geom_gix ON weather_info USING gist (location_geom);
CREATE INDEX traffic_info_location_geom_gix ON traffic_info USING gist (location_geom);

CREATE INDEX tourist_destinations_province_idx ON tourist_destinations (province_id);
CREATE INDEX tourist_destinations_category_idx ON tourist_destinations (category_id);
CREATE INDEX service_facilities_province_type_idx ON service_facilities (province_id, type);
CREATE INDEX reviews_destination_status_idx ON reviews (destination_id, status);
CREATE INDEX notifications_destination_status_idx ON notifications (destination_id, status);
CREATE INDEX weather_info_destination_observed_idx ON weather_info (destination_id, observed_at DESC);
CREATE INDEX traffic_info_destination_observed_idx ON traffic_info (destination_id, observed_at DESC);

CREATE TRIGGER provinces_set_updated_at
BEFORE UPDATE ON provinces
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER destination_categories_set_updated_at
BEFORE UPDATE ON destination_categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tourist_destinations_set_updated_at
BEFORE UPDATE ON tourist_destinations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER service_facilities_set_updated_at
BEFORE UPDATE ON service_facilities
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tour_plans_set_updated_at
BEFORE UPDATE ON tour_plans
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER reviews_set_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER notifications_set_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE provinces IS 'Province/city records for the tourism GIS map. boundary_geom is optional and uses SRID 4326.';
COMMENT ON TABLE tourist_destinations IS 'Tourism points of interest. location_geom is a Point in WGS84 longitude/latitude order.';
COMMENT ON TABLE service_facilities IS 'Support facilities such as hotels, restaurants, parking, medical centers, and gas stations.';
COMMENT ON TABLE weather_info IS 'Point-based weather observations for demo and API testing.';
COMMENT ON TABLE traffic_info IS 'Point-based traffic observations for demo and API testing.';

COMMIT;
