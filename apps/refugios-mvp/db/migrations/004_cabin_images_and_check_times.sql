-- Horas de llegada/salida en reservas e imágenes de cabañas (base64).
-- Ejecutar después de 001_init.sql (y 002, 003 si aplican).

-- Reservas: columnas opcionales para hora de llegada y salida (HH:MM)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'check_in_time') THEN
    ALTER TABLE reservations ADD COLUMN check_in_time TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'checkout_time') THEN
    ALTER TABLE reservations ADD COLUMN checkout_time TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'lead_stage') THEN
    ALTER TABLE reservations ADD COLUMN lead_stage TEXT DEFAULT 'lead_new';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'follow_up_at') THEN
    ALTER TABLE reservations ADD COLUMN follow_up_at TIMESTAMPTZ;
  END IF;
END $$;

-- Imágenes de cabañas: cabin_number 1..N (Cabaña 1, Cabaña 2, ...), imagen en base64
CREATE TABLE IF NOT EXISTS cabin_images (
  id SERIAL PRIMARY KEY,
  cabin_number INT NOT NULL CHECK (cabin_number >= 1),
  image_data_base64 TEXT NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cabin_images_cabin ON cabin_images(cabin_number);

COMMENT ON TABLE cabin_images IS 'Imágenes por cabaña almacenadas en base64 para vista de agendamiento';
COMMENT ON COLUMN cabin_images.image_data_base64 IS 'Data URL (data:image/...;base64,...) o base64 puro';
