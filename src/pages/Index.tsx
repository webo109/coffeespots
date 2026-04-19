import { useState, useMemo } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { Plus, Coffee, Search, X } from 'lucide-react';
import { Cafe, SortOption } from '@/types/cafe';
import CafeCard from '@/components/CafeCard';
import FilterBar from '@/components/FilterBar';
import AddCafePanel from '@/components/AddCafePanel';
import CafeDetailModal from '@/components/CafeDetailModal';
import { useCafes } from '@/hooks/useCafes';
import { useUserLocation } from '@/hooks/useUserLocation';
import { haversineKm } from '@/lib/geo';

const Index = () => {
  const {
    cafes,
    loading,
    addCafe,
    toggleElite,
    updateNotes,
    addVisit,
    updateVisit,
    deleteVisit,
  } = useCafes();
  const [activeSort, setActiveSort] = useState<SortOption>('highest');
  const [eliteOnly, setEliteOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);
  const userLocation = useUserLocation();

  // Augment cafes with computed distance from the user's current position.
  const cafesWithDistance: Cafe[] = useMemo(() => {
    if (!userLocation) return cafes;
    return cafes.map((c) => {
      if (c.latitude == null || c.longitude == null) return c;
      const km = haversineKm(
        userLocation.latitude,
        userLocation.longitude,
        c.latitude,
        c.longitude
      );
      return { ...c, distance: Math.round(km * 10) / 10 };
    });
  }, [cafes, userLocation]);

  const selectedCafe =
    cafesWithDistance.find((c) => c.id === selectedCafeId) ?? null;

  const visibleCafes = useMemo(() => {
    let list = [...cafesWithDistance];

    if (eliteOnly) list = list.filter((c) => c.isElite);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }

    switch (activeSort) {
      case 'highest':
        return list.sort(
          (a, b) =>
            b.vibe + b.productivity + b.brew - (a.vibe + a.productivity + a.brew)
        );
      case 'work':
        return list.sort((a, b) => b.productivity - a.productivity);
      case 'nearest':
        return list.sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));
      case 'recent':
        return list.sort(
          (a, b) =>
            new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
        );
      default:
        return list;
    }
  }, [cafesWithDistance, activeSort, eliteOnly, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 glass-panel border-b border-border/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 h-16">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Coffee size={18} className="text-primary" />
              </div>
              <h1 className="font-heading text-lg font-semibold text-foreground tracking-tight hidden sm:block">
                Coffee Spots
              </h1>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or location…"
                className="w-full pl-9 pr-9 py-2.5 bg-secondary/60 border border-border/40 rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 flex items-center justify-center transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsPanelOpen(true)}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:opacity-90 transition-all shrink-0"
              aria-label="Log a new spot"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Filter pills */}
          <div className="pb-3">
            <FilterBar
              activeSort={activeSort}
              onSortChange={setActiveSort}
              eliteOnly={eliteOnly}
              onEliteToggle={setEliteOnly}
            />
          </div>
        </div>
      </header>

      {/* Gallery */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <LayoutGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {visibleCafes.map((cafe) => (
                <CafeCard
                  key={cafe.id}
                  cafe={cafe}
                  onToggleElite={toggleElite}
                  onOpen={(c) => setSelectedCafeId(c.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>

        {!loading && visibleCafes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-heading text-lg">
              {cafes.length === 0
                ? 'No spots yet. Tap + to log your first one.'
                : 'No spots match your filters.'}
            </p>
          </div>
        )}
      </main>

      {/* Add Panel */}
      <AddCafePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onAdd={addCafe}
      />

      {/* Detail Modal */}
      <CafeDetailModal
        cafe={selectedCafe}
        onClose={() => setSelectedCafeId(null)}
        onToggleElite={toggleElite}
        onUpdateNotes={updateNotes}
        onAddVisit={addVisit}
        onUpdateVisit={updateVisit}
        onDeleteVisit={deleteVisit}
      />
    </div>
  );
};

export default Index;
