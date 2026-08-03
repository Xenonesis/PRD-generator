const fs = require('fs');

let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const startMarker = '{/* 1. PROJECT OVERVIEW */}';
const endMarker = '{/* 34. FINAL APPROVAL & SIGN-OFF */}';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

const sectionsContent = code.substring(startIndex, endIndex);

const sectionRegex = /\{\/\*\s*(?:[0-9]+(?:\s*-\s*[0-9]+)?\.*)[^*]*\*\/\}/g;

let match;
const delimiters = [];
while ((match = sectionRegex.exec(sectionsContent)) !== null) {
  delimiters.push({ text: match[0], index: match.index });
}

for (let i = 0; i < delimiters.length; i++) {
   const start = delimiters[i].index;
   const end = i < delimiters.length - 1 ? delimiters[i+1].index : sectionsContent.length;
   const content = sectionsContent.substring(start, end);
   const sectionCount = (content.match(/<section/g) || []).length;
   console.log(delimiters[i].text, '=>', sectionCount, 'sections');
}

