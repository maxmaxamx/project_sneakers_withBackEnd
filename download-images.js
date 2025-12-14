const fs = require('fs');          // для createWriteStream
const fsp = require('fs').promises; // для readFile, writeFile, access, mkdir
const path = require('path');
const axios = require('axios');

// Путь к JSON-файлу
const JSON_PATH = './data/sneakers.json';
const IMAGES_DIR = './public/images';

async function ensureImagesDir() {
  try {
    await fsp.access(IMAGES_DIR);
  } catch {
    await fsp.mkdir(IMAGES_DIR, { recursive: true });
  }
}

function getFilenameFromUrl(url) {
  const cleanUrl = url.trim();
  try {
    const urlObj = new URL(cleanUrl);
    const pathname = path.basename(urlObj.pathname);
    return pathname.split('?')[0] || 'image.webp';
  } catch (err) {
    console.warn('Некорректный URL:', url);
    return 'invalid-url.webp';
  }
}

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url: url.trim(),
      responseType: 'stream',
      timeout: 10000,
    });

    const writer = fs.createWriteStream(filepath); // ✅ Теперь работает

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`❌ Не удалось скачать: ${url}`, err.message || err);
  }
}

async function main() {
  await ensureImagesDir();

  const rawData = await fsp.readFile(JSON_PATH, 'utf8');
  const sneakers = JSON.parse(rawData);

  for (const sneaker of sneakers) {
    console.log(`📥 Обработка: ${sneaker.title}`);
    const newImagePaths = [];

    for (const imageUrl of sneaker.image) {
      const filename = getFilenameFromUrl(imageUrl);
      const localPath = path.join(IMAGES_DIR, filename);
      const absolutePath = path.resolve(localPath);

      try {
        await fsp.access(absolutePath);
        console.log(`✅ Уже есть: ${filename}`);
      } catch {
        console.log(`⬇️ Скачиваем: ${filename}`);
        await downloadImage(imageUrl, absolutePath);
      }

      newImagePaths.push(`images/${filename}`);
    }

    sneaker.image = newImagePaths;
  }

  await fsp.writeFile(JSON_PATH, JSON.stringify(sneakers, null, 2), 'utf8');
  console.log('✅ Готово! JSON обновлён, изображения скачаны.');
}

main().catch(console.error);