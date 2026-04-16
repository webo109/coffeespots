import { useState, useMemo } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { Plus, Coffee } from 'lucide-react';
import { Cafe, SortOption } from '@/types/cafe';
import { initialCafes } from '@/data/cafes';
import CafeCard from '@/components/CafeCard';
import FilterBar from '@/components/FilterBar';
import AddCafePanel from '@/components/AddCafePanel';
import CafeDetailModal from '@/components/CafeDetailModal';

const Index = () => {
  const [cafes, setCafes] = useState<Cafe[]>(initialCafes);
  const [activeSort, setActiveSort] = useState<SortOption>('highest');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);

  const selectedCafe = cafes.find((c) => c.id === selectedCafeId) ?? null;

  const sortedCafes = useMemo(() => {
    const sorted = [...cafes];
    switch (activeSort) {
      case 'highest':
        return sorted.sort(
          (a, b) => (b.vibe + b.productivity + b.brew) - (a.vibe + a.productivity + a.brew)
        );
      case 'work':
        return sorted.sort((a, b) => b.productivity - a.productivity);
      case 'nearest':
        return sorted.sort((a, b) => (a.distance ?? 99) - (b.distance ?? 99));
      case 'recent':
        return sorted.sort(
          (a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
        );
      default:
        return sorted;
    }
  }, [cafes, activeSort]);

  const toggleElite = (id: string) => {
    setCafes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isElite: !c.isElite } : c))
    );
  };

  const addCafe = (newCafe: Omit<Cafe, 'id' | 'isElite' | 'distance'>) => {
    setCafes((prev) => [
      {
        ...newCafe,
        id: Date.now().toString(),
        isElite: false,
        distance: Math.round(Math.random() * 10 * 10) / 10,
        image: newCafe.image || prev[0]?.image || '',
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 glass-panel border-b border-border/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Coffee size={18} className="text-primary" />
              </div>
              <h1 className="font-heading text-lg font-semibold text-foreground tracking-tight">
                Coffee Spots
              </h1>
            </div>
            <button
              onClick={() => setIsPanelOpen(true)}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Filter pills */}
          <div className="pb-3">
            <FilterBar activeSort={activeSort} onSortChange={setActiveSort} />
          </div>
        </div>
      </header>

      {/* Gallery */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <LayoutGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {sortedCafes.map((cafe) => (
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

        {cafes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-heading text-lg">
              No spots yet. Start curating your collection.
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
      />
    </div>
  );
};

export default Index;
