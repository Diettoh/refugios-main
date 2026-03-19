-- Asignación de cabañas a reservas y tarifa por noche

-- Tarifa por noche en cabañas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'cabins'
      AND column_name = 'nightly_rate'
  ) THEN
    ALTER TABLE cabins
      ADD COLUMN nightly_rate NUMERIC(12,2) NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Relación reserva -> cabaña
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'reservations'
      AND column_name = 'cabin_id'
  ) THEN
    ALTER TABLE reservations
      ADD COLUMN cabin_id INT REFERENCES cabins(id) ON DELETE SET NULL;
  END IF;
END $$;

