import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lamp,
  Clock,
  Coffee,
  Crown,
  MapPin,
  CalendarDays,
  StickyNote,
  Pencil,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import { Cafe } from '@/types/cafe';
import RatingDots from './RatingDots';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface CafeDetailModalProps {
  cafe: Cafe | null;
  onClose: () => void;
  onToggleElite: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onAddVisit: (id: string, entry: { date: string; note?: string }) => void;
  onUpdateVisit: (
    id: string,
    index: number,
    entry: { date: string; note?: string }
  ) => void;
  onDeleteVisit: (id: string, index: number) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const todayISO = () => new Date().toISOString().slice(0, 10);

const CafeDetailModal = ({
  cafe,
  onClose,
  onToggleElite,
  onUpdateNotes,
  onAddVisit,
  onUpdateVisit,
  onDeleteVisit,
}: CafeDetailModalProps) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [isAddingVisit, setIsAddingVisit] = useState(false);
  const [visitDate, setVisitDate] = useState(todayISO());
  const [visitNote, setVisitNote] = useState('');
  const [editingVisitIndex, setEditingVisitIndex] = useState<number | null>(null);
  const [editVisitDate, setEditVisitDate] = useState('');
  const [editVisitNote, setEditVisitNote] = useState('');

  // Reset local state when cafe changes / modal closes
  useEffect(() => {
    setIsEditingNotes(false);
    setNotesDraft(cafe?.notes ?? '');
    setIsAddingVisit(false);
    setVisitDate(todayISO());
    setVisitNote('');
    setEditingVisitIndex(null);
  }, [cafe?.id]);

  const handleSaveNotes = () => {
    if (!cafe) return;
    onUpdateNotes(cafe.id, notesDraft.trim());
    setIsEditingNotes(false);
  };

  const handleAddVisit = () => {
    if (!cafe || !visitDate) return;
    onAddVisit(cafe.id, {
      date: new Date(visitDate).toISOString(),
      note: visitNote.trim() || undefined,
    });
    setVisitNote('');
    setVisitDate(todayISO());
    setIsAddingVisit(false);
  };

  const startEditVisit = (index: number, date: string, note?: string) => {
    setEditingVisitIndex(index);
    setEditVisitDate(date.slice(0, 10));
    setEditVisitNote(note ?? '');
  };

  const handleSaveEditVisit = () => {
    if (!cafe || editingVisitIndex === null || !editVisitDate) return;
    onUpdateVisit(cafe.id, editingVisitIndex, {
      date: new Date(editVisitDate).toISOString(),
      note: editVisitNote.trim() || undefined,
    });
    setEditingVisitIndex(null);
  };

  const handleDeleteVisit = (index: number) => {
    if (!cafe) return;
    onDeleteVisit(cafe.id, index);
    if (editingVisitIndex === index) setEditingVisitIndex(null);
  };

  return (
    <AnimatePresence>
      {cafe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm p-0 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero image */}
            <div className="relative h-72 sm:h-80 overflow-hidden rounded-t-3xl">
              <img
                src={cafe.image}
                alt={cafe.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-md text-foreground flex items-center justify-center hover:bg-card transition-all"
              >
                <X size={18} />
              </button>

              {/* Elite */}
              <button
                onClick={() => onToggleElite(cafe.id)}
                aria-label="Toggle elite"
                className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                  cafe.isElite
                    ? 'bg-gold/90 text-foreground shadow-[0_0_12px_hsl(var(--gold)/0.4)]'
                    : 'bg-card/60 text-muted-foreground hover:bg-card/80'
                }`}
              >
                <Crown size={18} fill={cafe.isElite ? 'currentColor' : 'none'} />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-5 left-5 right-5 text-primary-foreground">
                <h2 className="font-heading text-3xl font-semibold tracking-tight">
                  {cafe.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-1 text-sm opacity-90">
                  <MapPin size={14} />
                  <span>{cafe.location}</span>
                  {typeof cafe.distance === 'number' && (
                    <span className="opacity-70">· {cafe.distance} km</span>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Ratings */}
              <section>
                <h3 className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Architect's Rating
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center">
                        <Lamp size={14} className="text-gold" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Vibe</span>
                    </div>
                    <RatingDots value={cafe.vibe} variant="vibe" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock size={14} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Workflow</span>
                    </div>
                    <RatingDots value={cafe.productivity} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Coffee size={14} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Brew</span>
                    </div>
                    <RatingDots value={cafe.brew} />
                  </div>
                </div>
              </section>

              {/* Notes */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StickyNote size={14} className="text-muted-foreground" />
                    <h3 className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
                      Notes
                    </h3>
                  </div>
                  {!isEditingNotes ? (
                    <button
                      onClick={() => {
                        setNotesDraft(cafe.notes ?? '');
                        setIsEditingNotes(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditingNotes(false)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNotes}
                        className="inline-flex items-center gap-1 text-xs font-medium text-wood hover:opacity-80 transition-opacity"
                      >
                        <Check size={12} />
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {isEditingNotes ? (
                  <Textarea
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Add your thoughts about this spot…"
                    rows={4}
                    className="rounded-xl resize-none"
                    autoFocus
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {cafe.notes ||
                      'No notes yet. A quiet corner table near the window is usually the best seat in the house.'}
                  </p>
                )}
              </section>

              {/* Visit history */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-muted-foreground" />
                    <h3 className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
                      Visit History
                    </h3>
                  </div>
                  {!isAddingVisit && (
                    <button
                      onClick={() => setIsAddingVisit(true)}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus size={12} />
                      Log visit
                    </button>
                  )}
                </div>

                {isAddingVisit && (
                  <div className="mb-4 p-3 rounded-xl bg-muted/40 space-y-2">
                    <Input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="rounded-lg"
                    />
                    <Input
                      type="text"
                      value={visitNote}
                      onChange={(e) => setVisitNote(e.target.value)}
                      placeholder="Optional note…"
                      className="rounded-lg"
                    />
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          setIsAddingVisit(false);
                          setVisitNote('');
                          setVisitDate(todayISO());
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 h-8"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddVisit}
                        disabled={!visitDate}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-foreground bg-wood rounded-full px-3 h-8 hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        <Check size={12} />
                        Add
                      </button>
                    </div>
                  </div>
                )}

                <ol className="relative border-l border-border/60 ml-1.5 space-y-3">
                  {(cafe.visitHistory && cafe.visitHistory.length > 0
                    ? cafe.visitHistory
                    : [{ date: cafe.visitedAt, note: 'Last visit' }]
                  ).map((entry, i) => (
                    <li key={i} className="pl-4 relative">
                      <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-wood" />
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(entry.date)}
                      </p>
                      {entry.note && (
                        <p className="text-xs text-muted-foreground mt-0.5">{entry.note}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </section>

              {/* Actions */}
              <div className="pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${cafe.name} ${cafe.location}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-wood text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
                >
                  <MapPin size={16} />
                  Open in Maps
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CafeDetailModal;
