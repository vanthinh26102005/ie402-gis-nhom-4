import { create } from 'zustand';

interface FilterState {
  search: string;
  category: string;
  serviceType: string;
  minRating: number;
  showFeaturedOnly: boolean;

  layers: {
    places: boolean;
    provinces: boolean;
    roads: boolean;
    services: boolean;
    heatmap: boolean;
  };

  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setServiceType: (type: string) => void;
  setMinRating: (rating: number) => void;
  setShowFeaturedOnly: (show: boolean) => void;
  toggleLayer: (layer: keyof FilterState['layers']) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: '',
  category: '',
  serviceType: '',
  minRating: 0,
  showFeaturedOnly: false,
  layers: {
    places: true,
    provinces: true,
    roads: true,
    services: true,
    heatmap: false,
  },

  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setServiceType: (type) => set({ serviceType: type }),
  setMinRating: (rating) => set({ minRating: rating }),
  setShowFeaturedOnly: (show) => set({ showFeaturedOnly: show }),
  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),
  resetFilters: () =>
    set({
      search: '',
      category: '',
      serviceType: '',
      minRating: 0,
      showFeaturedOnly: false,
    }),
}));
