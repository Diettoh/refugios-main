# Revision Manual `reservas_2025_final (1).csv`

Archivo auditado: [reservas_2025_final (1).csv](C:\Users\diegu\OneDrive\Escritorio\refugios-main\apps\refugios-mvp\docs\reservas_2025_final (1).csv)

## Reglas usadas

- `TIPO` valido: `T`, `P`, `A`, `B`
- `R_C = C` => `cabin_id = 4` (`Casa AvA`)
- `R_C = R` + `AZUL` => `cabin_id = 1` (`Cabaña 1 Azul`)
- `R_C = R` + `ROJO` => `cabin_id = 2` (`Cabaña 2 Roja`)
- `R_C = R` + `VERDE` => `cabin_id = 3` (`Cabaña 3 Verde`)
- Si `TOTAL_ESTADIA` esta vacio, usar `UTILIDAD`
- Si `R_C` esta vacio y el valor por dia supera `120000`, inferir `C` (`Casa AvA`)
- Si `R_C` esta vacio y el valor por dia es `<= 120000`, inferir `R` (`Refugio`)
- Los topes en `Casa AvA` no bloquean la importacion con esta regla

## Recuento

- Filas auditadas: `108`
- `TIPO` no correcto: `27`
- `TIPO` no correcto con valor raro distinto de vacio: `0`
- `R_C` vacio original: `6`
- `R_C` resuelto automaticamente por valor/dia: `4`
- `cabin_id` indeterminado despues de aplicar valor/dia: `4`
- Filas sin monto usable (`TOTAL_ESTADIA` y `UTILIDAD` vacios): `8`
- Solapes detectados en refugios (`cabin_id 1, 2, 3`): `40`
- Solapes en `Casa AvA` ignorados como bloqueo: `6`

## Causas a corregir manualmente

- `TIPO` vacio: falta definir canal y medio de pago
- `R_C` vacio: no se puede resolver `cabin_id`
- `TOTAL_ESTADIA` y `UTILIDAD` vacios: no hay monto base para importar
- Solapes: pueden ser error real, segunda habitacion, continuacion, o que la cabaña mapeada por color/R_C no sea la correcta

## Filas con `TIPO` no correcto

