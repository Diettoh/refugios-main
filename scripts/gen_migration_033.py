#!/usr/bin/env python3
"""
Genera migration 033 para la base de datos de PRODUCCIÓN (refugios).
Adapta los IDs de guest y cabin de la DB refugios-1 a la DB de producción.
Cabin mapping producción: azul=1, rojo=7, verde=3, negro/Casa=4
"""

import subprocess, json, sys

PROD_URL = "postgresql://neondb_owner:npg_F3DVCG2EUdqy@ep-polished-shadow-ailev4rl-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Cabin mapping: refugios-1 id → production id
CABIN_MAP = {1: 1, 2: 7, 3: 3, 4: 4}

# Guest mapping: refugios-1 guest_id → full_name (from previous queries)
GUEST_NAME_MAP = {
    # 2026 guests (migration 030)
    27: 'Camila Muñoz', 11: 'Fernanda Escorza', 20: 'Barbara',
    15: 'Nicolas Muñoz', 3: 'Francisco Espinoza', 133: 'JUAN CARLOS',
    33: 'Alberto Etchegaray', 18: 'Paulina Cabezas', 21: 'Rodrigo Espinoza',
    198: 'Marcela Rodrigues', 235: 'Felipe Garin', 12: 'Gabriela Soto',
    8: 'Nicolas Sanchez', 9: 'Russel King', 7: 'Alejandra Maturana',
    6: 'Cristobal Muhr', 24: 'Valentina Riquelme', 32: 'Ariana Sepulveda',
    10: 'Andres Goycolea', 25: 'Javiera Garrido', 252: 'Juan Vidria',
    19: 'Luis Reyes', 223: 'Eva Piccars', 30: 'Natalia Ureta',
    1: 'Lourdes Velez', 164: 'Joao Viana', 177: 'JAVIER',
    200: 'Sebastian Perez', 236: 'Martin Basilio', 263: 'Gaspar Aunfraric',
    174: 'MARIA', 125: 'TOMAS', 215: 'Exequeil', 142: 'OSCAR',
    134: 'JUAN', 114: 'ANDRAZ', 205: 'Rodrigo Salinas', 192: 'Leonel Muñoz',
    206: 'Ximena Moraga', 296: 'Bibiana Rubini', 146: 'JAIME',
    286: 'Rene Valdenegro', 257: 'Marta Martu', 245: 'Ignacio Mellado',
    213: 'Bosnia Refugio 1', 226: 'Andorra Casa', 48: 'AGUSTIN',

    # 2025 guests (migration 032) - additional ones not in 2026
    2: 'Tomas Correa', 4: 'Margarita Steff', 5: 'Paola Romero',
    13: 'Jorge Perez', 14: 'Kara Bermejo', 26: 'Rainer Muehlberger',
    28: 'Javiera Pefaur', 29: 'Fernando Larumbe', 31: 'Loreto Hofer',
    36: 'Daniel Mclaughlin', 50: 'MANUEL', 74: 'JUAN PABLO',
    75: 'ANDREA', 82: 'OSCAR', 135: 'AGUS', 147: 'PEDRO',
    152: 'BORJA', 183: 'MARIA OLIVIA', 185: 'MARITA',
    188: 'Maria Constanza Moraga', 189: 'Filipe Hernandez',
    190: 'Javier Lescano', 191: 'Brandyn Phillips', 193: 'Pamela Espinoza',
    194: 'Susana Montesino', 195: 'Claire Wood', 196: 'Bastian Perei',
    197: 'Andrea Romeny', 199: 'Felipe Castaña', 201: 'Claudia Cortes',
    202: 'Jose Vargas', 203: 'Andres Vasquez', 204: 'Patricia Bustamante',
    208: 'Catalina Riveros', 209: 'Greg Bull', 210: 'Bruno Cres',
    211: 'Maria Victoria Gozalves', 212: 'Carolina Bustos', 214: 'Paulina Muñoz',
    216: 'Gloria Noguera', 217: 'Lourdes Velasques', 218: 'Martin Echeverría',
    219: 'Rodrigo Fernandez', 220: 'Geraldine Saez', 221: 'Felipe Villa Vicencio',
    222: 'Debora Castillo', 224: 'Alexandra Garcia', 225: 'Enrique Araos',
    227: 'Daniela Herrera', 228: 'Atigilio', 229: 'Javier Perez',
    232: 'Paulina Vergara', 234: 'Natalia Gonzáles', 237: 'Esteban Contreras',
    238: 'Nicole Abarca', 239: 'Tamara Zarza', 240: 'Thomas Hoel',
    241: 'Pamela Vera', 242: 'Cesar Soto', 243: 'Marcela Perez',
    244: 'Daniel Mora', 246: 'Rene Tapia', 247: 'Vanina Martinez',
    249: 'Gustavo Canales', 250: 'Lucas Gonzales', 251: 'Jorge Lichtscheidi',
    253: 'Victor Santos', 254: 'Roberto Necochea', 255: 'Sebastian Gianfagma',
    256: 'Mariela Offmann', 258: 'Diego Coelho', 259: 'Christian Gardiol',
    260: 'Lourdes Velasquez', 261: 'Matias Lomboy', 262: 'Gabriela Verdugo',
    264: 'Carlos Valenzuela', 265: 'Romina Sanhueza', 266: 'Carolina Andrea Peña',
    267: 'Margorie Henriquez', 268: 'Javier Maldonado', 269: 'Carolina Diaz Yaeger',
    270: 'Gisela Ceballos', 271: 'Carlos Delgado', 272: 'Yves Romero',
    273: 'Diego Cid', 274: 'Paulo Unzueta', 276: 'Yamyl Jarufe',
    277: 'Carolina Senn', 278: 'Begoña Asfura', 279: 'Michel Angelo Lapadula',
    280: 'Javier Diaz', 281: 'Vinicius Cruz', 282: 'Carolina Alvarez',
    283: 'Hernan Wunderlich', 284: 'Ingrid Mellado', 285: 'Evelyn Malgarejo',
    287: 'Felipe Prado', 288: 'Andres Larrain', 289: 'Oscar Contreras',
    290: 'Javier y Camila', 291: 'Hernan Ferrera', 293: 'Gerardo Ramos',
    294: 'Alejandra Stay', 295: 'Cesar Gomez', 297: 'Ramiro Quiroga',
    298: 'Rodrigo Ibañez', 299: 'Julia Quinteros (Julio en reservas)',
    300: 'Daniela Gonzales', 301: 'Horacio Rojas', 302: 'Jorge Erlwein',
    303: 'Pablo Morande', 304: 'Pablo Rodriguez Carrasco', 305: 'Marcio Zanetti',
    306: 'Maria Francisca Valenzuela',
}

