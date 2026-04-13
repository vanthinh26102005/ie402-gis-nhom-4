'use client';

import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Supercluster from 'supercluster';
import { useMapStore } from '@/stores/mapStore';
import { useFilterStore } from '@/stores/filterStore';
import { usePlaces, useProvinces, useRoads, useServices } from '@/hooks/useMapData';
import { CATEGORY_COLORS, CATEGORY_ICONS, SERVICE_ICONS } from '@/types/geo';
import type { GeoJsonFeature } from '@/types/geo';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createClusterIcon(count: number) {
  const size = count < 10 ? 35 : count < 50 ? 45 : 55;
  const color = count < 10 ? '#3b82f6' : count < 50 ? '#f59e0b' : '#ef4444';
  return L.divIcon({
    html: `<div style="
      background: ${color};
      color: white;
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: ${size < 40 ? '12px' : '14px'};
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">${count}</div>`,
    className: 'cluster-icon',
    iconSize: L.point(size, size),
    iconAnchor: L.point(size / 2, size / 2),
  });
}

function createPlaceIcon(category: string, featured: boolean) {
  const emoji = CATEGORY_ICONS[category] || '📍';
  const bg = featured ? '#f59e0b' : (CATEGORY_COLORS[category] || '#6b7280');
  return L.divIcon({
    html: `<div style="
      background: ${bg};
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
    ">${emoji}</div>`,
    className: 'place-icon',
    iconSize: L.point(32, 32),
    iconAnchor: L.point(16, 16),
  });
}

function createServiceIcon(type: string) {
  const emoji = SERVICE_ICONS[type] || '📌';
  return L.divIcon({
    html: `<div style="
      background: #6366f1;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    ">${emoji}</div>`,
    className: 'service-icon',
    iconSize: L.point(28, 28),
    iconAnchor: L.point(14, 14),
  });
}