- `Carolina Diaz Yaeger` | `30/06/2025 -> 03/07/2025` | `COLOR=VERDE` | `R_C=VACIO` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=523902.0` | `UTILIDAD=523902.0` | `NOTAS=X`
- `Geraldine Saez` | `30/06/2025 -> 02/07/2025` | `COLOR=VERDE` | `R_C=R` | `TIPO=VACIO` | `PAX=4.0` | `TOTAL=315468.0` | `UTILIDAD=315468.0` | `NOTAS=X`
- `Felipe Villa Vicencio` | `11/07/2025 -> 12/07/2025` | `COLOR=AZUL` | `R_C=C` | `TIPO=VACIO` | `PAX=2.0` | `TOTAL=935906.0` | `UTILIDAD=935906.0` | `NOTAS=X`
- `Diego Coelho` | `12/07/2025 -> 19/07/2025` | `COLOR=NEGRO` | `R_C=VACIO` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=2000000.0` | `UTILIDAD=2000000.0` | `NOTAS=X`
- `Yves Romero` | `13/07/2025 -> 16/07/2025` | `COLOR=AZUL` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=VACIO` | `UTILIDAD=0.0` | `NOTAS=`
- `Catalina Riveros` | `14/07/2025 -> 20/07/2025` | `COLOR=ROJO` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=885920.0` | `UTILIDAD=885920.0` | `NOTAS=X`
- `Paola Gorriateguy` | `14/07/2025 -> 20/07/2025` | `COLOR=ROJO` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=955245.0` | `UTILIDAD=955245.0` | `NOTAS=X`
- `Pamela Medina` | `22/07/2025 -> 24/07/2025` | `COLOR=AZUL` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=362070.0` | `UTILIDAD=362070.0` | `NOTAS=X`
- `Andres Eltit Silva` | `26/07/2025 -> 28/07/2025` | `COLOR=VERDE` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=326132.0` | `UTILIDAD=326132.0` | `NOTAS=X`
- `Cristian Garces` | `28/07/2025 -> 29/07/2025` | `COLOR=AZUL` | `R_C=R` | `TIPO=VACIO` | `PAX=2.0` | `TOTAL=145000.0` | `UTILIDAD=145000.0` | `NOTAS=SII`
- `Evelyn Malgarejo` | `28/07/2025 -> 31/07/2025` | `COLOR=VERDE` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=493772.0` | `UTILIDAD=493772.0` | `NOTAS=X`
- `Evelyn Malgarejo` | `01/08/2025 -> 02/08/2025` | `COLOR=VERDE` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=VACIO` | `UTILIDAD=VACIO` | `NOTAS=(continuación)`
- `Claudia Cortes` | `12/08/2025 -> 16/08/2025` | `COLOR=NEGRO` | `R_C=C` | `TIPO=VACIO` | `PAX=8.0` | `TOTAL=1214414.0` | `UTILIDAD=1214414.0` | `NOTAS=SII`
- `Juan Pablo` | `12/08/2025 -> 13/08/2025` | `COLOR=AZUL` | `R_C=VACIO` | `TIPO=VACIO` | `PAX=1.0` | `TOTAL=VACIO` | `UTILIDAD=VACIO` | `NOTAS=`
- `Begoña Asfura` | `14/08/2025 -> 17/08/2025` | `COLOR=VERDE` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=493772.0` | `UTILIDAD=493772.0` | `NOTAS=X`
- `Daniela Herrera` | `14/08/2025 -> 16/08/2025` | `COLOR=ROJO` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=560440.0` | `UTILIDAD=560440.0` | `NOTAS=X`
- `Pablo Rodriguez Carrasco` | `15/08/2025 -> 17/08/2025` | `COLOR=AZUL` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=370264.0` | `UTILIDAD=370264.0` | `NOTAS=X`
- `Daniela Herrera` | `18/08/2025 -> 19/08/2025` | `COLOR=ROJO` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=560440.0` | `UTILIDAD=560440.0` | `NOTAS=X`
- `Pablo Rodriguez Carrasco` | `18/08/2025 -> 19/08/2025` | `COLOR=AZUL` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=370264.0` | `UTILIDAD=370264.0` | `NOTAS=X`
- `Javier Diaz` | `20/08/2025 -> 31/08/2025` | `COLOR=NEGRO` | `R_C=VACIO` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=700000.0` | `UTILIDAD=700000.0` | `NOTAS=X - larga estadía`
- `Javier Diaz` | `25/08/2025 -> 01/09/2025` | `COLOR=NEGRO` | `R_C=VACIO` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=700000.0` | `UTILIDAD=700000.0` | `NOTAS=X`
- `Martin Basilio` | `28/08/2025 -> 29/08/2025` | `COLOR=ROJO` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=658581.0` | `UTILIDAD=658581.0` | `NOTAS=X`
- `Martin Basilio` | `01/09/2025 -> 05/09/2025` | `COLOR=ROJO` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=658581.0` | `UTILIDAD=658581.0` | `NOTAS=X`
- `Thomas Hoel` | `05/09/2025 -> 07/09/2025` | `COLOR=VERDE` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=371067.0` | `UTILIDAD=371067.0` | `NOTAS=X`
- `Bibiana Rubini` | `08/09/2025 -> 19/09/2025` | `COLOR=ROJO` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=690000.0` | `UTILIDAD=690000.0` | `NOTAS=`
- `Manuel` | `28/11/2025 -> 30/11/2025` | `COLOR=AZUL` | `R_C=R` | `TIPO=VACIO` | `PAX=2.0` | `TOTAL=VACIO` | `UTILIDAD=VACIO` | `NOTAS=`
- `Tomas` | `17/12/2025 -> 19/12/2025` | `COLOR=ROJO` | `R_C=VACIO` | `TIPO=VACIO` | `PAX=VACIO` | `TOTAL=VACIO` | `UTILIDAD=VACIO` | `NOTAS=`

