-- Password hash para app_users (login con JWT).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'app_users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE app_users ADD COLUMN password_hash TEXT;
  END IF;
END $$;

-- Asignar una contraseña por defecto (bcrypt de 'refugios123') a usuarios existentes sin hash.
UPDATE app_users
SET password_hash = '$2b$10$FzKVn.S5kD00ngB.Q.2wieTO/EvbrZOfhcHutqYEiwIXBx6vJOXIy'
WHERE password_hash IS NULL;

