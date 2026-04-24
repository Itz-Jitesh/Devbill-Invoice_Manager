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

  // Replace blur utilities
  content = content.replace(/blur-\[\d+px\]/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Cleaned blur:', file);
  }
});

console.log('Blur cleanup complete.');
