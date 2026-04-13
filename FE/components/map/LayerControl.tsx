'use client';

import { useFilterStore } from '@/stores/filterStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMapStore } from '@/stores/mapStore';
import { useEffect } from 'react';

const LAYER_CONFIG = [
  { key: 'places' as const, label: 'Tourist Places', icon: '📍' },
  { key: 'provinces' as const, label: 'Province Boundaries', icon: '🗺️' },
  { key: 'roads' as const, label: 'Major Roads', icon: '🛣️' },
  { key: 'services' as const, label: 'Services', icon: '🏨' },
  { key: 'heatmap' as const, label: 'Heatmap', icon: '🔥' },
];

export default function LayerControl() {
  const { layers, toggleLayer } = useFilterStore();
  const { latitude, longitude, error, loading, locate } = useGeolocation();
  const { setUserLocation, flyTo } = useMapStore();

  useEffect(() => {
    if (latitude && longitude) {
      setUserLocation([latitude, longitude]);
    }
  }, [latitude, longitude, setUserLocation]);

  const handleLocate = () => {
    locate();
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Map Layers</h3>
        <div className="space-y-1.5">
          {LAYER_CONFIG.map(({ key, label, icon }) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer py-1">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={() => toggleLayer(key)}
                  className="sr-only"
                />
                <div
                  className={`w-8 h-[18px] rounded-full transition-colors ${layers[key] ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div
                    className={`w-3.5 h-3.5 bg-white rounded-full shadow transition-transform mt-[2px] ${layers[key] ? 'translate-x-[18px]' : 'translate-x-[2px]'}`}
                  />
                </div>
              </div>
              <span className="text-sm">{icon}</span>
              <span className="text-xs text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Geolocation */}
      <div className="pt-2 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">My Location</h3>
        <button
          onClick={() => {
            handleLocate();
            if (latitude && longitude) {
              flyTo([latitude, longitude], 13);
            }
          }}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Locating...
            </>
          ) : (
            <>📍 Find My Location</>
          )}
        </button>
        {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
        {latitude && longitude && (
          <p className="text-[10px] text-gray-500 mt-1">
            📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
        )}
      </div>
    </div>
  );
}
