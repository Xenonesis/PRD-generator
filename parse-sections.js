const fs = require('fs');
const code = fs.readFileSync('components/DocumentView.tsx', 'utf8');
const blocks = code.split('  (d: PRDData').slice(1);
blocks.forEach((block, idx) => {
  const match = block.match(/<h2.*?>(.*?)<\/h2>/s);
  if (match) {
    const title = match[1].replace(/<[^>]*>?/gm, '').trim();
    const numMatch = title.match(/^(\d+)\./);
    const num = numMatch ? numMatch[1] : 'Unknown';
    console.log(`idx ${idx} -> Section ${num}`);
  }
});
