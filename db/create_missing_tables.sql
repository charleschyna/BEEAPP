-- Create the inspection_logs table
CREATE TABLE public.inspection_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hive_id UUID NOT NULL REFERENCES public.hives(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    queen_spotted BOOLEAN NOT NULL,
    brood_patterns TEXT NOT NULL CHECK (brood_patterns IN ('excellent', 'good', 'fair', 'poor')),
    honey_stores TEXT NOT NULL CHECK (honey_stores IN ('abundant', 'good', 'fair', 'low')),
    pollen_stores TEXT NOT NULL CHECK (pollen_stores IN ('abundant', 'adequate', 'good', 'fair', 'low')),
    diseases_signs BOOLEAN NOT NULL,
    diseases_notes TEXT,
    notes TEXT,
    actions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on inspection_logs
ALTER TABLE public.inspection_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for inspection_logs
CREATE POLICY "Users can CRUD their own inspection logs" 
ON public.inspection_logs
USING (auth.uid() = (SELECT user_id FROM public.hives WHERE id = hive_id))
WITH CHECK (auth.uid() = (SELECT user_id FROM public.hives WHERE id = hive_id));

-- Create the historical_data table
CREATE TABLE public.historical_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hive_id UUID NOT NULL REFERENCES public.hives(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    temperature NUMERIC NOT NULL,
    humidity NUMERIC NOT NULL,
    weight NUMERIC NOT NULL,
    sound NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on historical_data
ALTER TABLE public.historical_data ENABLE ROW LEVEL SECURITY;

-- Create policy for historical_data
CREATE POLICY "Users can CRUD their own historical data" 
ON public.historical_data
USING (auth.uid() = (SELECT user_id FROM public.hives WHERE id = hive_id))
WITH CHECK (auth.uid() = (SELECT user_id FROM public.hives WHERE id = hive_id));

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for inspection_logs
CREATE TRIGGER update_inspection_logs_updated_at
BEFORE UPDATE ON public.inspection_logs
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Add necessary index for performance
CREATE INDEX idx_inspection_logs_hive_id ON public.inspection_logs(hive_id);
CREATE INDEX idx_historical_data_hive_id ON public.historical_data(hive_id);
CREATE INDEX idx_historical_data_date ON public.historical_data(date);
