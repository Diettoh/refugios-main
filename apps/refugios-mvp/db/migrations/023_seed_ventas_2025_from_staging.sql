-- Seed de ventas 2025 desde staging normalizado (Ventas AvA 2025.pdf)
-- Inserta en sales y actualiza reservations.

WITH seed(
  seed_key,
  source_file,
  year,
  month,
  page,
  row_no,
  guest_name,
  r_or_c,
  product_code,
  pax,
  pax_ad,
  nights,
  nightly_price,
  cleaning_supplement,
  total_per_night,
  total_stay,
  utility,
  notes,
  quality_flags,
  guest_name_resolved,
  guest_first_norm,
  amount_resolved
) AS (
  VALUES
    ('ASSET_PDF_VENTAS_2025_M1_P1_R1', 'Ventas AvA 2025.pdf', 2025, 1, 1, 1, 'Daniel Mclaughlin', 'C', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 1390806, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Daniel Mclaughlin', 'DANIEL', 1390806),
    ('ASSET_PDF_VENTAS_2025_M1_P1_R2', 'Ventas AvA 2025.pdf', 2025, 1, 1, 2, 'Rainer Muehlberger', 'R', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 390685, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Rainer Muehlberger', 'RAINER', 390685),
    ('ASSET_PDF_VENTAS_2025_M1_P1_R3', 'Ventas AvA 2025.pdf', 2025, 1, 1, 3, 'Jorge Perez', 'R', 'A', 2, 0, 6, 90000, 30000, 90000, 570000, 552900, NULL, NULL, 'Jorge Perez', 'JORGE', 570000),
    ('ASSET_PDF_VENTAS_2025_M1_P1_R4', 'Ventas AvA 2025.pdf', 2025, 1, 1, 4, 'Fernando Larumbe', 'R', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 143393, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Fernando Larumbe', 'FERNANDO', 143393),
    ('ASSET_PDF_VENTAS_2025_M1_P1_R5', 'Ventas AvA 2025.pdf', 2025, 1, 1, 5, 'Javiera Pefaur', 'R', 'P', 2, 0, 4, 90000, NULL, 90000, 360000, 354960, NULL, NULL, 'Javiera Pefaur', 'JAVIERA', 360000),
    ('ASSET_PDF_VENTAS_2025_M1_P1_R6', 'Ventas AvA 2025.pdf', 2025, 1, 1, 6, 'Martín Echeverría', 'R', 'A', 2, 0, 4, 90000, 30000, 90000, 390000, 378300, NULL, NULL, 'Martín Echeverría', 'MARTIN', 390000),
    ('ASSET_PDF_VENTAS_2025_M1_P1_R7', 'Ventas AvA 2025.pdf', 2025, 1, 1, 7, 'Loreto Hofer', 'R', 'P', 3, 0, 2, 90000, NULL, 90000, 180000, 177480, NULL, NULL, 'Loreto Hofer', 'LORETO', 180000),
    ('ASSET_PDF_VENTAS_2025_M1_P1_R8', 'Ventas AvA 2025.pdf', 2025, 1, 1, 8, 'Margarita Steff', 'R', 'A', 2, 0, 6, 90000, 30000, 90000, 570000, 552900, NULL, NULL, 'Margarita Steff', 'MARGARITA', 570000),
    ('ASSET_PDF_VENTAS_2025_M1_P1_R9', 'Ventas AvA 2025.pdf', 2025, 1, 1, 9, 'Kara Bermejo', 'R', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 253000, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Kara Bermejo', 'KARA', 253000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R1', 'Ventas AvA 2025.pdf', 2025, 2, 2, 1, 'Paola Romero', 'R', 'T', 3, 1, 4, 90000, NULL, 110000, 440000, 440000, NULL, NULL, 'Paola Romero', 'PAOLA', 440000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R2', 'Ventas AvA 2025.pdf', 2025, 2, 2, 2, 'Julio Quinteros', 'R', 'T', 2, 0, 6, 90000, NULL, 90000, 540000, 540000, NULL, NULL, 'Julio Quinteros', 'JULIO', 540000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R4', 'Ventas AvA 2025.pdf', 2025, 2, 2, 4, 'Daniel Mora', 'R', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 406980, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Daniel Mora', 'DANIEL', 406980),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R5', 'Ventas AvA 2025.pdf', 2025, 2, 2, 5, 'Natalia Gonzalez', 'R', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 347424, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Natalia Gonzalez', 'NATALIA', 347424),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R6', 'Ventas AvA 2025.pdf', 2025, 2, 2, 6, 'Marita', 'C', 'T', 8, 0, 2, 220000, NULL, 220000, 440000, 440000, NULL, NULL, 'Marita', 'MARITA', 440000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R7', 'Ventas AvA 2025.pdf', 2025, 2, 2, 7, 'Daniela Gonzales', 'C', 'A', 5, 0, 3, 220000, 40000, 220000, 700000, 679000, NULL, NULL, 'Daniela Gonzales', 'DANIELA', 700000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R8', 'Ventas AvA 2025.pdf', 2025, 2, 2, 8, 'Nicole Abarca', 'R', 'P', 3, 0, 5, 90000, NULL, 90000, 450000, 443700, NULL, NULL, 'Nicole Abarca', 'NICOLE', 450000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R9', 'Ventas AvA 2025.pdf', 2025, 2, 2, 9, 'Felipe Hernandez', 'C', 'T', 4, 0, 3, 200000, NULL, 200000, 600000, 600000, NULL, NULL, 'Felipe Hernandez', 'FELIPE', 600000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R10', 'Ventas AvA 2025.pdf', 2025, 2, 2, 10, 'Javier Maldonado', 'R', 'A', 1, 0, 3, 90000, 30000, 90000, 300000, 291000, NULL, NULL, 'Javier Maldonado', 'JAVIER', 300000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R11', 'Ventas AvA 2025.pdf', 2025, 2, 2, 11, 'Susana Montesino', 'R', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 241900, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Susana Montesino', 'SUSANA', 241900),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R12', 'Ventas AvA 2025.pdf', 2025, 2, 2, 12, 'Patricia Bustamante', 'R', 'A', 2, 0, 2, 90000, 30000, 90000, 210000, 203700, NULL, NULL, 'Patricia Bustamante', 'PATRICIA', 210000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R13', 'Ventas AvA 2025.pdf', 2025, 2, 2, 13, 'Alejandra Stay', 'C', 'P', 4, 0, 6, 210000, 40000, 210000, 1300000, 1281800, NULL, NULL, 'Alejandra Stay', 'ALEJANDRA', 1300000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R14', 'Ventas AvA 2025.pdf', 2025, 2, 2, 14, 'Mariela Offmann', 'C', 'T', 8, 0, 3, 200000, NULL, 200000, 600000, 600000, NULL, NULL, 'Mariela Offmann', 'MARIELA', 600000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R15', 'Ventas AvA 2025.pdf', 2025, 2, 2, 15, 'Bastian Perez', 'R', 'T', 2, 0, 2, 90000, 30000, 90000, 210000, 210000, NULL, NULL, 'Bastian Perez', 'BASTIAN', 210000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R16', 'Ventas AvA 2025.pdf', 2025, 2, 2, 16, 'Esteban Contreras', 'R', 'A', 2, 0, 3, 90000, 30000, 90000, 300000, 291000, NULL, NULL, 'Esteban Contreras', 'ESTEBAN', 300000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R17', 'Ventas AvA 2025.pdf', 2025, 2, 2, 17, 'Enrique Araos', 'R', 'T', 3, 0, 3, 50000, 15000, 50000, 165000, 165000, NULL, NULL, 'Enrique Araos', 'ENRIQUE', 165000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R18', 'Ventas AvA 2025.pdf', 2025, 2, 2, 18, 'Javiera Hernandez', 'R', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 345374, '393.000', 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Javiera Hernandez', 'JAVIERA', 345374),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R19', 'Ventas AvA 2025.pdf', 2025, 2, 2, 19, 'Bruno Cres', 'R', 'A', 2, 0, 3, 90000, 30000, 90000, 300000, 291000, NULL, NULL, 'Bruno Cres', 'BRUNO', 300000),
    ('ASSET_PDF_VENTAS_2025_M2_P2_R20', 'Ventas AvA 2025.pdf', 2025, 2, 2, 20, 'Pablo Morande', 'R', 'B', 2, 1, 2, 40000, NULL, 60000, 120000, 220461, NULL, NULL, 'Pablo Morande', 'PABLO', 120000),
    ('ASSET_PDF_VENTAS_2025_M3_P3_R1', 'Ventas AvA 2025.pdf', 2025, 3, 3, 1, 'Andres Larrain', 'C', 'T', 5, 0, 1, 230000, 40000, 230000, 270000, 270000, 'SII', NULL, 'Andres Larrain', 'ANDRES', 270000),
    ('ASSET_PDF_VENTAS_2025_M3_P3_R2', 'Ventas AvA 2025.pdf', 2025, 3, 3, 2, 'Christian Gardiol', 'R', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 420000, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Christian Gardiol', 'CHRISTIAN', 420000),
    ('ASSET_PDF_VENTAS_2025_M3_P3_R3', 'Ventas AvA 2025.pdf', 2025, 3, 3, 3, 'Jorge Lichtscheidl', 'R', 'P', 2, 0, 7, 90000, 30000, 90000, 660000, 650760, NULL, NULL, 'Jorge Lichtscheidl', 'JORGE', 660000),
    ('ASSET_PDF_VENTAS_2025_M3_P3_R4', 'Ventas AvA 2025.pdf', 2025, 3, 3, 4, 'Felipe Prado', 'R', 'P', 2, 0, 2, 90000, 30000, 90000, 210000, 207060, NULL, NULL, 'Felipe Prado', 'FELIPE', 210000),
    ('ASSET_PDF_VENTAS_2025_M3_P3_R5', 'Ventas AvA 2025.pdf', 2025, 3, 3, 5, 'Carolina Bustos', 'R', 'A', 2, 0, 2, 90000, 30000, 90000, 210000, 203700, 'SII', NULL, 'Carolina Bustos', 'CAROLINA', 210000),
    ('ASSET_PDF_VENTAS_2025_M4_P4_R1', 'Ventas AvA 2025.pdf', 2025, 4, 4, 1, 'Javier y Camila', 'R', 'A', 2, 0, 4, 90000, 30000, 90000, 390000, 378300, NULL, NULL, 'Javier y Camila', 'JAVIER', 390000),
    ('ASSET_PDF_VENTAS_2025_M4_P4_R2', 'Ventas AvA 2025.pdf', 2025, 4, 4, 2, 'Claire Wood', 'C', 'P', 8, 0, 2, 210000, 40000, 210000, 460000, 453560, NULL, NULL, 'Claire Wood', 'CLAIRE', 460000),
    ('ASSET_PDF_VENTAS_2025_M4_P4_R3', 'Ventas AvA 2025.pdf', 2025, 4, 4, 3, 'Sebastian Perez', 'C', 'P', 8, 0, 4, 210000, 40000, 210000, 880000, 867680, NULL, NULL, 'Sebastian Perez', 'SEBASTIAN', 880000),
    ('ASSET_PDF_VENTAS_2025_M4_P4_R4', 'Ventas AvA 2025.pdf', 2025, 4, 4, 4, 'Cesar Soto', 'C', 'A', 4, 2, 2, 90000, 40000, 130000, 300000, 291000, NULL, NULL, 'Cesar Soto', 'CESAR', 300000),
    ('ASSET_PDF_VENTAS_2025_M4_P4_R5', 'Ventas AvA 2025.pdf', 2025, 4, 4, 5, 'Rodrigo Fernandez', 'R', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 223149, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Rodrigo Fernandez', 'RODRIGO', 223149),
    ('ASSET_PDF_VENTAS_2025_M4_P4_R6', 'Ventas AvA 2025.pdf', 2025, 4, 4, 6, 'Lucas Gonzales', 'R', 'P', 3, 0, 3, 90000, NULL, 90000, 270000, 266220, NULL, NULL, 'Lucas Gonzales', 'LUCAS', 270000),
    ('ASSET_PDF_VENTAS_2025_M5_P5_R1', 'Ventas AvA 2025.pdf', 2025, 5, 5, 1, 'Pamela Espinoza', 'R', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 279410, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Pamela Espinoza', 'PAMELA', 279410),
    ('ASSET_PDF_VENTAS_2025_M5_P5_R2', 'Ventas AvA 2025.pdf', 2025, 5, 5, 2, 'Marcela Perez', 'R', 'T', 2, 0, 3, 83333, NULL, 83333, 249999, 249999, 'SII', NULL, 'Marcela Perez', 'MARCELA', 249999),
    ('ASSET_PDF_VENTAS_2025_M5_P5_R3', 'Ventas AvA 2025.pdf', 2025, 5, 5, 3, 'Carolina Alvarez', 'R', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 183701, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Carolina Alvarez', 'CAROLINA', 183701),
    ('ASSET_PDF_VENTAS_2025_M5_P5_R4', 'Ventas AvA 2025.pdf', 2025, 5, 5, 4, 'Rodrigo Ibañez', 'R', 'T', 2, 0, 1, 90000, NULL, 90000, 90000, 90000, 'SII', NULL, 'Rodrigo Ibañez', 'RODRIGO', 90000),
    ('ASSET_PDF_VENTAS_2025_M5_P5_R5', 'Ventas AvA 2025.pdf', 2025, 5, 5, 5, 'Paulina Vergara', 'C', 'P', 8, 0, 2, 210000, 40000, 210000, 460000, 453560, NULL, NULL, 'Paulina Vergara', 'PAULINA', 460000),
    ('ASSET_PDF_VENTAS_2025_M5_P5_R6', 'Ventas AvA 2025.pdf', 2025, 5, 5, 6, 'Vanina Martinez', 'C', 'T', 8, 0, 2, 210000, 40000, 210000, 460000, 460000, 'efectivo SII', NULL, 'Vanina Martinez', 'VANINA', 460000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R1', 'Ventas AvA 2025.pdf', 2025, 6, 6, 1, 'Hernan Wunderlich', 'C', 'T', 8, 0, 4, 295000, 40000, 295000, 1220000, 1220000, 'SII', NULL, 'Hernan Wunderlich', 'HERNAN', 1220000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R2', 'Ventas AvA 2025.pdf', 2025, 6, 6, 2, 'Horacio Rojas', 'C', 'A', 6, 0, 6, 299600, 40000, 299600, 1837600, 1782472, 'SII', NULL, 'Horacio Rojas', 'HORACIO', 1837600),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R3', 'Ventas AvA 2025.pdf', 2025, 6, 6, 3, 'Paulina Muñoz', 'R', 'P', 4, 2, 2, 110000, 30000, 150000, 330000, 325380, NULL, NULL, 'Paulina Muñoz', 'PAULINA', 330000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R4', 'Ventas AvA 2025.pdf', 2025, 6, 6, 4, 'Paulina Muñoz', 'R', 'P', 2, 2, 2, 110000, 30000, 150000, 330000, 325380, NULL, NULL, 'Paulina Muñoz', 'PAULINA', 330000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R5', 'Ventas AvA 2025.pdf', 2025, 6, 6, 5, 'Oscar Contreras', 'R', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 538919, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Oscar Contreras', 'OSCAR', 538919),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R6', 'Ventas AvA 2025.pdf', 2025, 6, 6, 6, 'Debora Castillo', 'R', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 715886, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Debora Castillo', 'DEBORA', 715886),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R7', 'Ventas AvA 2025.pdf', 2025, 6, 6, 7, 'Maria Francisca Valenzuela', 'R', 'P', 2, 0, 2, 90000, 30000, 90000, 210000, 207060, NULL, NULL, 'Maria Francisca Valenzuela', 'MARIA', 210000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R8', 'Ventas AvA 2025.pdf', 2025, 6, 6, 8, 'Gabriela Verdugo', 'C', 'T', 8, 0, 4, 262500, NULL, 262500, 1050000, 1050000, 'SII', NULL, 'Gabriela Verdugo', 'GABRIELA', 1050000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R9', 'Ventas AvA 2025.pdf', 2025, 6, 6, 9, 'Carolina Andrea Peña', 'R', 'T', 2, 1, 2, 110000, 30000, 130000, 290000, 290000, 'SII', NULL, 'Carolina Andrea Peña', 'CAROLINA', 290000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R10', 'Ventas AvA 2025.pdf', 2025, 6, 6, 10, 'Lourdes Velasquez', 'C', 'A', 4, 0, 4, 280000, 40000, 280000, 1160000, 1125200, 'SII', NULL, 'Lourdes Velasquez', 'LOURDES', 1160000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R11', 'Ventas AvA 2025.pdf', 2025, 6, 6, 11, 'Gisela Ceballos', 'C', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 495419, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Gisela Ceballos', 'GISELA', 495419),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R12', 'Ventas AvA 2025.pdf', 2025, 6, 6, 12, 'Carlos Delgado', 'C', 'B', NULL, NULL, NULL, NULL, NULL, NULL, 0, 355894, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Carlos Delgado', 'CARLOS', 355894),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R13', 'Ventas AvA 2025.pdf', 2025, 6, 6, 13, 'Ingrid Mellado', 'R', 'T', 2, 2, 3, 110000, NULL, 150000, 450000, 450000, 'SII', NULL, 'Ingrid Mellado', 'INGRID', 450000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R14', 'Ventas AvA 2025.pdf', 2025, 6, 6, 14, 'Romina Sanhueza', 'R', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 485569, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Romina Sanhueza', 'ROMINA', 485569),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R15', 'Ventas AvA 2025.pdf', 2025, 6, 6, 15, 'Gustavo Canales', 'R', 'T', 1, 0, 1, 110000, NULL, 110000, 110000, 110000, 'SII', NULL, 'Gustavo Canales', 'GUSTAVO', 110000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R16', 'Ventas AvA 2025.pdf', 2025, 6, 6, 16, 'Jose Vargas', 'R', 'T', 2, 1, 3, 110000, NULL, 130000, 390000, 390000, 'SII', NULL, 'Jose Vargas', 'JOSE', 390000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R17', 'Ventas AvA 2025.pdf', 2025, 6, 6, 17, 'Atiglio', 'R', 'T', 3, 0, 5, 113200, NULL, 113200, 566000, 566000, '600 usd', NULL, 'Atiglio', 'ATIGLIO', 566000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R18', 'Ventas AvA 2025.pdf', 2025, 6, 6, 18, 'Margorie Henrriquez', 'R', 'T', 2, 1, 3, 110000, NULL, 130000, 390000, 390000, 'X', NULL, 'Margorie Henrriquez', 'MARGORIE', 390000),
    ('ASSET_PDF_VENTAS_2025_M6_P6_R19', 'Ventas AvA 2025.pdf', 2025, 6, 6, 19, 'Carolina Serin', 'R', 'T', 2, 1, 2, 110000, NULL, 130000, 260000, 260000, 'SII', NULL, 'Carolina Serin', 'CAROLINA', 260000),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R1', 'Ventas AvA 2025.pdf', 2025, 7, 7, 1, 'Alexandra Garcia', 'R', 'A', 2, 1, 7, 110700, 30000, 130700, 944900, 916553, 'SII', NULL, 'Alexandra Garcia', 'ALEXANDRA', 944900),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R2', 'Ventas AvA 2025.pdf', 2025, 7, 7, 2, 'Greg Bull', 'R', 'A', 2, 2, 3, 110700, 30000, 150700, 482100, 467637, 'SII', NULL, 'Greg Bull', 'GREG', 482100),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R3', 'Ventas AvA 2025.pdf', 2025, 7, 7, 3, 'Marcio Zanetti', 'C', 'T', 4, 0, 7, 300000, 40000, 300000, 2140000, 2140000, 'SII', NULL, 'Marcio Zanetti', 'MARCIO', 2140000),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R4', 'Ventas AvA 2025.pdf', 2025, 7, 7, 4, 'Vinicius Cruz', 'C', 'A', 8, 0, 7, 299600, 40000, 299600, 2137200, 2073084, 'SII', NULL, 'Vinicius Cruz', 'VINICIUS', 2137200),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R5', 'Ventas AvA 2025.pdf', 2025, 7, 7, 5, 'Felipe Castañia', 'C', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 935906, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Felipe Castañia', 'FELIPE', 935906),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R6', 'Ventas AvA 2025.pdf', 2025, 7, 7, 6, 'Cesar Gomez', 'C', 'P', 8, 0, 3, 300000, 40000, 300000, 940000, 926840, 'X', NULL, 'Cesar Gomez', 'CESAR', 940000),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R7', 'Ventas AvA 2025.pdf', 2025, 7, 7, 7, 'Gloria Noguera', 'R', 'T', 4, 2, 6, 110000, NULL, 150000, 900000, 900000, 'X', NULL, 'Gloria Noguera', 'GLORIA', 900000),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R8', 'Ventas AvA 2025.pdf', 2025, 7, 7, 8, 'Michel Angelo Lapadula', 'R', 'P', 2, 0, 6, 110000, 30000, 110000, 690000, 680340, 'X', NULL, 'Michel Angelo Lapadula', 'MICHEL', 690000),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R9', 'Ventas AvA 2025.pdf', 2025, 7, 7, 9, 'Brandyn Phillips', 'R', 'A', 2, 0, 6, 110700, 30000, 110700, 694200, 673374, 'SII', NULL, 'Brandyn Phillips', 'BRANDYN', 694200),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R10', 'Ventas AvA 2025.pdf', 2025, 7, 7, 10, 'Catalina Riveros', 'R', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 885920, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Catalina Riveros', 'CATALINA', 885920),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R11', 'Ventas AvA 2025.pdf', 2025, 7, 7, 11, 'Valeska Arias', 'R', 'A', 2, 1, 3, 110700, 30000, 130700, 422100, 409437, 'SII', NULL, 'Valeska Arias', 'VALESKA', 422100),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R12', 'Ventas AvA 2025.pdf', 2025, 7, 7, 12, 'Carlos Valenzuela Paola V', 'C', 'T', 5, 0, 3, 300000, 40000, 300000, 940000, 940000, 'X', NULL, 'Carlos Valenzuela Paola V', 'CARLOS', 940000),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R13', 'Ventas AvA 2025.pdf', 2025, 7, 7, 13, 'Carolina Diaz Yaeger', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 523902, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Carolina Diaz Yaeger', 'CAROLINA', 523902),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R14', 'Ventas AvA 2025.pdf', 2025, 7, 7, 14, 'Diego Coelho', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 2000000, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Diego Coelho', 'DIEGO', 2000000),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R16', 'Ventas AvA 2025.pdf', 2025, 7, 7, 16, 'Hernan Ferrera', 'R', 'P', 2, 1, 4, 110000, 30000, 130000, 550000, 542300, 'X', NULL, 'Hernan Ferrera', 'HERNAN', 550000),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R17', 'Ventas AvA 2025.pdf', 2025, 7, 7, 17, 'Cristian Garces', 'R', NULL, 2, 0, 1, 145000, NULL, 145000, 145000, 145000, 'tinaja SII', 'missing_product_code', 'Cristian Garces', 'CRISTIAN', 145000),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R18', 'Ventas AvA 2025.pdf', 2025, 7, 7, 18, 'Poala Gorriateguy', 'R', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 955245, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Poala Gorriateguy', 'POALA', 955245),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R19', 'Ventas AvA 2025.pdf', 2025, 7, 7, 19, 'Pamela Medina', 'R', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 362070, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Pamela Medina', 'PAMELA', 362070),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R20', 'Ventas AvA 2025.pdf', 2025, 7, 7, 20, 'Geraldine Saez', 'R', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 315468, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Geraldine Saez', 'GERALDINE', 315468),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R21', 'Ventas AvA 2025.pdf', 2025, 7, 7, 21, 'Felipe Villa Vicencio', 'R', 'T', 2, 0, 1, 110000, NULL, 110000, 110000, 110000, 'SII', NULL, 'Felipe Villa Vicencio', 'FELIPE', 110000),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R22', 'Ventas AvA 2025.pdf', 2025, 7, 7, 22, 'Paulo Unzueta', 'R', 'P', 2, 2, 3, 110000, 30000, 150000, 480000, 473280, 'X', NULL, 'Paulo Unzueta', 'PAULO', 480000),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R23', 'Ventas AvA 2025.pdf', 2025, 7, 7, 23, 'Andres Eltit Silva', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 326132, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Andres Eltit Silva', 'ANDRES', 326132),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R24', 'Ventas AvA 2025.pdf', 2025, 7, 7, 24, 'Matias Lomboy', 'R', 'T', NULL, NULL, NULL, NULL, NULL, NULL, 0, 270000, 'SII', 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Matias Lomboy', 'MATIAS', 270000),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R25', 'Ventas AvA 2025.pdf', 2025, 7, 7, 25, 'Evelyn Malgarejo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 493772, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Evelyn Malgarejo', 'EVELYN', 493772),
    ('ASSET_PDF_VENTAS_2025_M7_P7_R26', 'Ventas AvA 2025.pdf', 2025, 7, 7, 26, 'Jorge Erlwein', 'R', 'T', NULL, NULL, NULL, NULL, NULL, NULL, 0, 320000, 'SII', 'insufficient_numeric_columns;missing_total_stay_uses_utility', 'Jorge Erlwein', 'JORGE', 320000),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R1', 'Ventas AvA 2025.pdf', 2025, 8, 8, 1, 'Rene Tapia', 'C', 'T', 8, 0, 7, 280000, 40000, 280000, 2000000, 2295000, '295.000 aseo persona extraSII', NULL, 'Rene Tapia', 'RENE', 2000000),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R2', 'Ventas AvA 2025.pdf', 2025, 8, 8, 2, 'Claudia Cortes', 'C', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1214414, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Claudia Cortes', 'CLAUDIA', 1214414),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R3', 'Ventas AvA 2025.pdf', 2025, 8, 8, 3, 'Yamyl Jarufe', 'C', 'P', 8, 0, 3, 280000, 40000, 280000, 880000, 867680, 'debe $75.000 X', NULL, 'Yamyl Jarufe', 'YAMYL', 880000),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R4', 'Ventas AvA 2025.pdf', 2025, 8, 8, 4, 'Maria Constanza Moraga', 'C', 'T', 2, 0, 4, 210000, NULL, 210000, 840000, 840000, 'SII', NULL, 'Maria Constanza Moraga', 'MARIA', 840000),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R5', 'Ventas AvA 2025.pdf', 2025, 8, 8, 5, 'Andres Vasquez', 'R', 'A', 2, 0, 3, 100800, 30000, 100800, 332400, 322428, 'SII', NULL, 'Andres Vasquez', 'ANDRES', 332400),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R6', 'Ventas AvA 2025.pdf', 2025, 8, 8, 6, 'Javier Poroz', 'C', 'T', 8, 0, 2, 280000, NULL, 280000, 560000, 560000, 'SII', NULL, 'Javier Poroz', 'JAVIER', 560000),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R7', 'Ventas AvA 2025.pdf', 2025, 8, 8, 7, 'Pablo Rodriguez Carrasco', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 370264, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Pablo Rodriguez Carrasco', 'PABLO', 370264),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R8', 'Ventas AvA 2025.pdf', 2025, 8, 8, 8, 'Gerardo Ramos', 'R', 'A', 2, 0, 3, 100800, 30000, 100800, 332400, 322428, 'SII', NULL, 'Gerardo Ramos', 'GERARDO', 332400),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R9', 'Ventas AvA 2025.pdf', 2025, 8, 8, 9, 'Begoña Asfura', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 493772, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Begoña Asfura', 'BEGONA', 493772),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R10', 'Ventas AvA 2025.pdf', 2025, 8, 8, 10, 'Daniela Herrera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 560400, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Daniela Herrera', 'DANIELA', 560400),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R11', 'Ventas AvA 2025.pdf', 2025, 8, 8, 11, 'Andrea Romeny', 'R', 'T', 2, 2, 4, 110000, NULL, 150000, 600000, 600000, 'SII', NULL, 'Andrea Romeny', 'ANDREA', 600000),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R12', 'Ventas AvA 2025.pdf', 2025, 8, 8, 12, 'Andrea Romeny', 'R', 'T', 2, 2, 4, 110000, NULL, 150000, 600000, 600000, 'SII', NULL, 'Andrea Romeny', 'ANDREA', 600000),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R13', 'Ventas AvA 2025.pdf', 2025, 8, 8, 13, 'Borja', 'R', 'A', 2, 0, 7, 100800, 30000, 100800, 735600, 713532, 'SII', NULL, 'Borja', 'BORJA', 735600),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R15', 'Ventas AvA 2025.pdf', 2025, 8, 8, 15, 'Ramiro Quiroga', 'R', 'A', 2, 2, 3, 100800, 30000, 140800, 452400, 438828, 'SII', NULL, 'Ramiro Quiroga', 'RAMIRO', 452400),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R16', 'Ventas AvA 2025.pdf', 2025, 8, 8, 16, 'Javier Diaz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 700000, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Javier Diaz', 'JAVIER', 700000),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R17', 'Ventas AvA 2025.pdf', 2025, 8, 8, 17, 'Javier Lescano', 'R', 'T', 2, 2, 1, 110000, NULL, 150000, 150000, 150000, 'SII', NULL, 'Javier Lescano', 'JAVIER', 150000),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R18', 'Ventas AvA 2025.pdf', 2025, 8, 8, 18, 'Sebastian Gianfagma', 'R', 'A', 2, 0, 7, 100800, 30000, 100800, 735600, 713532, 'SII', NULL, 'Sebastian Gianfagma', 'SEBASTIAN', 735600),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R19', 'Ventas AvA 2025.pdf', 2025, 8, 8, 19, 'Diego Cid', 'R', 'A', 2, 0, 2, 100800, 30000, 100800, 231600, 224652, '$70.000 SII', NULL, 'Diego Cid', 'DIEGO', 231600),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R20', 'Ventas AvA 2025.pdf', 2025, 8, 8, 20, 'Pamela Vera', 'R', 'T', 2, 0, 2, 110000, NULL, 110000, 220000, 220000, 'SII', NULL, 'Pamela Vera', 'PAMELA', 220000),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R21', 'Ventas AvA 2025.pdf', 2025, 8, 8, 21, 'Victor Santos', 'R', 'A', 2, 0, 2, 100800, 30000, 100800, 231600, 224652, 'SII', NULL, 'Victor Santos', 'VICTOR', 231600),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R22', 'Ventas AvA 2025.pdf', 2025, 8, 8, 22, 'Agus', 'R', 'T', 2, 0, 2, 110000, NULL, 110000, 220000, 220000, 'X', NULL, 'Agus', 'AGUS', 220000),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R23', 'Ventas AvA 2025.pdf', 2025, 8, 8, 23, 'Tamara Zarza', 'R', 'P', 2, 0, 2, 110000, 30000, 110000, 250000, 246500, 'X', NULL, 'Tamara Zarza', 'TAMARA', 250000),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R24', 'Ventas AvA 2025.pdf', 2025, 8, 8, 24, 'Martin Basilio', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 658581, 'X', 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Martin Basilio', 'MARTIN', 658581),
    ('ASSET_PDF_VENTAS_2025_M8_P8_R25', 'Ventas AvA 2025.pdf', 2025, 8, 8, 25, 'Gaspar Aunfranc', 'R', 'A', 2, 0, 6, 100800, 30000, 100800, 634800, 615756, 'SII', NULL, 'Gaspar Aunfranc', 'GASPAR', 634800),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R1', 'Ventas AvA 2025.pdf', 2025, 9, 9, 1, 'Bibiana Rubini', 'R', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 690000, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Bibiana Rubini', 'BIBIANA', 690000),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R2', 'Ventas AvA 2025.pdf', 2025, 9, 9, 2, 'Leonel Muñoz', 'C', 'A', 5, 0, 4, 280000, 40000, 280000, 1160000, 1125200, NULL, NULL, 'Leonel Muñoz', 'LEONEL', 1160000),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R3', 'Ventas AvA 2025.pdf', 2025, 9, 9, 3, 'Rene Valdenegro', 'R', 'A', 2, 2, 2, 110700, 30000, 150700, 331400, 321458, NULL, NULL, 'Rene Valdenegro', 'RENE', 331400),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R4', 'Ventas AvA 2025.pdf', 2025, 9, 9, 4, 'Ximena Moraga', 'R', 'A', 2, 0, 5, 100800, 30000, 100800, 534000, 517980, 'comision iva Total Summer Camp', NULL, 'Ximena Moraga', 'XIMENA', 534000),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R5', 'Ventas AvA 2025.pdf', 2025, 9, 9, 5, 'Andraz', 'R', 'T', 2, 0, 34, 129800, NULL, 129800, 4413200, 4413200, '$661.980 15% $125.776. iva $787.756', NULL, 'Andraz', 'ANDRAZ', 4413200),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R6', 'Ventas AvA 2025.pdf', 2025, 9, 9, 6, 'Andorra Casa', 'C', 'T', 5, 0, 19, 290000, NULL, 290000, 5510000, 5510000, '$826.596 15% $157.053 iva $983.649', NULL, 'Andorra Casa', 'ANDORRA', 5510000),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R7', 'Ventas AvA 2025.pdf', 2025, 9, 9, 7, 'Bosnia Refugio 1', 'R', 'T', 2, 0, 21, 129800, NULL, 129800, 2725800, 2725800, '$649000 Mallines $689.250 15% $130.957. iva $820.207', NULL, 'Bosnia Refugio 1', 'BOSNIA', 2725800),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R8', 'Ventas AvA 2025.pdf', 2025, 9, 9, 8, 'Bosnia Refugio 2', 'R', 'T', 1, 0, 16, 90000, NULL, 90000, 1440000, 1440000, '...', NULL, 'Bosnia Refugio 2', 'BOSNIA', 1440000),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R9', 'Ventas AvA 2025.pdf', 2025, 9, 9, 9, 'Ignacio Mellado', 'R', 'T', 2, 0, 11, 129800, NULL, 129800, 1427800, 1427800, '$214.170. 15% $40.692. iva $254.862', NULL, 'Ignacio Mellado', 'IGNACIO', 1427800),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R10', 'Ventas AvA 2025.pdf', 2025, 9, 9, 10, 'Lourdes Velasquez', 'C', 'A', 8, 0, 5, 308000, 40000, 308000, 1580000, 1532600, '$2.846.474', NULL, 'Lourdes Velasquez', 'LOURDES', 1580000),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R11', 'Ventas AvA 2025.pdf', 2025, 9, 9, 11, 'Rodrigo Salinas', 'R', 'P', 2, 0, 3, 110000, 30000, 110000, 360000, 354960, NULL, NULL, 'Rodrigo Salinas', 'RODRIGO', 360000),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R12', 'Ventas AvA 2025.pdf', 2025, 9, 9, 12, 'Thomas Hoel', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 371067, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Thomas Hoel', 'THOMAS', 371067),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R13', 'Ventas AvA 2025.pdf', 2025, 9, 9, 13, 'Maria Victoria Gozalvez', 'C', 'A', 8, 0, 4, 280000, 40000, 280000, 1160000, 1125200, NULL, NULL, 'Maria Victoria Gozalvez', 'MARIA', 1160000),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R14', 'Ventas AvA 2025.pdf', 2025, 9, 9, 14, 'Martu Martu', 'R', 'A', 2, 1, 4, 105800, 30000, 125800, 533200, 517204, NULL, NULL, 'Martu Martu', 'MARTU', 533200),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R15', 'Ventas AvA 2025.pdf', 2025, 9, 9, 15, 'Exequeil', 'R', 'T', 2, 2, 1, 110000, NULL, 150000, 150000, 150000, NULL, NULL, 'Exequeil', 'EXEQUEIL', 150000),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R16', 'Ventas AvA 2025.pdf', 2025, 9, 9, 16, 'Oscar', 'R', 'T', 2, 1, 1, 110000, NULL, 130000, 130000, 130000, NULL, NULL, 'Oscar', 'OSCAR', 130000),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R17', 'Ventas AvA 2025.pdf', 2025, 9, 9, 17, 'Juan', 'C', 'T', 6, 0, 1, 280000, NULL, 280000, 280000, 280000, NULL, NULL, 'Juan', 'JUAN', 280000),
    ('ASSET_PDF_VENTAS_2025_M9_P9_R18', 'Ventas AvA 2025.pdf', 2025, 9, 9, 18, 'Jaime', 'R', 'A', 2, 1, 2, 100800, 30000, 120800, 271600, 263452, NULL, NULL, 'Jaime', 'JAIME', 271600),
    ('ASSET_PDF_VENTAS_2025_M10_P10_R1', 'Ventas AvA 2025.pdf', 2025, 10, 10, 1, 'Endemiko', 'C', 'T', 8, 0, 4, 220000, NULL, 220000, 880000, 880000, NULL, NULL, 'Endemiko', 'ENDEMIKO', 880000),
    ('ASSET_PDF_VENTAS_2025_M10_P10_R2', 'Ventas AvA 2025.pdf', 2025, 10, 10, 2, 'Marisol Navarro', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 333764, NULL, 'insufficient_numeric_columns;missing_total_stay_uses_utility;missing_product_code', 'Marisol Navarro', 'MARISOL', 333764),
    ('ASSET_PDF_VENTAS_2025_M12_P12_R1', 'Ventas AvA 2025.pdf', 2025, 12, 12, 1, 'Camila Larrain', 'C', 'A', 8, 0, 7, 261000, 40000, 261000, 1867000, 1810990, NULL, NULL, 'Camila Larrain', 'CAMILA', 1867000),
    ('ASSET_PDF_VENTAS_2025_M12_P12_R2', 'Ventas AvA 2025.pdf', 2025, 12, 12, 2, 'Victor Collinao', 'R', 'A', 2, 0, 3, 90000, 30000, 90000, 300000, 291000, NULL, NULL, 'Victor Collinao', 'VICTOR', 300000)
),
resolved AS (
  SELECT
    s.*,
    make_date(s.year, s.month, 1) AS month_date,
    (
      SELECT r.id
      FROM reservations r
      JOIN guests g ON g.id = r.guest_id
      WHERE r.notes LIKE 'ASSET_PDF_RESERVAS_2025%'
        AND date_trunc('month', r.check_in) = date_trunc('month', make_date(s.year, s.month, 1))
        AND upper(regexp_replace(g.full_name, '\s+.*$', '')) = s.guest_first_norm
      ORDER BY r.check_in, r.id
      LIMIT 1
    ) AS reservation_id
  FROM seed s
  WHERE COALESCE(s.amount_resolved, 0) > 0
),
updated_reservations AS (
  UPDATE reservations r
  SET 
    source = CASE 
      WHEN res.product_code = 'T' THEN 'direct'
      WHEN res.product_code = 'P' THEN 'web'
      WHEN res.product_code = 'A' THEN 'airbnb'
      WHEN res.product_code = 'B' THEN 'booking'
      ELSE r.source
    END,
    payment_method = CASE
      WHEN res.product_code = 'T' THEN 'transfer'
      WHEN res.product_code = 'P' THEN 'card'
      WHEN res.product_code IN ('A', 'B') THEN 'other'
      ELSE r.payment_method
    END,
    cabin_id = CASE
      WHEN res.r_or_c = 'C' THEN 4
      WHEN res.r_or_c = 'R' AND r.cabin_id IS NULL THEN (SELECT id FROM cabins WHERE sort_order IN (1,2,3) ORDER BY random() LIMIT 1)
      ELSE r.cabin_id
    END,
    additional_charge = COALESCE(res.cleaning_supplement, 0),
    reservation_document_type = CASE
      WHEN res.notes ILIKE '%sii%' OR res.notes ILIKE '%boleta%' THEN 'boleta'
      WHEN res.notes ILIKE '%factura%' THEN 'factura'
      ELSE NULL
    END,
    total_amount = res.amount_resolved
  FROM resolved res
  WHERE r.id = res.reservation_id
  RETURNING r.id
)
INSERT INTO sales (
  reservation_id,
  category,
  amount,
  payment_method,
  sale_date,
  description
)
SELECT
  r.reservation_id,
  CASE WHEN r.cleaning_supplement > 0 THEN 'lodging' ELSE 'lodging' END,
  r.amount_resolved::numeric(12,2),
  CASE
    WHEN r.product_code = 'T' THEN 'transfer'
    WHEN r.product_code = 'P' THEN 'card'
    ELSE 'other'
  END,
  COALESCE((SELECT rr.check_in FROM reservations rr WHERE rr.id = r.reservation_id), r.month_date),
  ('ASSET_PDF_VENTAS_2025' || ' | key=' || r.seed_key || ' | ' || r.guest_name_resolved
    || CASE WHEN r.notes IS NOT NULL THEN ' | notes=' || r.notes ELSE '' END
  )
FROM resolved r
WHERE NOT EXISTS (
  SELECT 1 FROM sales s WHERE s.description = ('ASSET_PDF_VENTAS_2025' || ' | key=' || r.seed_key || ' | ' || r.guest_name_resolved
    || CASE WHEN r.notes IS NOT NULL THEN ' | notes=' || r.notes ELSE '' END
  )
);