## Filas con `R_C` resuelto por valor/dia

- `Carolina Diaz Yaeger` | `30/06/2025 -> 03/07/2025` | valor/dia `174634` => `C` (`Casa AvA`)
- `Diego Coelho` | `12/07/2025 -> 19/07/2025` | valor/dia `285714.29` => `C` (`Casa AvA`)
- `Javier Diaz` | `25/08/2025 -> 01/09/2025` | valor/dia `100000` => `R` (`Refugio`) pero sigue sin `cabin_id` por `COLOR=NEGRO`
- `Javier Diaz` | `20/08/2025 -> 31/08/2025` | valor/dia `63636.36` => `R` (`Refugio`) pero sigue sin `cabin_id` por `COLOR=NEGRO`

## Filas con `cabin_id` indeterminado despues de aplicar valor/dia

- `Javier Diaz` | `25/08/2025 -> 01/09/2025` | `COLOR=NEGRO` | `R_C inferido=R` | `TIPO=VACIO` | `TOTAL=700000.0` | `UTILIDAD=700000.0` | `NOTAS=X`
- `Javier Diaz` | `20/08/2025 -> 31/08/2025` | `COLOR=NEGRO` | `R_C inferido=R` | `TIPO=VACIO` | `TOTAL=700000.0` | `UTILIDAD=700000.0` | `NOTAS=X - larga estadía`
- `Juan Pablo` | `12/08/2025 -> 13/08/2025` | `COLOR=AZUL` | `R_C=VACIO` | `TIPO=VACIO` | `TOTAL=VACIO` | `UTILIDAD=VACIO` | `NOTAS=`
- `Tomas` | `17/12/2025 -> 19/12/2025` | `COLOR=ROJO` | `R_C=VACIO` | `TIPO=VACIO` | `TOTAL=VACIO` | `UTILIDAD=VACIO` | `NOTAS=`

## Filas sin monto usable

- `Brandyn Phillips` | `01/08/2025 -> 06/08/2025` | `COLOR=ROJO` | `R_C=R` | `TIPO=A` | `PAX=2.0` | `NOTAS=(continuación)`
- `Evelyn Malgarejo` | `01/08/2025 -> 02/08/2025` | `COLOR=VERDE` | `R_C=R` | `TIPO=VACIO` | `PAX=VACIO` | `NOTAS=(continuación)`
- `Jorge Erlwein` | `01/08/2025 -> 02/08/2025` | `COLOR=AZUL` | `R_C=R` | `TIPO=T` | `PAX=2.0` | `NOTAS=(continuación)`
- `Juan Pablo` | `12/08/2025 -> 13/08/2025` | `COLOR=AZUL` | `R_C=VACIO` | `TIPO=VACIO` | `PAX=1.0` | `NOTAS=`
- `Ignacio` | `17/08/2025 -> 19/08/2025` | `COLOR=NEGRO` | `R_C=C` | `TIPO=T` | `PAX=8.0` | `NOTAS=`
- `Valentina` | `28/10/2025 -> 01/11/2025` | `COLOR=NEGRO` | `R_C=C` | `TIPO=A` | `PAX=8.0` | `NOTAS=`
- `Manuel` | `28/11/2025 -> 30/11/2025` | `COLOR=AZUL` | `R_C=R` | `TIPO=VACIO` | `PAX=2.0` | `NOTAS=`
- `Tomas` | `17/12/2025 -> 19/12/2025` | `COLOR=ROJO` | `R_C=VACIO` | `TIPO=VACIO` | `PAX=VACIO` | `NOTAS=`

## Solapes detectados por cabaña

Nota: los solapes en `Casa AvA` ya no se consideran bloqueo automatico. Se mantienen documentados solo como referencia.

### cabin_id 3 (`Cabaña 3 Verde`)

