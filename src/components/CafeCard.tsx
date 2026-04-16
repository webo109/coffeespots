import { motion } from 'framer-motion';
import { Lamp, Clock, Coffee, Crown, MapPin } from 'lucide-react';
import { Cafe } from '@/types/cafe';
import RatingDots from './RatingDots';

interface CafeCardProps {
  cafe: Cafe;
  onToggleElite: (id: string) => void;
  onOpen?: (cafe: Cafe) => void;
}

const CafeCard = ({ cafe, onToggleElite, onOpen }: CafeCardProps) => {
  const avgRating = ((cafe.vibe + cafe.productivity + cafe.brew) / 3).toFixed(1);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => onOpen?.(cafe)}
      className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
    >
      {/* Image Header */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={cafe.image}
          alt={cafe.name}
          loading="lazy"
          width={800}
          height={600}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Vibe glow overlay */}
        <div className="absolute inset-0 vibe-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Elite toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleElite(cafe.id);
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
            cafe.isElite
              ? 'bg-gold/90 text-foreground shadow-[0_0_12px_hsl(var(--gold)/0.4)]'
              : 'bg-card/50 text-muted-foreground hover:bg-card/70'
          }`}
        >
          <Crown size={18} fill={cafe.isElite ? 'currentColor' : 'none'} />
        </button>

        {/* Average rating badge */}
        <div className="absolute bottom-3 left-3 bg-card/80 backdrop-blur-md rounded-full px-3 py-1 text-sm font-heading font-semibold text-foreground">
          {avgRating}
        </div>

        {/* Map view button */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${cafe.name} ${cafe.location}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open ${cafe.name} on Google Maps`}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-card/80 backdrop-blur-md text-foreground flex items-center justify-center transition-all duration-300 hover:bg-wood hover:text-primary-foreground shadow-md"
        >
          <MapPin size={16} />
        </a>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">
            {cafe.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">{cafe.location}</p>
        </div>

        {/* Ratings */}
        <div className="space-y-2.5">
          {/* Vibe - emphasized */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center">
                <Lamp size={14} className="text-gold" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Vibe</span>
            </div>
            <RatingDots value={cafe.vibe} variant="vibe" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock size={14} className="text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Workflow</span>
            </div>
            <RatingDots value={cafe.productivity} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Coffee size={14} className="text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Brew</span>
            </div>
            <RatingDots value={cafe.brew} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CafeCard;
