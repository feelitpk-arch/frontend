const https = require('https');
const fs = require('fs');
const path = require('path');

// Free perfume images from Unsplash (using direct URLs)
const images = [
  { url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80', file: 'products/noir-amber-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1595425970377-c97073c35b0a?w=800&q=80', file: 'products/noir-amber-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1594035910387-f4d8c39b1e38?w=800&q=80', file: 'products/celestial-musk-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80', file: 'products/celestial-musk-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80', file: 'products/desert-oud-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80', file: 'products/desert-oud-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80', file: 'products/linen-morning-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80', file: 'products/linen-morning-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80', file: 'products/rose-veiled-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80', file: 'products/rose-veiled-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80', file: 'products/midnight-atlas-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80', file: 'products/midnight-atlas-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80', file: 'products/atelier-explorer-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80', file: 'products/atelier-explorer-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80', file: 'products/amber-ink-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80', file: 'products/amber-ink-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&q=80', file: 'hero/hero-placeholder.jpg' },
];

function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, '..', 'public', 'images', filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(fullPath);
    
    https.get(url, { rejectUnauthorized: false }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filePath}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        downloadImage(response.headers.location, filePath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(fullPath);
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Starting image downloads...');
  for (const img of images) {
    try {
      await downloadImage(img.url, img.file);
    } catch (error) {
      console.error(`Error downloading ${img.file}:`, error.message);
    }
  }
  console.log('Download complete!');
}

downloadAll();

