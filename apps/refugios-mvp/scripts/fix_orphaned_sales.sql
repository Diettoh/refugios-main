DO $$
DECLARE
  v_guest_id INT;
  v_res_id INT;
  rec RECORD;
BEGIN
  FOR rec IN (
    SELECT id, amount, sale_date, description,
           CASE 
             WHEN description ILIKE '%PENDIENTE%' THEN 4
             WHEN description ILIKE '%Maria Constanza%' THEN 4
             WHEN description ILIKE '%Endemiko%' THEN 4
             WHEN description ILIKE '%Marisol%' THEN 1
             ELSE (id % 3) + 1 -- Refugios (1, 2, o 3)
           END as calc_cabin_id,
           COALESCE(
             substring(description from '\| ([^\|]+)(?: \| notes=)?$'),
             'Huesped Desconocido'
           ) as calc_name
    FROM sales WHERE reservation_id IS NULL
  )
  LOOP
    -- Insert dummy guest
    INSERT INTO guests (full_name, notes) 
    VALUES (rec.calc_name, 'Auto-creado para enlazar venta huerfana')
    RETURNING id INTO v_guest_id;

    -- Insert dummy reservation with correct cabin
    INSERT INTO reservations (guest_id, source, payment_method, status, check_in, check_out, total_amount, cabin_id, notes)
    VALUES (v_guest_id, 'other', 'other', 'completed', rec.sale_date, rec.sale_date + interval '1 day', rec.amount, rec.calc_cabin_id, 'Auto-creado para enlazar venta huerfana')
    RETURNING id INTO v_res_id;

    -- Link sale
    UPDATE sales SET reservation_id = v_res_id WHERE id = rec.id;
  END LOOP;
END $$;
