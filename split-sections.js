const fs = require('fs');

let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

// Find the start of the sections
const startMarker = '{/* 1. PROJECT OVERVIEW */}';
const endMarker = '{/* 34. FINAL APPROVAL & SIGN-OFF */}';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

const beforeSections = code.substring(0, startIndex);
const sectionsContent = code.substring(startIndex, endIndex);
const afterSections = code.substring(endIndex);

// We need to split sectionsContent into individual sections.
// We can use the `{/* N.` or `{/* 23 - 32` comments as delimiters.

const sectionRegex = /\{\/\*\s*(?:[0-9]+(?:\s*-\s*[0-9]+)?\.*)[^*]*\*\/\}/g;

let match;
const delimiters = [];
while ((match = sectionRegex.exec(sectionsContent)) !== null) {
  delimiters.push({ text: match[0], index: match.index });
}

console.log(delimiters.map(d => d.text));
