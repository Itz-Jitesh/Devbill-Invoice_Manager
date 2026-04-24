const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(directoryPath);

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace utility classes
  content = content.replace(/glass-card/g, 'surface-card');
  content = content.replace(/glass-panel/g, 'surface-card');
  content = content.replace(/text-shadow-glow/g, '');
  content = content.replace(/backdrop-blur(-\w+)?(\[.*?\])?/g, '');
  content = content.replace(/bg-white\/\[0\.02\]/g, 'bg-[var(--color-surface)]');
  content = content.replace(/bg-white\/\[0\.04\]/g, 'bg-[var(--color-surface-hover)]');
  content = content.replace(/bg-white\/5/g, 'bg-[var(--color-surface)]');
  content = content.replace(/border-white\/10/g, 'border-[var(--color-surface-border)]');
  content = content.replace(/border-white\/5/g, 'border-[var(--color-surface-border)]');
  content = content.replace(/bg-[#1a1f2f]/g, 'bg-[var(--color-surface)]');
  content = content.replace(/text-[#c7c4d8]/g, 'text-[var(--color-on-surface-variant)]');
  content = content.replace(/text-[#dee1f7]/g, 'text-[var(--color-on-surface)]');
  content = content.replace(/text-white/g, 'text-[var(--color-on-surface)]');
  content = content.replace(/animate-pulse/g, '');
  content = content.replace(/animate-in(\s+[a-z-]+-[a-z0-9-]+)?(\s+duration-\d+)?(\s+slide-in-[a-z0-9-]+)?(\s+zoom-in-\d+)?/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Cleaned:', file);
  }
});

console.log('Cleanup complete.');