export default function MapView() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const placesLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const servicesLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const provincesLayerRef = useRef<L.GeoJSON | null>(null);
  const roadsLayerRef = useRef<L.GeoJSON | null>(null);
  const heatLayerRef = useRef<L.Layer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const { center, zoom, selectedPlace, userLocation, setBBox, setSelectedPlace, setCenter, setZoom } = useMapStore();
  const layers = useFilterStore((s) => s.layers);

  const { data: placesData } = usePlaces();
  const { data: provincesData } = useProvinces();
  const { data: roadsData } = useRoads();
  const { data: servicesData } = useServices();

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center as [number, number],
      zoom,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    placesLayerRef.current.addTo(map);
    servicesLayerRef.current.addTo(map);

    const updateBounds = () => {
      const bounds = map.getBounds();
      setBBox({
        minLng: bounds.getWest(),
        minLat: bounds.getSouth(),
        maxLng: bounds.getEast(),
        maxLat: bounds.getNorth(),
      });
      setCenter([map.getCenter().lat, map.getCenter().lng]);
      setZoom(map.getZoom());
    };

    map.on('moveend', updateBounds);
    map.on('zoomend', updateBounds);
    updateBounds();

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to selected place
  useEffect(() => {
    if (!mapRef.current || !selectedPlace) return;
    const coords = selectedPlace.geometry.coordinates;
    mapRef.current.flyTo([coords[1], coords[0]], 15, { duration: 1.5 });
  }, [selectedPlace]);

  // Show user location
  useEffect(() => {
    if (!mapRef.current) return;
    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(userLocation);
      } else {
        const icon = L.divIcon({
          html: `<div style="
            background: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            box-shadow: 0 0 10px rgba(59,130,246,0.5);
          "></div>`,
          className: 'user-location',
          iconSize: L.point(16, 16),
          iconAnchor: L.point(8, 8),
        });
        userMarkerRef.current = L.marker(userLocation, { icon }).addTo(mapRef.current);
      }
    }
  }, [userLocation]);

  // Supercluster for places
  const supercluster = useMemo(() => {
    if (!placesData?.features?.length) return null;

    const index = new Supercluster({
      radius: 60,
      maxZoom: 16,
      map: (props: any) => ({ category: props.category, featured: props.featured, rating: props.rating }),
      reduce: (accumulated: any, props: any) => {
        accumulated.category = accumulated.category || props.category;
      },
    });

    const points = placesData.features.map((f: GeoJsonFeature) => ({
      type: 'Feature' as const,
      properties: { ...f.properties, cluster: false },
      geometry: f.geometry,
    }));

    index.load(points as any);
    return index;
  }, [placesData]);

  // Render place clusters
  useEffect(() => {
    if (!mapRef.current || !layers.places) {
      placesLayerRef.current.clearLayers();
      return;
    }

    placesLayerRef.current.clearLayers();

    if (!supercluster) return;

    const map = mapRef.current;
    const bounds = map.getBounds();
    const currentZoom = Math.floor(map.getZoom());

    const clusters = supercluster.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      currentZoom
    );

    clusters.forEach((cluster: any) => {
      const [lng, lat] = cluster.geometry.coordinates;
      const { cluster: isCluster, point_count: count } = cluster.properties;

      if (isCluster) {
        const marker = L.marker([lat, lng], { icon: createClusterIcon(count) });
        marker.on('click', () => {
          const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id as number), 18);
          map.flyTo([lat, lng], expansionZoom, { duration: 0.5 });
        });
        placesLayerRef.current.addLayer(marker);
      } else {
        const props = cluster.properties;
        const icon = createPlaceIcon(props.category, props.featured);
        const marker = L.marker([lat, lng], { icon });

        const stars = '⭐'.repeat(Math.round(props.rating));
        const featuredBadge = props.featured
          ? '<span style="background:#f59e0b;color:white;padding:1px 6px;border-radius:8px;font-size:10px;margin-left:4px;">Featured</span>'
          : '';

        marker.bindPopup(
          `
          <div style="min-width: 200px; font-family: system-ui, sans-serif;">
            <h3 style="margin: 0 0 4px; font-size: 15px; font-weight: 600;">${props.name}${featuredBadge}</h3>
            <div style="display:flex;gap:4px;align-items:center;margin-bottom:4px;">
              <span style="background:${CATEGORY_COLORS[props.category] || '#6b7280'};color:white;padding:1px 8px;border-radius:10px;font-size:11px;">${props.category}</span>
              <span style="font-size:12px;">${stars} ${props.rating}</span>
            </div>
            ${props.description ? `<p style="margin: 4px 0; font-size: 12px; color: #666; line-height: 1.4;">${props.description.substring(0, 120)}${props.description.length > 120 ? '...' : ''}</p>` : ''}
            ${props.address ? `<p style="margin: 2px 0; font-size: 11px; color: #999;">📍 ${props.address}</p>` : ''}
            ${props.province ? `<p style="margin: 2px 0; font-size: 11px; color: #999;">🗺️ ${props.province}</p>` : ''}
          </div>
        `,
          { maxWidth: 300 }
        );

        marker.on('click', () => {
          setSelectedPlace(cluster as any);
        });

        placesLayerRef.current.addLayer(marker);
      }
    });
  }, [supercluster, zoom, center, layers.places, setSelectedPlace]);

  // Render provinces
  useEffect(() => {
    if (!mapRef.current) return;

    if (provincesLayerRef.current) {
      mapRef.current.removeLayer(provincesLayerRef.current);
      provincesLayerRef.current = null;
    }

    if (!layers.provinces || !provincesData?.features?.length) return;

    provincesLayerRef.current = L.geoJSON(provincesData as any, {
      style: {
        color: '#6366f1',
        weight: 2,
        opacity: 0.6,
        fillColor: '#818cf8',
        fillOpacity: 0.08,
      },
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(feature.properties.name, {
          permanent: false,
          direction: 'center',
          className: 'province-label',
        });
      },
    }).addTo(mapRef.current);
  }, [provincesData, layers.provinces]);

  // Render roads
  useEffect(() => {
    if (!mapRef.current) return;

    if (roadsLayerRef.current) {
      mapRef.current.removeLayer(roadsLayerRef.current);
      roadsLayerRef.current = null;
    }

    if (!layers.roads || !roadsData?.features?.length) return;

    const roadColors: Record<string, string> = {
      highway: '#ef4444',
      primary: '#f97316',
      secondary: '#eab308',
    };

    roadsLayerRef.current = L.geoJSON(roadsData as any, {
      style: (feature) => ({
        color: roadColors[feature?.properties?.type] || '#94a3b8',
        weight: feature?.properties?.type === 'highway' ? 3 : 2,
        opacity: 0.7,
      }),
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(`${feature.properties.name} (${feature.properties.type})`, {
          sticky: true,
        });
      },
    }).addTo(mapRef.current);
  }, [roadsData, layers.roads]);

  // Render services
  useEffect(() => {
    if (!mapRef.current || !layers.services) {
      servicesLayerRef.current.clearLayers();
      return;
    }

    servicesLayerRef.current.clearLayers();

    if (!servicesData?.features?.length) return;

    servicesData.features.forEach((feature: GeoJsonFeature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const props = feature.properties;
      const icon = createServiceIcon(props.type);
      const marker = L.marker([lat, lng], { icon });

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif;">
          <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: 600;">${SERVICE_ICONS[props.type] || '📌'} ${props.name}</h3>
          <span style="background:#6366f1;color:white;padding:1px 8px;border-radius:10px;font-size:11px;">${props.type}</span>
          ${props.address ? `<p style="margin: 4px 0 0; font-size: 11px; color: #999;">📍 ${props.address}</p>` : ''}
        </div>
      `);

      servicesLayerRef.current.addLayer(marker);
    });
  }, [servicesData, layers.services]);

  // Heatmap layer
  useEffect(() => {
    if (!mapRef.current) return;

    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (!layers.heatmap || !placesData?.features?.length) return;

    import('leaflet.heat').then(() => {
      if (!mapRef.current) return;
      const heatData = placesData.features.map((f: GeoJsonFeature) => {
        const [lng, lat] = f.geometry.coordinates;
        const intensity = f.properties.rating / 5;
        return [lat, lng, intensity];
      });

      heatLayerRef.current = (L as any).heatLayer(heatData, {
        radius: 30,
        blur: 20,
        maxZoom: 17,
        gradient: {
          0.2: '#3b82f6',
          0.4: '#22c55e',
          0.6: '#eab308',
          0.8: '#f97316',
          1.0: '#ef4444',
        },
      }).addTo(mapRef.current);
    });
  }, [placesData, layers.heatmap]);

  return <div ref={mapContainerRef} className="h-full w-full" style={{ zIndex: 0 }} />;
}
