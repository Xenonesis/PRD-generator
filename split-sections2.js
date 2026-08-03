const fs = require('fs');

let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const startMarker = '{/* 1. PROJECT OVERVIEW */}';
const endMarker = '{/* 34. FINAL APPROVAL & SIGN-OFF */}';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

const beforeSections = code.substring(0, startIndex);
const sectionsContent = code.substring(startIndex, endIndex);
const afterSections = code.substring(endIndex);

// Let's find all occurrences of `<section` and `</section>`
let blocks = [];
let currentIndex = 0;

while (true) {
  let sectionStart = sectionsContent.indexOf('<section', currentIndex);
  if (sectionStart === -1) break;
  
  // Backtrack to find if it's wrapped in something, like `d.additionalLegalClauses && (`
  // We'll just take from `{/*` to the `</section>`? No, that's too brittle.
  
  let sectionEnd = sectionsContent.indexOf('</section>', sectionStart);
  if (sectionEnd === -1) break;
  sectionEnd += 10;
  
  // Look for a condition wrap
  let textBefore = sectionsContent.substring(currentIndex, sectionStart);
  let isWrapped = textBefore.includes('&& (');
  
  if (isWrapped) {
     // Find the closing parenthesis for the wrap
     let closeParen = sectionsContent.indexOf(')', sectionEnd);
     if (closeParen !== -1) {
         sectionEnd = closeParen + 1;
     }
  }
  
  // Find the closest preceding `{/*` comment
  let commentStart = textBefore.lastIndexOf('{/*');
  let blockStart = sectionStart;
  if (commentStart !== -1) {
      blockStart = currentIndex + commentStart; // this is rough
  }
  
  // For the policy grid, we have `<div className="space-y-6 mb-8">` before the first policy section.
  
  blocks.push({
    start: sectionStart,
    end: sectionEnd
  });
  
  currentIndex = sectionEnd;
}

console.log('Found', blocks.length, 'section blocks');
