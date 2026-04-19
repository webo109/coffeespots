import { motion } from 'framer-motion';
import { Star, Briefcase, MapPin, Clock, Crown } from 'lucide-react';
import { SortOption } from '@/types/cafe';

interface FilterBarProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  eliteOnly: boolean;
  onEliteToggle: (next: boolean) => void;
}

const filters: { key: SortOption; label: string; icon: React.ElementType }[] = [
  { key: 'highest', label: 'Highest Rated', icon: Star },
  { key: 'work', label: 'Best for Work', icon: Briefcase },
  { key: 'nearest', label: 'Nearest', icon: MapPin },
  { key: 'recent', label: 'Recently Visited', icon: Clock },
];

const FilterBar = ({
  activeSort,
  onSortChange,
  eliteOnly,
  onEliteToggle,
}: FilterBarProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = activeSort === filter.key;
        const Icon = filter.icon;
        return (
          <button
            key={filter.key}
            onClick={() => onSortChange(filter.key)}
            className={`pill-filter flex items-center gap-2 whitespace-nowrap ${
              isActive ? 'pill-filter-active' : 'pill-filter-inactive'
            }`}
          >
            {isActive && (
              <motion.div layoutId="filter-icon" transition={{ duration: 0.3 }}>
                <Icon size={14} />
              </motion.div>
            )}
            <span>{filter.label}</span>
          </button>
        );
      })}

      {/* Elite only toggle */}
      <button
        onClick={() => onEliteToggle(!eliteOnly)}
        aria-pressed={eliteOnly}
        className={`pill-filter flex items-center gap-2 whitespace-nowrap transition-all ${
          eliteOnly
            ? 'bg-gold/90 text-foreground shadow-[0_0_12px_hsl(var(--gold)/0.35)] border border-gold'
            : 'pill-filter-inactive'
        }`}
      >
        <Crown size={14} fill={eliteOnly ? 'currentColor' : 'none'} />
        <span>Elite only</span>
      </button>
    </div>
  );
};

export default FilterBar;
