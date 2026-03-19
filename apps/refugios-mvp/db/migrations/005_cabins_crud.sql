-- Tabla cabins (CRUD completo). cabin_images pasa de cabin_number a cabin_id.

CREATE TABLE IF NOT EXISTS cabins (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Crear cabañas 1..6 por defecto
INSERT INTO cabins (name, description, sort_order)
SELECT 'Cabaña ' || n, NULL, n
FROM generate_series(1, 6) AS n
WHERE NOT EXISTS (SELECT 1 FROM cabins LIMIT 1);

-- Crear cabins adicionales para cabin_numbers en cabin_images
INSERT INTO cabins (name, description, sort_order)
SELECT DISTINCT 'Cabaña ' || cabin_number, NULL, cabin_number
FROM cabin_images
WHERE cabin_number IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM cabins WHERE sort_order = cabin_images.cabin_number);

-- Migrar cabin_images de cabin_number a cabin_id
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cabin_images' AND column_name = 'cabin_number') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cabin_images' AND column_name = 'cabin_id') THEN
      ALTER TABLE cabin_images ADD COLUMN cabin_id INT REFERENCES cabins(id) ON DELETE CASCADE;
    END IF;
    UPDATE cabin_images ci SET cabin_id = (SELECT id FROM cabins c WHERE c.sort_order = ci.cabin_number LIMIT 1) WHERE cabin_number IS NOT NULL;
    ALTER TABLE cabin_images ALTER COLUMN cabin_id SET NOT NULL;
    ALTER TABLE cabin_images DROP COLUMN cabin_number;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_cabin_images_cabin_id ON cabin_images(cabin_id);
CREATE INDEX IF NOT EXISTS idx_cabins_sort ON cabins(sort_order);
