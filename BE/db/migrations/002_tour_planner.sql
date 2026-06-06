BEGIN;

ALTER TABLE tour_plans
  ADD COLUMN IF NOT EXISTS status varchar(20) NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS end_date date,
  ADD COLUMN IF NOT EXISTS party_size integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS budget numeric(14,2),
  ADD COLUMN IF NOT EXISTS travel_mode varchar(30) NOT NULL DEFAULT 'car',
  ADD COLUMN IF NOT EXISTS pace varchar(20) NOT NULL DEFAULT 'balanced';

ALTER TABLE tour_plan_details
  ADD COLUMN IF NOT EXISTS day_number integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS arrival_time time,
  ADD COLUMN IF NOT EXISTS departure_time time,
  ADD COLUMN IF NOT EXISTS stay_minutes integer NOT NULL DEFAULT 90,
  ADD COLUMN IF NOT EXISTS estimated_cost numeric(12,2) NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tour_plans_status_check') THEN
    ALTER TABLE tour_plans ADD CONSTRAINT tour_plans_status_check
      CHECK (status IN ('draft', 'planned', 'active', 'completed', 'cancelled'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tour_plans_travel_mode_check') THEN
    ALTER TABLE tour_plans ADD CONSTRAINT tour_plans_travel_mode_check
      CHECK (travel_mode IN ('car', 'motorbike', 'walk_transit'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tour_plans_pace_check') THEN
    ALTER TABLE tour_plans ADD CONSTRAINT tour_plans_pace_check
      CHECK (pace IN ('compact', 'balanced', 'relaxed'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tour_plans_date_range_check') THEN
    ALTER TABLE tour_plans ADD CONSTRAINT tour_plans_date_range_check
      CHECK (start_date IS NULL OR end_date IS NULL OR end_date >= start_date);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS tour_plan_legs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_plan_id uuid NOT NULL REFERENCES tour_plans(id) ON DELETE CASCADE,
  from_destination_id uuid NOT NULL REFERENCES tourist_destinations(id) ON DELETE RESTRICT,
  to_destination_id uuid NOT NULL REFERENCES tourist_destinations(id) ON DELETE RESTRICT,
  leg_order integer NOT NULL CHECK (leg_order > 0),
  travel_mode varchar(30) NOT NULL DEFAULT 'car',
  distance_km numeric(8,2) CHECK (distance_km IS NULL OR distance_km >= 0),
  duration_minutes integer CHECK (duration_minutes IS NULL OR duration_minutes >= 0),
  route_geometry jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tour_plan_legs_order_unique UNIQUE (tour_plan_id, leg_order),
  CONSTRAINT tour_plan_legs_endpoints_check CHECK (from_destination_id <> to_destination_id),
  CONSTRAINT tour_plan_legs_travel_mode_check CHECK (
    travel_mode IN ('car', 'motorbike', 'walk_transit')
  )
);

CREATE INDEX IF NOT EXISTS tour_plans_user_status_idx
  ON tour_plans (user_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS tour_plan_legs_tour_idx
  ON tour_plan_legs (tour_plan_id, leg_order);

COMMIT;