- `Ingrid Mellado` (`18/06/2025 -> 21/06/2025`) se topa con `Oscar Contreras` (`18/06/2025 -> 22/06/2025`)
- `Margorie Henriquez` (`24/06/2025 -> 27/06/2025`) se topa con `Paulina Muñoz (hab 2)` (`26/06/2025 -> 28/06/2025`)
- `Margorie Henriquez` (`24/06/2025 -> 27/06/2025`) se topa con `Paulina Muñoz` (`26/06/2025 -> 28/06/2025`)
- `Paulina Muñoz (hab 2)` (`26/06/2025 -> 28/06/2025`) se topa con `Paulina Muñoz` (`26/06/2025 -> 28/06/2025`)
- `Geraldine Saez` (`30/06/2025 -> 02/07/2025`) se topa con `Romina Sanhueza` (`30/06/2025 -> 02/07/2025`)
- `Gaspar Aunfranc` (`28/08/2025 -> 31/08/2025`) se topa con `Tamara Zarza` (`29/08/2025 -> 31/08/2025`)
- `Gaspar Aunfranc` (`01/09/2025 -> 07/09/2025`) se topa con `Thomas Hoel` (`05/09/2025 -> 07/09/2025`)
- `Gaspar Aunfranc` (`01/09/2025 -> 07/09/2025`) se topa con `Oscar` (`06/09/2025 -> 07/09/2025`)
- `Thomas Hoel` (`05/09/2025 -> 07/09/2025`) se topa con `Oscar` (`06/09/2025 -> 07/09/2025`)
- `Bosnia Refugio 1` (`26/09/2025 -> 17/10/2025`) se topa con `Bosnia Refugio 2` (`01/10/2025 -> 17/10/2025`)

### cabin_id 4 (`Casa AvA`)

- `Lourdes Velasquez` (`06/06/2025 -> 13/06/2025`) se topa con `Gisela Ceballos` (`11/06/2025 -> 13/06/2025`)
- `Horacio Rojas` (`19/06/2025 -> 25/06/2025`) se topa con `Carlos Delgado` (`21/06/2025 -> 24/06/2025`)
- `Vinicius Cruz` (`04/07/2025 -> 13/07/2025`) se topa con `Felipe Villa Vicencio` (`11/07/2025 -> 12/07/2025`)
- `Marcio Zanetti` (`19/07/2025 -> 26/07/2025`) se topa con `Carlos Valenzuela (Paola V)` (`25/07/2025 -> 28/07/2025`)
- `Maria Constanza Moraga` (`04/08/2025 -> 08/08/2025`) se topa con `Yamyl Jarufe` (`07/08/2025 -> 10/08/2025`)
- `Claudia Cortes` (`12/08/2025 -> 16/08/2025`) se topa con `Javier Poroz` (`14/08/2025 -> 15/08/2025`)

### cabin_id 2 (`Cabaña 2 Roja`)

- `Catalina Riveros` (`14/07/2025 -> 20/07/2025`) se topa con `Paola Gorriateguy` (`14/07/2025 -> 20/07/2025`)
- `Felipe Villa Vicencio` (`31/07/2025 -> 02/08/2025`) se topa con `Brandyn Phillips` (`31/07/2025 -> 06/08/2025`)
- `Felipe Villa Vicencio` (`31/07/2025 -> 02/08/2025`) se topa con `Brandyn Phillips` (`01/08/2025 -> 06/08/2025`)
- `Brandyn Phillips` (`31/07/2025 -> 06/08/2025`) se topa con `Brandyn Phillips` (`01/08/2025 -> 06/08/2025`)

### cabin_id 1 (`Cabaña 1 Azul`)

