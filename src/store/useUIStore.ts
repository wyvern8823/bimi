import { create } from 'zustand';

type UIState = {
  mapListView: 'map' | 'cards';
  setMapListView: (v: 'map' | 'cards') => void;
  premiumEnabled: boolean;
  setPremiumEnabled: (b: boolean) => void;
  weights: { count: number; like: number; official: number; rich: number; variance: number };
  setWeights: (w: UIState['weights']) => void;
};

export const useUIStore = create<UIState>((set) => ({
  mapListView: 'map',
  setMapListView: (v) => set({ mapListView: v }),
  premiumEnabled: false,
  setPremiumEnabled: (b) => set({ premiumEnabled: b }),
  weights: { count: 0.3, like: 0.3, official: 0.2, rich: 0.1, variance: 0.1 },
  setWeights: (weights) => set({ weights }),
}));
