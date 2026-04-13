'use client';

import { useFilterStore } from '@/stores/filterStore';
import { useCategories, useServiceTypes } from '@/hooks/useMapData';
import { CATEGORY_COLORS, CATEGORY_ICONS, SERVICE_ICONS } from '@/types/geo';

export default function FilterPanel() {
  const {
    category,
    serviceType,
    minRating,
    showFeaturedOnly,
    setCategory,
    setServiceType,
    setMinRating,
    setShowFeaturedOnly,
    resetFilters,
  } = useFilterStore();
  const { data: categories } = useCategories();
  const { data: serviceTypes } = useServiceTypes();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
        <button onClick={resetFilters} className="text-xs text-blue-600 hover:text-blue-700">
          Reset
        </button>
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Category</label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategory('')}
            className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
              !category
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            All
          </button>
          {categories?.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? '' : cat)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                category === cat
                  ? 'text-white border-transparent'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
              style={category === cat ? { background: CATEGORY_COLORS[cat] || '#6b7280' } : {}}
            >
              {CATEGORY_ICONS[cat] || '📍'} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Service Types */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Service Type</label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setServiceType('')}
            className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
              !serviceType
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            All
          </button>
          {serviceTypes?.map((type) => (
            <button
              key={type}
              onClick={() => setServiceType(serviceType === type ? '' : type)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                serviceType === type
                  ? 'bg-indigo-500 text-white border-indigo-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {SERVICE_ICONS[type] || '📌'} {type}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">
          Min Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
        </label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={minRating}
          onChange={(e) => setMinRating(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
          <span>Any</span>
          <span>5.0</span>
        </div>
      </div>

      {/* Featured */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showFeaturedOnly}
          onChange={(e) => setShowFeaturedOnly(e.target.checked)}
          className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
        />
        <span className="text-xs text-gray-700">Featured places only ⭐</span>
      </label>
    </div>
  );
}