- `Carolina Serin` (`26/06/2025 -> 29/06/2025`) se topa con `Jose Vargas` (`26/06/2025 -> 29/06/2025`)
- `Michel Angelo Lapadula` (`04/07/2025 -> 12/07/2025`) se topa con `Paulo Unzueta` (`10/07/2025 -> 13/07/2025`)
- `Gloria Noguera` (`21/07/2025 -> 27/07/2025`) se topa con `Pamela Medina` (`22/07/2025 -> 24/07/2025`)
- `Cristian Garces` (`28/07/2025 -> 29/07/2025`) se topa con `Jorge Erlwein` (`28/07/2025 -> 31/07/2025`)
- `Andrea Romeny (2)` (`06/08/2025 -> 10/08/2025`) se topa con `Andrea Romeny (1)` (`06/08/2025 -> 10/08/2025`)
- `Pablo Rodriguez Carrasco` (`18/08/2025 -> 19/08/2025`) se topa con `Diego Cid` (`18/08/2025 -> 20/08/2025`)
- `Victor Santos` (`20/08/2025 -> 22/08/2025`) se topa con `Javier Lescano` (`20/08/2025 -> 31/08/2025`)
- `Victor Santos` (`20/08/2025 -> 22/08/2025`) se topa con `Pamela Vera` (`21/08/2025 -> 23/08/2025`)
- `Victor Santos` (`20/08/2025 -> 22/08/2025`) se topa con `Gerardo Ramos` (`21/08/2025 -> 24/08/2025`)
- `Javier Lescano` (`20/08/2025 -> 31/08/2025`) se topa con `Pamela Vera` (`21/08/2025 -> 23/08/2025`)
- `Javier Lescano` (`20/08/2025 -> 31/08/2025`) se topa con `Gerardo Ramos` (`21/08/2025 -> 24/08/2025`)
- `Javier Lescano` (`20/08/2025 -> 31/08/2025`) se topa con `Andres Vasquez` (`22/08/2025 -> 23/08/2025`)
- `Javier Lescano` (`20/08/2025 -> 31/08/2025`) se topa con `Victor Santos` (`25/08/2025 -> 26/08/2025`)
- `Javier Lescano` (`20/08/2025 -> 31/08/2025`) se topa con `Andres Vasquez` (`25/08/2025 -> 27/08/2025`)
- `Javier Lescano` (`20/08/2025 -> 31/08/2025`) se topa con `Sebastian Gianfagma` (`30/08/2025 -> 31/08/2025`)
- `Pamela Vera` (`21/08/2025 -> 23/08/2025`) se topa con `Gerardo Ramos` (`21/08/2025 -> 24/08/2025`)
- `Pamela Vera` (`21/08/2025 -> 23/08/2025`) se topa con `Andres Vasquez` (`22/08/2025 -> 23/08/2025`)
- `Gerardo Ramos` (`21/08/2025 -> 24/08/2025`) se topa con `Andres Vasquez` (`22/08/2025 -> 23/08/2025`)
- `Victor Santos` (`25/08/2025 -> 26/08/2025`) se topa con `Andres Vasquez` (`25/08/2025 -> 27/08/2025`)
- `Rodrigo Salinas` (`09/09/2025 -> 12/09/2025`) se topa con `Andraz` (`09/09/2025 -> 13/10/2025`)
- `Andraz` (`09/09/2025 -> 13/10/2025`) se topa con `Ximena Moraga` (`13/09/2025 -> 17/09/2025`)
- `Andraz` (`09/09/2025 -> 13/10/2025`) se topa con `Ximena Moraga` (`15/09/2025 -> 19/09/2025`)
- `Andraz` (`09/09/2025 -> 13/10/2025`) se topa con `Rene Valdenegro` (`18/09/2025 -> 20/09/2025`)
- `Andraz` (`09/09/2025 -> 13/10/2025`) se topa con `Ignacio Mellado` (`20/09/2025 -> 01/10/2025`)
- `Ximena Moraga` (`13/09/2025 -> 17/09/2025`) se topa con `Ximena Moraga` (`15/09/2025 -> 19/09/2025`)
- `Ximena Moraga` (`15/09/2025 -> 19/09/2025`) se topa con `Rene Valdenegro` (`18/09/2025 -> 20/09/2025`)

## Prioridad sugerida de correccion

1. Completar `R_C` en las `6` filas indeterminadas
2. Completar `TIPO` en las `27` filas
3. Completar monto en las `8` filas sin `TOTAL_ESTADIA` ni `UTILIDAD`
4. Revisar los `46` solapes para separar segunda habitacion, continuacion o corregir cabaña
