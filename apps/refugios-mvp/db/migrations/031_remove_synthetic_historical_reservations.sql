-- Migración 031: Eliminar reservas sintéticas (Reserva histórica)
-- Estas reservas fueron generadas por rotación automática (seed/demo).
-- Solo se mantienen datos verificados: ASSET_CORRECTED_2026 y ASSET_CORRECTED_2025_2026.

DELETE FROM reservations
WHERE notes = 'Reserva histórica';
