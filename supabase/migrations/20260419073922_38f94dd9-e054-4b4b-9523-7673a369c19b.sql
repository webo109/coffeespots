CREATE TABLE public.cafes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  vibe SMALLINT NOT NULL DEFAULT 3,
  productivity SMALLINT NOT NULL DEFAULT 3,
  brew SMALLINT NOT NULL DEFAULT 3,
  is_elite BOOLEAN NOT NULL DEFAULT false,
  visited_at DATE NOT NULL DEFAULT CURRENT_DATE,
  distance NUMERIC,
  notes TEXT,
  visit_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cafes"
  ON public.cafes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create cafes"
  ON public.cafes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update cafes"
  ON public.cafes FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete cafes"
  ON public.cafes FOR DELETE
  USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_cafes_updated_at
  BEFORE UPDATE ON public.cafes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.cafes;
ALTER TABLE public.cafes REPLICA IDENTITY FULL;