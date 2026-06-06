import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_LAYER_VISIBILITY,
  MAP_LAYERS,
  MAP_POINTS,
  TOURISM_ROUTE,
} from "./map-data.ts";
import {
  buildSteppedTemporalTicks,
  buildTemporalTicks,
  filterObservationsByDestination,
  pickLatestByTime,
  pickTemporalObservations,
} from "./map/temporal.ts";
import { estimateRouteTravelTime } from "./routing/estimate.ts";
import type { RouteResult } from "./types/routing.ts";
import type { TrafficInfo, WeatherInfo } from "./types/weather-traffic.ts";

test("map data exposes toggleable tourism and service layers", () => {
  const pointLayerIds = new Set(MAP_POINTS.map((point) => point.layerId));

  assert.ok(pointLayerIds.has("destinations"));
  assert.ok(pointLayerIds.has("services"));
  assert.ok(pointLayerIds.size >= 2);

  for (const layer of MAP_LAYERS) {
    assert.equal(typeof DEFAULT_LAYER_VISIBILITY[layer.id], "boolean");
    assert.ok(layer.label.length > 0);
    assert.ok(layer.description.length > 0);
  }
});

test("destination markers link to destination detail pages", () => {
  const destinationPoints = MAP_POINTS.filter(
    (point) => point.layerId === "destinations",
  );

  assert.ok(destinationPoints.length >= 3);

  for (const point of destinationPoints) {
    assert.match(point.href, /^\/destinations\/[a-z0-9-]+$/);
    assert.ok(point.name.length > 0);
    assert.ok(point.province.length > 0);
    assert.ok(point.position[0] >= -90 && point.position[0] <= 90);
    assert.ok(point.position[1] >= -180 && point.position[1] <= 180);
  }
});

test("tourism route has enough coordinates to render a polyline", () => {
  assert.ok(TOURISM_ROUTE.length >= 3);
});

test("temporal GIS picks the latest observation available at a selected time", () => {
  const observations: WeatherInfo[] = [
    {
      weather_id: "w-1",
      destination_id: "hue",
      temperature: 28,
      humidity: 72,
      weather_status: "Nhiều mây",
      wind_speed: 4,
      observed_at: "2026-05-01T08:00:00.000Z",
    },
    {
      weather_id: "w-2",
      destination_id: "hue",
      temperature: 30,
      humidity: 68,
      weather_status: "Nắng ráo",
      wind_speed: 5,
      observed_at: "2026-05-01T10:00:00.000Z",
    },
    {
      weather_id: "w-3",
      destination_id: "danang",
      temperature: 31,
      humidity: 66,
      weather_status: "Nắng nóng",
      wind_speed: 7,
      observed_at: "2026-05-01T09:00:00.000Z",
    },
  ];

  assert.deepEqual(buildTemporalTicks(observations), [
    Date.parse("2026-05-01T08:00:00.000Z"),
    Date.parse("2026-05-01T09:00:00.000Z"),
    Date.parse("2026-05-01T10:00:00.000Z"),
  ]);

  const visible = pickLatestByTime(observations, Date.parse("2026-05-01T09:30:00.000Z"));

  assert.deepEqual(
    visible.map((item) => item.weather_id).sort(),
    ["w-1", "w-3"],
  );
});

test("temporal GIS builds timeline using a user-selected step", () => {
  const observations: WeatherInfo[] = [
    {
      weather_id: "w-1",
      destination_id: "hue",
      temperature: 28,
      humidity: 72,
      weather_status: "Nhiều mây",
      wind_speed: 4,
      observed_at: "2026-05-01T08:20:00.000Z",
    },
    {
      weather_id: "w-2",
      destination_id: "hue",
      temperature: 30,
      humidity: 68,
      weather_status: "Nắng ráo",
      wind_speed: 5,
      observed_at: "2026-05-01T10:10:00.000Z",
    },
  ];

  assert.deepEqual(buildSteppedTemporalTicks(observations, 60), [
    Date.parse("2026-05-01T08:00:00.000Z"),
    Date.parse("2026-05-01T09:00:00.000Z"),
    Date.parse("2026-05-01T10:00:00.000Z"),
    Date.parse("2026-05-01T11:00:00.000Z"),
  ]);

  assert.deepEqual(
    buildSteppedTemporalTicks(observations, 60, {
      startTime: Date.parse("2026-05-01T09:00:00.000Z"),
      endTime: Date.parse("2026-05-01T10:00:00.000Z"),
    }),
    [
      Date.parse("2026-05-01T09:00:00.000Z"),
      Date.parse("2026-05-01T10:00:00.000Z"),
    ],
  );
});

