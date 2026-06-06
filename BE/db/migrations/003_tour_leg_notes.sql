BEGIN;

ALTER TABLE tour_plan_legs
  ADD COLUMN IF NOT EXISTS title varchar(150),
  ADD COLUMN IF NOT EXISTS note text,
  ADD COLUMN IF NOT EXISTS departure_time time;

COMMIT;
