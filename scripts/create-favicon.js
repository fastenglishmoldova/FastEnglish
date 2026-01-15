// Script pentru a crea un favicon rotund din logo-ul Bravito
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createRoundFavicon() {
  const rootDir = path.join(__dirname, '..');
  const inputPath = path.join(rootDir, 'public', 'bravito.png');
  const outputPath = path.join(rootDir, 'public', 'favicon.png');
  const output32 = path.join(rootDir, 'public', 'favicon-32.png');
  const output16 = path.join(rootDir, 'public', 'favicon-16.png');
  const outputApple = path.join(rootDir, 'public', 'apple-icon.png');
  
  // Citește imaginea și obține dimensiunile
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  // Folosește dimensiunea minimă pentru a face un pătrat
  const size = Math.min(metadata.width, metadata.height);
  
  // Creează un mask circular SVG
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/>
    </svg>`
  );
  
  // Procesează imaginea pentru 180x180 (Apple Touch Icon)
  await sharp(inputPath)
    .resize(180, 180, { fit: 'cover' })
    .composite([{
      input: Buffer.from(
        `<svg width="180" height="180">
          <circle cx="90" cy="90" r="90" fill="white"/>
        </svg>`
      ),
      blend: 'dest-in'
    }])
    .png()
    .toFile(outputApple);
  
  console.log('✅ Created apple-icon.png (180x180)');
  
  // Favicon principal (32x32)
  await sharp(inputPath)
    .resize(32, 32, { fit: 'cover' })
    .composite([{
      input: Buffer.from(
        `<svg width="32" height="32">
          <circle cx="16" cy="16" r="16" fill="white"/>
        </svg>`
      ),
      blend: 'dest-in'
    }])
    .png()
    .toFile(output32);
  
  console.log('✅ Created favicon-32.png');
  
  // Favicon mic (16x16)
  await sharp(inputPath)
    .resize(16, 16, { fit: 'cover' })
    .composite([{
      input: Buffer.from(
        `<svg width="16" height="16">
          <circle cx="8" cy="8" r="8" fill="white"/>
        </svg>`
      ),
      blend: 'dest-in'
    }])
    .png()
    .toFile(output16);
  
  console.log('✅ Created favicon-16.png');
  
  // Copie principală
  await sharp(inputPath)
    .resize(64, 64, { fit: 'cover' })
    .composite([{
      input: Buffer.from(
        `<svg width="64" height="64">
          <circle cx="32" cy="32" r="32" fill="white"/>
        </svg>`
      ),
      blend: 'dest-in'
    }])
    .png()
    .toFile(outputPath);
  
  console.log('✅ Created favicon.png (64x64)');
  
  console.log('\n🎉 Toate favicon-urile au fost create cu succes!');
}

createRoundFavicon().catch(console.error);
