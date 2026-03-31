import pg from 'pg';
const { Client } = pg;

function getArgValue(flag) {
  const argv = process.argv.slice(2);
  const idx = argv.findIndex((a) => a === flag || a.startsWith(`${flag}=`));
  if (idx === -1) return null;
  const raw = argv[idx];
  if (raw.includes("=")) return raw.split("=").slice(1).join("=");
  return argv[idx + 1] || null;
}

async function run() {
  const urlFromArgs = getArgValue("--url");
  const connectionString =
    urlFromArgs ||
    process.env.DATABASE_URL ||
    'postgresql://refugios:refugios_qa@localhost:5433/refugios';

  const pruneExtra = process.argv.includes("--prune-extra");

  const db = new Client({
    connectionString
  });
  await db.connect();

  const refugioDesc = 'Dormitorio principal: Cama 2 plazas.\nAltillo: Cama 1 plaza.\nLiving: Futón.\n1 Baño con ducha.\nCocina americana equipada.\nCalefacción bosca a pellet.';
  const casaDesc = 'Dormitorio principal: Cama 2 plazas.\nSegundo dormitorio: 2 camas individuales.\nTercer dormitorio: 2 literas (4 camas).\n2 Baños completos.\nLiving amplio, cocina americana.\nEstufa a leña y parafina.';
  const refugioAmenities = ["wifi", "parking", "kitchen", "terrace", "trails", "fireplace", "pet_friendly"];
  const casaAmenities = ["wifi", "parking", "kitchen", "terrace", "trails", "fireplace", "pet_friendly", "hot_tub"];

  const cabinsData = [
    { id: 1, name: 'Cabaña 1 Azul', short: 'C1', type: 'small', pax: 4, color: '#2563eb', icon: '🏡', desc: refugioDesc, am: refugioAmenities },
    { id: 2, name: 'Cabaña 2 Roja', short: 'C2', type: 'small', pax: 4, color: '#dc2626', icon: '🏡', desc: refugioDesc, am: refugioAmenities },
    { id: 3, name: 'Cabaña 3 Verde', short: 'C3', type: 'small', pax: 4, color: '#16a34a', icon: '🏡', desc: refugioDesc, am: refugioAmenities },
    { id: 4, name: 'Casa AvA',       short: 'CASA', type: 'large', pax: 8, color: '#1e293b', icon: '🏠', desc: casaDesc, am: casaAmenities }
  ];

  for (const c of cabinsData) {
    await db.query(`
      INSERT INTO cabins (id, name, description, sort_order, size_category, max_guests, short_code, color_hex, icon, amenities)
      VALUES ($1, $2, $3, $1, $4, $5, $6, $7, $8, $9::text[])
      ON CONFLICT (id) DO UPDATE SET

        name = EXCLUDED.name,
        description = EXCLUDED.description,
        sort_order = EXCLUDED.sort_order,
        size_category = EXCLUDED.size_category,
        max_guests = EXCLUDED.max_guests,
        short_code = EXCLUDED.short_code,
        color_hex = EXCLUDED.color_hex,
        icon = EXCLUDED.icon,
        amenities = EXCLUDED.amenities;
    `, [c.id, c.name, c.desc, c.type, c.pax, c.short, c.color, c.icon, c.am]);
  }

  if (pruneExtra) {
    await db.query(`DELETE FROM cabins WHERE id > 4`);
  }

  const seqRes = await db.query(`SELECT to_regclass('public.cabins_id_seq') AS seq`);
  if (seqRes.rows?.[0]?.seq) {
    await db.query(`SELECT setval('cabins_id_seq', (SELECT MAX(id) FROM cabins))`);
  }

  console.log("Cabins ensured successfully.");

  const res = await db.query('SELECT id, name, short_code FROM cabins ORDER BY id');
  console.table(res.rows);

  await db.end();
}

run().catch(console.error);