test("temporal GIS supports latest and cumulative modes", () => {
  const observations: WeatherInfo[] = [
    {
      weather_id: "w-1",
      destination_id: "hue",
      temperature: 28,
      humidity: 72,
      weather_status: "Nhiều mây",
      wind_speed: 4,
      observed_at: "2026-05-01T08:00:00.000Z",
    },
    {
      weather_id: "w-2",
      destination_id: "hue",
      temperature: 30,
      humidity: 68,
      weather_status: "Nắng ráo",
      wind_speed: 5,
      observed_at: "2026-05-01T10:00:00.000Z",
    },
    {
      weather_id: "w-3",
      destination_id: "danang",
      temperature: 31,
      humidity: 66,
      weather_status: "Nắng nóng",
      wind_speed: 7,
      observed_at: "2026-05-01T09:00:00.000Z",
    },
  ];

  const latest = pickTemporalObservations(observations, null, "latest");
  const cumulative = pickTemporalObservations(
    observations,
    Date.parse("2026-05-01T09:30:00.000Z"),
    "cumulative",
  );

  assert.deepEqual(
    latest.map((item) => item.weather_id).sort(),
    ["w-2", "w-3"],
  );
  assert.deepEqual(
    cumulative.map((item) => item.weather_id).sort(),
    ["w-1", "w-3"],
  );
});

test("temporal GIS can focus observations on one destination", () => {
  const observations: WeatherInfo[] = [
    {
      weather_id: "w-1",
      destination_id: "hue",
      temperature: 28,
      humidity: 72,
      weather_status: "Nhiều mây",
      wind_speed: 4,
      observed_at: "2026-05-01T08:00:00.000Z",
    },
    {
      weather_id: "w-2",
      destination_id: "danang",
      temperature: 31,
      humidity: 66,
      weather_status: "Nắng nóng",
      wind_speed: 7,
      observed_at: "2026-05-01T09:00:00.000Z",
    },
  ];

  assert.deepEqual(
    filterObservationsByDestination(observations, "hue").map((item) => item.weather_id),
    ["w-1"],
  );
  assert.deepEqual(filterObservationsByDestination(observations, null), []);
});

test("route ETA reduces effective speed when traffic and weather risk are high", () => {
  const route: RouteResult = {
    distanceMeters: 120000,
    durationSeconds: 9000,
    geometry: {
      type: "LineString",
      coordinates: [
        [107.58, 16.47],
        [108.2, 16.05],
      ],
    },
    profile: "driving",
    source: "osrm",
    waypoints: [],
  };
  const riskyTraffic: TrafficInfo[] = [
    {
      congestion_level: "Ùn tắc",
      description: "Mật độ cao",
      observed_at: "2026-05-01T09:00:00.000Z",
      status: "Kẹt xe giờ cao điểm",
      traffic_id: "traffic-1",
    },
  ];
  const riskyWeather: WeatherInfo[] = [
    {
      humidity: 92,
      observed_at: "2026-05-01T09:00:00.000Z",
      temperature: 34,
      weather_id: "weather-1",
      weather_status: "Mưa bão",
      wind_speed: 31,
    },
  ];

  const baseline = estimateRouteTravelTime({
    pace: 2,
    route,
    traffic: [],
    travelMode: "car",
    weather: [],
  });
  const risky = estimateRouteTravelTime({
    pace: 2,
    route,
    traffic: riskyTraffic,
    travelMode: "car",
    weather: riskyWeather,
  });

  assert.ok(baseline);
  assert.ok(risky);
  assert.ok(risky.effectiveSpeedKmh < baseline.effectiveSpeedKmh);
  assert.ok(risky.totalDurationSeconds > baseline.totalDurationSeconds);
  assert.ok(risky.congestionFactor < 1);
  assert.ok(risky.weatherFactor < 1);
});
