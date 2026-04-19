import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Cafe, VisitEntry } from '@/types/cafe';

type DbCafe = {
  id: string;
  name: string;
  location: string;
  image: string;
  vibe: number;
  productivity: number;
  brew: number;
  is_elite: boolean;
  visited_at: string;
  distance: number | null;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
  visit_history: unknown;
};

const fromDb = (row: DbCafe): Cafe => ({
  id: row.id,
  name: row.name,
  location: row.location,
  image: row.image,
  vibe: row.vibe,
  productivity: row.productivity,
  brew: row.brew,
  isElite: row.is_elite,
  visitedAt: row.visited_at,
  distance: row.distance ?? undefined,
  latitude: row.latitude ?? undefined,
  longitude: row.longitude ?? undefined,
  notes: row.notes ?? undefined,
  visitHistory: Array.isArray(row.visit_history)
    ? (row.visit_history as VisitEntry[])
    : [],
});

export function useCafes() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data, error } = await supabase
        .from('cafes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) {
        console.error('Failed to load cafes', error);
      } else {
        setCafes((data as DbCafe[]).map(fromDb));
      }
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel('cafes-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cafes' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const row = fromDb(payload.new as DbCafe);
            setCafes((prev) =>
              prev.some((c) => c.id === row.id) ? prev : [row, ...prev]
            );
          } else if (payload.eventType === 'UPDATE') {
            const row = fromDb(payload.new as DbCafe);
            setCafes((prev) => prev.map((c) => (c.id === row.id ? row : c)));
          } else if (payload.eventType === 'DELETE') {
            const id = (payload.old as { id: string }).id;
            setCafes((prev) => prev.filter((c) => c.id !== id));
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const addCafe = async (
    cafe: Omit<Cafe, 'id' | 'isElite' | 'distance'>
  ) => {
    const { error } = await supabase.from('cafes').insert({
      name: cafe.name,
      location: cafe.location,
      image: cafe.image,
      vibe: cafe.vibe,
      productivity: cafe.productivity,
      brew: cafe.brew,
      visited_at: cafe.visitedAt,
      notes: cafe.notes ?? null,
      visit_history: (cafe.visitHistory ?? []) as unknown as never,
      latitude: cafe.latitude ?? null,
      longitude: cafe.longitude ?? null,
    });
    if (error) console.error('addCafe failed', error);
  };

  const toggleElite = async (id: string) => {
    const current = cafes.find((c) => c.id === id);
    if (!current) return;
    setCafes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isElite: !c.isElite } : c))
    );
    const { error } = await supabase
      .from('cafes')
      .update({ is_elite: !current.isElite })
      .eq('id', id);
    if (error) console.error('toggleElite failed', error);
  };

  const updateNotes = async (id: string, notes: string) => {
    setCafes((prev) => prev.map((c) => (c.id === id ? { ...c, notes } : c)));
    const { error } = await supabase
      .from('cafes')
      .update({ notes })
      .eq('id', id);
    if (error) console.error('updateNotes failed', error);
  };

  const persistVisits = async (
    id: string,
    history: VisitEntry[],
    visitedAt: string
  ) => {
    const { error } = await supabase
      .from('cafes')
      .update({
        visit_history: history as unknown as never,
        visited_at: visitedAt,
      })
      .eq('id', id);
    if (error) console.error('persistVisits failed', error);
  };

  const addVisit = async (id: string, entry: VisitEntry) => {
    const cafe = cafes.find((c) => c.id === id);
    if (!cafe) return;
    const history = [entry, ...(cafe.visitHistory ?? [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const visitedAt = (history[0]?.date ?? cafe.visitedAt).slice(0, 10);
    setCafes((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, visitHistory: history, visitedAt } : c
      )
    );
    await persistVisits(id, history, visitedAt);
  };

  const updateVisit = async (
    id: string,
    index: number,
    entry: VisitEntry
  ) => {
    const cafe = cafes.find((c) => c.id === id);
    if (!cafe) return;
    const next = (cafe.visitHistory ?? [])
      .map((v, i) => (i === index ? entry : v))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const visitedAt = (next[0]?.date ?? cafe.visitedAt).slice(0, 10);
    setCafes((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, visitHistory: next, visitedAt } : c
      )
    );
    await persistVisits(id, next, visitedAt);
  };

  const deleteVisit = async (id: string, index: number) => {
    const cafe = cafes.find((c) => c.id === id);
    if (!cafe) return;
    const next = (cafe.visitHistory ?? []).filter((_, i) => i !== index);
    const visitedAt = (next[0]?.date ?? cafe.visitedAt).slice(0, 10);
    setCafes((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, visitHistory: next, visitedAt } : c
      )
    );
    await persistVisits(id, next, visitedAt);
  };

  return {
    cafes,
    loading,
    addCafe,
    toggleElite,
    updateNotes,
    addVisit,
    updateVisit,
    deleteVisit,
  };
}
