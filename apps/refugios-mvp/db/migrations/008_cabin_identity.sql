-- Identidad visual de cabañas: código corto, color y icono.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'cabins' AND column_name = 'short_code'
  ) THEN
    ALTER TABLE cabins ADD COLUMN short_code TEXT UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'cabins' AND column_name = 'color_hex'
  ) THEN
    ALTER TABLE cabins ADD COLUMN color_hex TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'cabins' AND column_name = 'icon'
  ) THEN
    ALTER TABLE cabins ADD COLUMN icon TEXT;
  END IF;
END $$;

-- Backfill básico para las 6 cabañas iniciales (orden 1..6)
UPDATE cabins
SET short_code = COALESCE(short_code,
                          CASE sort_order
                            WHEN 1 THEN 'A'
                            WHEN 2 THEN 'B'
                            WHEN 3 THEN 'P'
                            WHEN 4 THEN 'T'
                            WHEN 5 THEN 'R1'
                            WHEN 6 THEN 'R2'
                            ELSE 'C' || sort_order
                          END),
    color_hex = COALESCE(color_hex,
                         CASE sort_order
                           WHEN 1 THEN '#3B82F6' -- azul
                           WHEN 2 THEN '#10B981' -- verde
                           WHEN 3 THEN '#F59E0B' -- naranja
                           WHEN 4 THEN '#EF4444' -- rojo
                           WHEN 5 THEN '#8B5CF6' -- púrpura
                           WHEN 6 THEN '#EC4899' -- rosa
                           ELSE '#6B7280'        -- gris
                         END),
    icon = COALESCE(icon,
                    CASE sort_order
                      WHEN 1 THEN '🏠'
                      WHEN 2 THEN '🌲'
                      WHEN 3 THEN '🔥'
                      WHEN 4 THEN '🏔️'
                      WHEN 5 THEN '🏕️'
                      WHEN 6 THEN '🌅'
                      ELSE '🏡'
                    END);

