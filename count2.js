const fs = require('fs');
const code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const sIdx = code.indexOf('const sectionBlocks');
const before = code.substring(0, sIdx);
let o1 = 0, c1 = 0;
for(let c of before) { if(c==='{') o1++; if(c==='}') c1++; }
console.log('Before:', o1, c1);

const blocks = code.substring(sIdx, code.indexOf('export const DocumentView'));
let o2 = 0, c2 = 0;
for(let c of blocks) { if(c==='{') o2++; if(c==='}') c2++; }
console.log('Blocks:', o2, c2);

const after = code.substring(code.indexOf('export const DocumentView'));
let o3 = 0, c3 = 0;
for(let c of after) { if(c==='{') o3++; if(c==='}') c3++; }
console.log('After:', o3, c3);