def psql_query(sql):
    """Run a SQL query against production and return CSV lines."""
    result = subprocess.run(
        ['psql', PROD_URL, '-t', '-A', '-F', '|', '-c', sql],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print("PSQL ERROR:", result.stderr, file=sys.stderr)
        return []
    return [line for line in result.stdout.strip().split('\n') if line]

# Get all guests in production: name → id (lowest id wins for dedupes)
print("Querying production guests...", file=sys.stderr)
rows = psql_query("SELECT LOWER(full_name), MIN(id) FROM guests GROUP BY LOWER(full_name)")
PROD_GUEST = {}
for row in rows:
    parts = row.split('|')
    if len(parts) == 2:
        PROD_GUEST[parts[0].strip()] = int(parts[1].strip())

# Figure out which guests are missing in production
all_names_needed = set(n.lower() for n in GUEST_NAME_MAP.values())
missing = []
for name in sorted(GUEST_NAME_MAP.values(), key=str.lower):
    if name.lower() not in PROD_GUEST:
        missing.append(name)
missing = list(dict.fromkeys(missing))  # dedupe preserving order

print(f"Missing guests in production: {missing}", file=sys.stderr)

# Parse migration 030 (2026 data) INSERT rows
import re

def parse_insert_rows(filepath, notes_filter):
    """Extract (guest_id, cabin_id, check_in, check_out, guests_count, total_amount, notes, comment)
    from INSERT statements in a migration file."""
    rows = []
    with open(filepath) as f:
        content = f.read()
    # Find INSERT block
    in_insert = False
    for line in content.split('\n'):
        stripped = line.strip()
        if stripped.startswith('INSERT INTO reservations'):
            in_insert = True
            continue
        if in_insert:
            # Match a values row: (guest_id, cabin_id, 'date', 'date', count, amount, 'src', 'pm', 'status', 'lead', 'notes')
            m = re.match(
                r'\(\s*(\d+),\s*(\d+),\s*\'(\d{4}-\d{2}-\d{2})\',\s*\'(\d{4}-\d{2}-\d{2})\',\s*(\d+),\s*(\d+),.*?\'(ASSET_[^\']+)\'\).*?(?:--\s*(.*))?$',
                stripped
            )
            if m:
                g, c, ci, co, gc, ta, nt, cmt = m.groups()
                rows.append({
                    'guest_id': int(g),
                    'cabin_id': int(c),
                    'check_in': ci,
                    'check_out': co,
                    'guests_count': int(gc),
                    'total_amount': int(ta),
                    'notes': nt,
                    'comment': cmt or '',
                })
    return rows

BASE = '/home/rreyes/projects/refugios-main/apps/refugios-mvp/db/migrations'
rows_2026 = parse_insert_rows(f'{BASE}/030_fix_cabin_colors_and_import_2026_reservations.sql', 'ASSET_CORRECTED_2026')
rows_2025 = parse_insert_rows(f'{BASE}/032_import_reservas_2025_from_excel.sql', 'ASSET_CORRECTED_2025_2026')

print(f"Parsed 2026 rows: {len(rows_2026)}", file=sys.stderr)
print(f"Parsed 2025 rows: {len(rows_2025)}", file=sys.stderr)

# --- Generate SQL ---
out = []
out.append("-- Migración 033: Limpieza completa + importación datos verificados Excel")
out.append("-- Solo para la base de datos de producción (refugios / polished-shadow)")
out.append("-- Cabin mapping producción: azul=1, rojo=7, verde=3, negro/Casa=4")
out.append("")
out.append("-- 1. ELIMINAR DATOS SINTÉTICOS / DEMO / PDF")
out.append("DELETE FROM reservations WHERE notes LIKE 'ASSET_PDF_RESERVAS_2025%';")
out.append("DELETE FROM reservations WHERE notes LIKE 'ASSET_PDF_RESERVAS_2026%';")
out.append("DELETE FROM reservations WHERE notes = 'MANUAL_FEB_2026_FINAL';")
out.append("DELETE FROM reservations WHERE notes = 'Importado staging PDF RESERVAS 2026';")
out.append("DELETE FROM reservations WHERE notes LIKE 'ASSET_PDF_VENTAS_2026%';")
out.append("DELETE FROM reservations WHERE notes = 'Reserva demo';")
out.append("DELETE FROM reservations WHERE notes = 'ASSET_CORRECTED_2026';")
out.append("DELETE FROM reservations WHERE notes = 'ASSET_CORRECTED_2025_2026';")
out.append("")
out.append("-- 2. ELIMINAR GUEST DEMO")
out.append("DELETE FROM guests WHERE LOWER(full_name) = 'cliente demo';")
out.append("")

if missing:
    out.append("-- 3. INSERTAR GUESTS FALTANTES EN PRODUCCIÓN")
    for name in missing:
        esc = name.replace("'", "''")
        out.append(f"INSERT INTO guests (full_name, notes) SELECT '{esc}', 'ASSET_CORRECTED_IMPORT' WHERE NOT EXISTS (SELECT 1 FROM guests WHERE LOWER(full_name) = LOWER('{esc}'));")
    out.append("")

def make_row(r, notes_tag):
    old_g = r['guest_id']
    name = GUEST_NAME_MAP.get(old_g, '')
    if not name:
        print(f"WARNING: no name for guest_id={old_g}", file=sys.stderr)
        return None
    esc_name = name.replace("'", "''").lower()
    prod_cabin = CABIN_MAP.get(r['cabin_id'], r['cabin_id'])
    ci, co = r['check_in'], r['check_out']
    gc, ta = r['guests_count'], r['total_amount']
    cmt = r['comment'].strip() if r['comment'] else name
    sql = (
        f"  ((SELECT id FROM guests WHERE LOWER(full_name)=LOWER('{esc_name}') ORDER BY id ASC LIMIT 1),"
        f"{prod_cabin},'{ci}','{co}',{gc},{ta},'direct','transfer','confirmed','confirmed','{notes_tag}')"
    )
    return (sql, cmt)

# 4. INSERT 2026
out.append("-- 4. INSERTAR RESERVAS 2026 VERIFICADAS (Excel)")
out.append("INSERT INTO reservations (guest_id,cabin_id,check_in,check_out,guests_count,total_amount,source,payment_method,status,lead_stage,notes) VALUES")
rows_sql = []
for r in rows_2026:
    tup = make_row(r, 'ASSET_CORRECTED_2026')
    if tup:
        rows_sql.append(tup)
for i, (sql, cmt) in enumerate(rows_sql):
    suffix = ',' if i < len(rows_sql) - 1 else ';'
    out.append(f"{sql}{suffix} -- {cmt}")
out.append("")

# 5. INSERT 2025
out.append("-- 5. INSERTAR RESERVAS 2025 VERIFICADAS (Excel)")
out.append("INSERT INTO reservations (guest_id,cabin_id,check_in,check_out,guests_count,total_amount,source,payment_method,status,lead_stage,notes) VALUES")
rows_sql_25 = []
for r in rows_2025:
    tup = make_row(r, 'ASSET_CORRECTED_2025_2026')
    if tup:
        rows_sql_25.append(tup)
for i, (sql, cmt) in enumerate(rows_sql_25):
    suffix = ',' if i < len(rows_sql_25) - 1 else ';'
    out.append(f"{sql}{suffix} -- {cmt}")
out.append("")

print('\n'.join(out))
