'use client';

import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/types/geo';
import type { GeoJsonFeature } from '@/types/geo';
import { useMapStore } from '@/stores/mapStore';

interface PlaceCardProps {
  feature: GeoJsonFeature;
  isSelected: boolean;
}

export default function PlaceCard({ feature, isSelected }: PlaceCardProps) {
  const { setSelectedPlace, flyTo } = useMapStore();
  const p = feature.properties;
  const [lng, lat] = feature.geometry.coordinates;

  const handleClick = () => {
    setSelectedPlace(feature);
    flyTo([lat, lng], 15);
  };

  return (
    <div
      onClick={handleClick}
      className={`p-3 border-b cursor-pointer transition-all hover:bg-blue-50 ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg mt-0.5">{CATEGORY_ICONS[p.category] || '📍'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-sm text-gray-900 truncate">{p.name}</h3>
            {p.featured && (
              <span className="shrink-0 bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
              style={{ background: CATEGORY_COLORS[p.category] || '#6b7280' }}
            >
              {p.category}
            </span>
            <span className="text-xs text-gray-500">
              {'⭐'.repeat(Math.round(p.rating))} {p.rating}
            </span>
          </div>
          {p.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>}
          {p.province && <p className="text-[11px] text-gray-400 mt-0.5">🗺️ {p.province}</p>}
        </div>
      </div>
    </div>
  );
}
