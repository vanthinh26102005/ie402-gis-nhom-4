'use client';

import { useState } from 'react';
import { useMapStore } from '@/stores/mapStore';
import { usePlaces, useStats } from '@/hooks/useMapData';
import PlaceCard from './PlaceCard';
import SearchBox from '../filters/SearchBox';
import FilterPanel from '../filters/FilterPanel';
import LayerControl from '../map/LayerControl';
import type { GeoJsonFeature } from '@/types/geo';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<'places' | 'layers'>('places');
  const { selectedPlace } = useMapStore();
  const { data: placesData, isLoading, error } = usePlaces();
  const { data: stats } = useStats();

  const places = placesData?.features || [];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">🗺️ Tourism Map</h1>
        {stats && (
          <p className="text-xs text-gray-500 mt-1">
            {stats.places} places · {stats.provinces} provinces · {stats.services} services
          </p>
        )}
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-100">
        <SearchBox />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('places')}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'places'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Places ({places.length})
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'layers'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Layers & Filters
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'places' ? (
          <>
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                        <div className="h-2 bg-gray-200 rounded w-1/2" />
                        <div className="h-2 bg-gray-200 rounded w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-red-500 text-sm">Failed to load places</p>
                <p className="text-xs text-gray-400 mt-1">Check that the API server is running</p>
              </div>
            ) : places.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 text-sm">No places found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or zoom level</p>
              </div>
            ) : (
              places.map((feature: GeoJsonFeature) => (
                <PlaceCard key={feature.id} feature={feature} isSelected={selectedPlace?.id === feature.id} />
              ))
            )}
          </>
        ) : (
          <div className="p-3 space-y-4">
            <FilterPanel />
            <LayerControl />
          </div>
        )}
      </div>
    </div>
  );
}
