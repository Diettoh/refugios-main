-- Phase 2: Campos de Reserva (and Phase 1 persistence)
-- Adds commercial fields to reservations and aligns `source` with business channels.
--
-- References:
-- - .planning/phases/02-campos-de-reserva/02-DISCUSSION.md
-- - .planning/phases/02-campos-de-reserva/02-RESEARCH.md

-- NOTE: nightly_rate, nights, cleaning_supplement, season_type, reservation_document_type
-- and source catalog (RES-04) were moved to 013_c_add_reservation_document_type.sql
-- to support early seeding in 014.
