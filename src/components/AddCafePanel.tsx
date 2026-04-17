import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ImagePlus, Lamp, Clock, Coffee, Trash2 } from 'lucide-react';
import { Cafe } from '@/types/cafe';

interface AddCafePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (cafe: Omit<Cafe, 'id' | 'isElite' | 'distance'>) => void;
}

const SliderInput = ({
  label,
  icon: Icon,
  value,
  onChange,
  isVibe,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (v: number) => void;
  isVibe?: boolean;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon size={16} className={isVibe ? 'text-gold' : 'text-primary'} />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <span className={`text-sm font-heading font-bold ${isVibe ? 'text-gold' : 'text-primary'}`}>
        {value}
      </span>
    </div>
    <input
      type="range"
      min={1}
      max={5}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md
        [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
    />
  </div>
);

const AddCafePanel = ({ isOpen, onClose, onAdd }: AddCafePanelProps) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [vibe, setVibe] = useState(3);
  const [productivity, setProductivity] = useState(3);
  const [brew, setBrew] = useState(3);

  const handleSubmit = () => {
    if (!name || !location) return;
    onAdd({
      name,
      location,
      image: '',
      vibe,
      productivity,
      brew,
      visitedAt: new Date().toISOString().split('T')[0],
    });
    setName('');
    setLocation('');
    setVibe(3);
    setProductivity(3);
    setBrew(3);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-panel z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Log a New Spot
              </h2>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Image upload placeholder */}
              <div className="polaroid mx-auto w-56">
                <div className="aspect-[4/3] bg-secondary rounded-sm flex flex-col items-center justify-center gap-2">
                  <ImagePlus size={28} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add a photo</span>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Cafe Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="The Golden Hour..."
                  className="w-full px-4 py-3 bg-secondary/60 border border-border/40 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search for a location..."
                    className="w-full pl-10 pr-4 py-3 bg-secondary/60 border border-border/40 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              {/* Rating sliders */}
              <div className="space-y-5 pt-2">
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  The Architect's Rating
                </h3>
                <SliderInput label="Vibe / Lighting" icon={Lamp} value={vibe} onChange={setVibe} isVibe />
                <SliderInput label="Productivity" icon={Clock} value={productivity} onChange={setProductivity} />
                <SliderInput label="Brew Quality" icon={Coffee} value={brew} onChange={setBrew} />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/40">
              <button
                onClick={handleSubmit}
                disabled={!name || !location}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save to Collection
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddCafePanel;
