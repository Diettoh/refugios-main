-- Tamaño, capacidad y amenities por cabaña.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'cabins' AND column_name = 'size_category'
  ) THEN
    ALTER TABLE cabins ADD COLUMN size_category TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'cabins' AND column_name = 'max_guests'
  ) THEN
    ALTER TABLE cabins ADD COLUMN max_guests INT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'cabins' AND column_name = 'amenities'
  ) THEN
    ALTER TABLE cabins ADD COLUMN amenities TEXT[];
  END IF;
END $$;

-- Defaults amigables: 2 pequeñas (S1/S2) y 1 grande (G).
UPDATE cabins
SET size_category = COALESCE(size_category,
                             CASE short_code
                               WHEN 'S1' THEN 'small'
                               WHEN 'S2' THEN 'small'
                               WHEN 'G' THEN 'large'
                               ELSE 'small'
                             END),
    max_guests = COALESCE(max_guests,
                          CASE short_code
                            WHEN 'S1' THEN 2
                            WHEN 'S2' THEN 2
                            WHEN 'G' THEN 6
                            ELSE 2
                          END);

-- Amenities base (se pueden editar luego desde la app si se extiende el formulario).
UPDATE cabins
SET amenities = COALESCE(
  amenities,
  CASE short_code
    WHEN 'S1' THEN ARRAY['wifi','breakfast']
    WHEN 'S2' THEN ARRAY['wifi','parking']
    WHEN 'G' THEN ARRAY['pool','breakfast','wifi','parking']
    ELSE ARRAY['wifi']
  END
);

