import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_LAYER_VISIBILITY,
  MAP_LAYERS,
  MAP_POINTS,
  TOURISM_ROUTE,
} from "./map-data.ts";

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
