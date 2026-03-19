import https from 'https';
import pg from 'pg';
const { Client } = pg;

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function fetchImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = res.headers['content-type'];
        resolve(`data:${contentType};base64,${buffer.toString('base64')}`);
      });
    }).on('error', reject);
  });
}

async function run() {
  const htmlCasa = await fetchHtml('https://avarefugios.cl/accommodation/casa-ava/');
  const htmlRefugios = await fetchHtml('https://avarefugios.cl/accommodation/refugios/');

  const imgRegex = /https:\/\/avarefugios\.cl\/wp-content\/uploads\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/g;
  
  let casaImgs = [...new Set(htmlCasa.match(imgRegex))];
  let refImgs = [...new Set(htmlRefugios.match(imgRegex))];

  // Filter out logos and favicons
  const filterFn = url => !url.toLowerCase().includes('logo') && !url.toLowerCase().includes('favicon');
  casaImgs = casaImgs.filter(filterFn).slice(0, 5); // Take up to 5 images
  refImgs = refImgs.filter(filterFn).slice(0, 5); // Take up to 5 images

  console.log(`Downloading ${casaImgs.length} images for Casa and ${refImgs.length} for Refugios...`);

  const db = new Client({
    connectionString: 'postgresql://refugios:refugios_qa@localhost:5433/refugios'
  });
  await db.connect();

  // Clear existing images for safety
  await db.query('DELETE FROM cabin_images WHERE cabin_id IN (1, 2, 3, 4)');

  // Insert Casa Images (id: 4)
  for (let i = 0; i < casaImgs.length; i++) {
    const base64 = await fetchImageAsBase64(casaImgs[i]);
    await db.query(
      'INSERT INTO cabin_images (cabin_id, image_data_base64, sort_order) VALUES ($1, $2, $3)',
      [4, base64, i]
    );
    console.log(`Casa image ${i+1} inserted.`);
  }

  // Insert Refugios Images (ids: 1, 2, 3)
  for (let cabinId of [1, 2, 3]) {
    for (let i = 0; i < refImgs.length; i++) {
      const base64 = await fetchImageAsBase64(refImgs[i]);
      await db.query(
        'INSERT INTO cabin_images (cabin_id, image_data_base64, sort_order) VALUES ($1, $2, $3)',
        [cabinId, base64, i]
      );
      console.log(`Refugio ${cabinId} image ${i+1} inserted.`);
    }
  }

  await db.end();
  console.log("All images processed and saved to database.");
}

run().catch(console.error);