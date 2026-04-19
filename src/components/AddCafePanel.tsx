import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ImagePlus, Lamp, Clock, Coffee, Trash2, Loader2 } from 'lucide-react';
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
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [vibe, setVibe] = useState(3);
  const [productivity, setProductivity] = useState(3);
  const [brew, setBrew] = useState(3);
  const [image, setImage] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`,
            { headers: { Accept: 'application/json' } }
          );
          const data = await res.json();
          const a = data.address ?? {};
          const parts = [
            a.road,
            a.neighbourhood || a.suburb,
            a.city || a.town || a.village,
          ].filter(Boolean);
          const label =
            parts.join(', ') ||
            data.display_name ||
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocation(label);
        } catch {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        alert(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Enable it in your browser settings to use this feature.'
            : 'Could not retrieve your location. Please try again.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setImage(reader.result);
    };
    reader.readAsDataURL(file);
    // reset so selecting the same file again still triggers change
    e.target.value = '';
  };

  const resetForm = () => {
    setName('');
    setLocation('');
    setCoords(null);
    setVibe(3);
    setProductivity(3);
    setBrew(3);
    setImage('');
  };

  const handleSubmit = () => {
    if (!name || !location) return;
    onAdd({
      name,
      location,
      image,
      vibe,
      productivity,
      brew,
      visitedAt: new Date().toISOString().split('T')[0],
      latitude: coords?.lat,
      longitude: coords?.lng,
    });
    resetForm();
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
              {/* Image upload */}
              <div className="polaroid mx-auto w-56">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full aspect-[4/3] bg-secondary rounded-sm flex flex-col items-center justify-center gap-2 overflow-hidden group"
                >
                  {image ? (
                    <>
                      <img
                        src={image}
                        alt="Selected cafe"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          Change photo
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImagePlus size={28} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Add a photo</span>
                    </>
                  )}
                </button>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="mt-2 mx-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
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
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    title="Use my current location"
                    aria-label="Use my current location"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-gold hover:bg-gold/10 ring-1 ring-gold/40 hover:ring-gold/70 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLocating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <MapPin size={14} />
                    )}
                  </button>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={isLocating ? 'Locating you…' : 'Search or tap pin for current location'}
                    className="w-full pl-12 pr-4 py-3 bg-secondary/60 border border-border/40 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
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
