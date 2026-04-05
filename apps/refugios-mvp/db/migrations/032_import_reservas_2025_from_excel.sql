-- Migración 032: Importar reservas 2025 verificadas desde Excel
-- Fuente: assets/Reservas AvA Refugios 2025.xlsx
-- Color: azul=C1, rojo=C2, verde=C3, negro=C4 (Casa AvA)

-- 1. Eliminar datos previos de 2025 (rotación incorrecta)
DELETE FROM reservations
WHERE notes = 'ASSET_CORRECTED_2025_2026';

-- 2. Insertar reservas verificadas por el cliente
INSERT INTO reservations
  (guest_id, cabin_id, check_in, check_out, guests_count, total_amount, source, payment_method, status, lead_stage, notes)
VALUES

-- ENERO
(183,3,'2025-01-01','2025-01-02',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Maria Olivia
(197,4,'2025-01-01','2025-01-02',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Andrea
( 13,2,'2025-01-06','2025-01-12',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Jorge
( 36,4,'2025-01-07','2025-01-11',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Daniel
( 26,1,'2025-01-08','2025-01-11',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Rainer
( 28,3,'2025-01-10','2025-01-14',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Javiera
( 29,1,'2025-01-22','2025-01-23',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Fernando
(218,2,'2025-01-23','2025-01-27',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Martin
( 31,1,'2025-01-26','2025-01-28',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- loreto
(272,4,'2025-01-26','2025-02-01',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- ives
(  4,3,'2025-01-29','2025-02-04',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- margarita
( 14,2,'2025-01-31','2025-02-02',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- kara

-- FEBRERO
(189,4,'2025-02-01','2025-02-04',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Felipe
(  5,1,'2025-02-04','2025-02-08',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Paola
(185,4,'2025-02-04','2025-02-06',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Marita
(254,3,'2025-02-04','2025-02-07',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Roberto
(194,2,'2025-02-04','2025-02-06',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- susana
(299,2,'2025-02-06','2025-02-12',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- julio
(204,3,'2025-02-07','2025-02-09',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- patricia
(147,1,'2025-02-08','2025-02-09',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- pedro
(294,4,'2025-02-08','2025-02-14',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- alejandra
(244,2,'2025-02-12','2025-02-15',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- daniel
(268,3,'2025-02-13','2025-02-16',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- javier
(196,1,'2025-02-15','2025-02-17',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- bastian
(300,4,'2025-02-15','2025-02-18',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- daniela
(234,2,'2025-02-16','2025-02-19',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- natalia
(238,3,'2025-02-17','2025-02-22',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- nicole
(225,1,'2025-02-17','2025-02-20',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- enrique
(256,4,'2025-02-20','2025-02-23',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- mariela
(210,2,'2025-02-20','2025-02-23',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- bruno
( 25,1,'2025-02-20','2025-02-23',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- javiera
(237,2,'2025-02-25','2025-02-28',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- esteban
(244,1,'2025-02-27','2025-03-01',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- daniel
(303,3,'2025-02-28','2025-03-02',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- pablo

-- MARZO
(288,4,'2025-03-07','2025-03-08',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- andres
(287,2,'2025-03-07','2025-03-09',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- felipe
(251,1,'2025-03-08','2025-03-15',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- jorge
(259,3,'2025-03-18','2025-03-22',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- cristian
(212,2,'2025-03-19','2025-03-21',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- carolina

-- ABRIL
(195,4,'2025-04-18','2025-04-20',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Claire
(242,2,'2025-04-18','2025-04-20',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- cesar
(219,1,'2025-04-18','2025-04-20',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- rodrigo
(250,3,'2025-04-17','2025-04-20',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- lucas
(200,4,'2025-04-29','2025-05-04',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- sebastian
(193,3,'2025-04-30','2025-05-03',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- pamela
(290,3,'2025-04-01','2025-04-05',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- javier

-- MAYO
(298,3,'2025-05-03','2025-05-04',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- rodrigo
(243,2,'2025-05-01','2025-05-04',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- marcela
(282,1,'2025-05-02','2025-05-04',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- carolina
(232,4,'2025-05-16','2025-05-18',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- paulina
(247,4,'2025-05-18','2025-05-20',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- vanina

-- JUNIO
(260,4,'2025-06-06','2025-06-10',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- lourdes
(306,1,'2025-06-06','2025-06-08',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- maria
(270,4,'2025-06-11','2025-06-13',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- gisela
(249,1,'2025-06-12','2025-06-13',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- gustavo
(262,4,'2025-06-15','2025-06-19',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- gabriela
(301,4,'2025-06-19','2025-06-25',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- horacio
(283,4,'2025-06-25','2025-06-29',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- hernan
(284,3,'2025-06-19','2025-06-22',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- ingrid
(289,2,'2025-06-19','2025-06-22',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- oscar
(266,1,'2025-06-19','2025-06-21',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- carolina
(228,3,'2025-06-22','2025-06-27',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Atiglio
(267,2,'2025-06-23','2025-06-26',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- margorie
(271,1,'2025-06-21','2025-06-23',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- carlos
(232,3,'2025-06-27','2025-06-29',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- paulina
(202,2,'2025-06-26','2025-06-29',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- jose
(277,1,'2025-06-25','2025-06-27',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- carolina
(214,1,'2025-06-27','2025-06-29',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- paulina
(222,2,'2025-06-30','2025-07-04',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- bebora
(265,1,'2025-06-30','2025-07-03',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- romina

-- JULIO
(295,4,'2025-07-01','2025-07-04',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- cesar
(220,1,'2025-07-03','2025-07-05',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- geraldine
(269,3,'2025-07-03','2025-07-06',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- carolina
(279,1,'2025-07-05','2025-07-11',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- michelangelo
(224,2,'2025-07-05','2025-07-12',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- alexandra
(281,4,'2025-07-05','2025-07-12',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- vinicius
(209,3,'2025-07-10','2025-07-13',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- greg
(274,1,'2025-07-11','2025-07-14',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- paulo
(258,4,'2025-07-12','2025-07-19',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- diego
(272,3,'2025-07-13','2025-07-16',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- Yves
(221,2,'2025-07-12','2025-07-13',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- felipe
(  5,1,'2025-07-14','2025-07-20',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- paola
(282,1,'2025-07-21','2025-07-27',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- carolina
(208,2,'2025-07-15','2025-07-20',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- catalina
(291,2,'2025-07-21','2025-07-25',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- hernan
(305,4,'2025-07-21','2025-07-26',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- marcio
(216,1,'2025-07-21','2025-07-27',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- gloria
(261,3,'2025-07-23','2025-07-26',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- matias
(193,2,'2025-07-25','2025-07-27',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- pamela
(264,4,'2025-07-26','2025-07-29',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- carlos
(288,3,'2025-07-26','2025-07-28',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- andres
(259,3,'2025-07-29','2025-07-30',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- cristian
(302,1,'2025-07-30','2025-08-03',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- jorge
(199,4,'2025-07-31','2025-08-04',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- felipe
(191,2,'2025-07-31','2025-08-06',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- brandyn
(285,3,'2025-07-31','2025-08-04',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- evelyn

-- AGOSTO
(188,4,'2025-08-04','2025-08-08',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- M. Constanza
(152,1,'2025-08-03','2025-08-10',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- borja
(197,2,'2025-08-06','2025-08-10',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- andrea
( 75,3,'2025-08-06','2025-08-10',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- andrea
(276,4,'2025-08-08','2025-08-11',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- yamyl
(297,1,'2025-08-11','2025-08-14',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- ramiro
( 74,2,'2025-08-12','2025-08-13',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- juan pablo
(201,4,'2025-08-13','2025-08-17',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- claudia
(245,4,'2025-08-17','2025-08-20',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- ignacio
(190,2,'2025-08-13','2025-08-14',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- javier
(278,3,'2025-08-14','2025-08-17',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- begoña
(304,1,'2025-08-15','2025-08-18',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- pablo
(227,2,'2025-08-15','2025-08-18',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- daniela
(273,1,'2025-08-18','2025-08-20',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- diego
(293,1,'2025-08-21','2025-08-24',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- gerardo
(280,3,'2025-08-21','2025-08-25',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- javier
(241,2,'2025-08-22','2025-08-24',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- pamela
(253,2,'2025-08-24','2025-08-26',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- victor
(246,4,'2025-08-23','2025-08-30',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- rene
(203,1,'2025-08-24','2025-08-27',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- andres
(135,1,'2025-08-27','2025-08-29',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- agus
(239,1,'2025-08-29','2025-08-31',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- tamara
(229,4,'2025-08-30','2025-09-01',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- javier
(255,3,'2025-08-30','2025-09-06',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- sebastian
(263,1,'2025-08-31','2025-09-06',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- gaspar
(236,2,'2025-08-31','2025-09-04',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- martin

-- SEPTIEMBRE
(211,4,'2025-09-01','2025-09-05',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- maria
(215,3,'2025-09-06','2025-09-07',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- ezequiel
(240,2,'2025-09-05','2025-09-07',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- thomas
( 82,2,'2025-09-07','2025-09-08',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- oscar
(134,4,'2025-09-08','2025-09-09',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- juan
(114,1,'2025-09-09','2025-10-13',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- andraz
(205,2,'2025-09-11','2025-09-14',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- rodrigo
(296,2,'2025-09-14','2025-09-18',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- bibiana
(192,4,'2025-09-13','2025-09-17',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- leonel
(206,3,'2025-09-13','2025-09-18',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- ximena
(146,3,'2025-09-18','2025-09-20',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- jaime
(245,2,'2025-09-20','2025-10-01',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- ignacio
(217,4,'2025-09-17','2025-09-22',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- lourdes
(286,2,'2025-09-18','2025-09-20',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- rene
(257,3,'2025-09-20','2025-09-24',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- martu
(213,3,'2025-09-26','2025-10-16',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- bosnia
(226,4,'2025-09-27','2025-10-16',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- andorra

-- OCTUBRE
(213,2,'2025-10-01','2025-10-16',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- bosnia
( 48,4,'2025-10-16','2025-10-21',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- agustin
( 24,4,'2025-10-28','2025-11-01',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- valentina

-- NOVIEMBRE
( 50,1,'2025-11-28','2025-11-30',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- manuel

-- DICIEMBRE
( 24,4,'2025-12-01','2025-12-02',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- valentina
(  2,2,'2025-12-17','2025-12-19',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- tomas
( 27,4,'2025-12-27','2025-12-31',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'), -- camila
(253,1,'2025-12-27','2025-12-30',0,0,'direct','transfer','confirmed','confirmed','ASSET_CORRECTED_2025_2026'); -- victor