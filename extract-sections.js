const fs = require('fs');

const code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const sections = [];
let currentIndex = 0;

while (true) {
  const startIndex = code.indexOf('<section', currentIndex);
  if (startIndex === -1) break;
  
  const classArea = code.substring(startIndex, startIndex + 200);
  
  if (classArea.includes('section-container')) {
    const closeIndex = code.indexOf('</section>', startIndex);
    if (closeIndex !== -1) {
      const sectionCode = code.substring(startIndex, closeIndex + 10);
      sections.push({ start: startIndex, end: closeIndex + 10, code: sectionCode });
      currentIndex = closeIndex + 10;
      continue;
    }
  }
  
  currentIndex = startIndex + 8;
}

console.log('Found', sections.length, 'sections');
