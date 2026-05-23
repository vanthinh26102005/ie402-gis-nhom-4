import { query } from "../config/db.js";

function parseBbox(bbox) {
  if (!bbox) {
    return null;
  }

  const values = String(bbox).split(",").map(Number);
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
    return null;
  }

  const [minLng, minLat, maxLng, maxLat] = values;
  if (minLng >= maxLng || minLat >= maxLat) {
    return null;
  }

  return { minLng, minLat, maxLng, maxLat };
}

export async function getDestinationGeoJson(filters = {}) {
  const bbox = parseBbox(filters.bbox);
  const result = await query(
    `
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(json_agg(feature), '[]'::json)
      ) AS geojson
      FROM (
        SELECT json_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(d.location_geom)::json,
          'properties', json_build_object(
            'id', d.id,
            'name', d.name,
            'provinceName', p.name,
            'provinceCode', p.code,
            'categoryId', c.id,
            'categoryName', c.name,
            'rating', d.rating,
            'ticketPrice', d.ticket_price,
            'address', d.address,
            'description', d.description,
            'imageUrl', d.image_url
          )
        ) AS feature
        FROM tourist_destinations d
        JOIN provinces p ON p.id = d.province_id
        LEFT JOIN destination_categories c ON c.id = d.category_id
        WHERE ($1::text IS NULL OR p.code = $1)
          AND ($2::uuid IS NULL OR c.id = $2)
          AND (
            $3::float8 IS NULL OR
            ST_Intersects(
              d.location_geom,
              ST_MakeEnvelope($3, $4, $5, $6, 4326)
            )
          )
        ORDER BY p.name, d.name
      ) features
    `,
    [
      filters.provinceCode || null,
      filters.categoryId || null,
      bbox?.minLng ?? null,
      bbox?.minLat ?? null,
      bbox?.maxLng ?? null,
      bbox?.maxLat ?? null,
    ],
  );

  return result.rows[0].geojson;
}

export async function getServiceGeoJson(filters = {}) {
  const bbox = parseBbox(filters.bbox);
  const result = await query(
    `
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(json_agg(feature), '[]'::json)
      ) AS geojson
      FROM (
        SELECT json_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(s.location_geom)::json,
          'properties', json_build_object(
            'id', s.id,
            'name', s.name,
            'type', s.type,
            'provinceName', p.name,
            'provinceCode', p.code,
            'rating', s.rating,
            'address', s.address,
            'phone', s.phone,
            'description', s.description
          )
        ) AS feature
        FROM service_facilities s
        JOIN provinces p ON p.id = s.province_id
        WHERE ($1::text IS NULL OR p.code = $1)
          AND ($2::text IS NULL OR s.type = $2)
          AND (
            $3::float8 IS NULL OR
            ST_Intersects(
              s.location_geom,
              ST_MakeEnvelope($3, $4, $5, $6, 4326)
            )
          )
        ORDER BY p.name, s.type, s.name
      ) features
    `,
    [
      filters.provinceCode || null,
      filters.type || null,
      bbox?.minLng ?? null,
      bbox?.minLat ?? null,
      bbox?.maxLng ?? null,
      bbox?.maxLat ?? null,
    ],
  );

  return result.rows[0].geojson;
}

export async function getProvinceGeoJson() {
  const result = await query(
    `
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(json_agg(feature), '[]'::json)
      ) AS geojson
      FROM (
        SELECT json_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(p.boundary_geom)::json,
          'properties', json_build_object(
            'id', p.id,
            'name', p.name,
            'code', p.code,
            'description', p.description
          )
        ) AS feature
        FROM provinces p
        WHERE p.boundary_geom IS NOT NULL
        ORDER BY p.name
      ) features
    `,
  );

  return result.rows[0].geojson;
}
