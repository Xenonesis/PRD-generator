const fs = require('fs');

let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const startMarker = '{/* 1. PROJECT OVERVIEW */}';
const endMarker = '{/* 34. FINAL APPROVAL & SIGN-OFF */}';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

const beforeSections = code.substring(0, startIndex);
const sectionsContent = code.substring(startIndex, endIndex);
const afterSections = code.substring(endIndex);

let blocks = [];
let currentIndex = 0;

while (true) {
  let sectionStart = sectionsContent.indexOf('<section', currentIndex);
  if (sectionStart === -1) break;
  
  let sectionEnd = sectionsContent.indexOf('</section>', sectionStart);
  if (sectionEnd === -1) break;
  sectionEnd += 10;
  
  // Backtrack to find the comment
  let textBefore = sectionsContent.substring(currentIndex, sectionStart);
  
  // Find condition wrap
  let isWrapped = textBefore.includes('&& (');
  let prefix = '';
  let suffix = '';
  
  let commentMatch = textBefore.match(/\{\/\*[\s\S]*?\*\/\}/g);
  let comment = commentMatch ? commentMatch[commentMatch.length - 1] : '';
  
  if (isWrapped) {
     let wrapStart = textBefore.lastIndexOf('{d.additionalLegalClauses &&');
     if (wrapStart !== -1) {
         prefix = textBefore.substring(wrapStart);
         
         let closeParen = sectionsContent.indexOf(')', sectionEnd);
         if (closeParen !== -1) {
             suffix = sectionsContent.substring(sectionEnd, closeParen + 1);
             sectionEnd = closeParen + 1;
         }
     }
  }
  
  const rawCode = sectionsContent.substring(sectionStart, sectionEnd);
  
  // Add Move Up / Move Down buttons to CopySectionButton
  // Wait, we need to pass props to CopySectionButton or modify it.
  // Actually, we can just replace `<CopySectionButton />` with `<SectionControls index={idx} moveUp={moveUp} moveDown={moveDown} />`
  // We'll do that in another pass.
  
  blocks.push({
    comment: comment,
    prefix: prefix,
    code: rawCode,
    suffix: suffix
  });
  
  currentIndex = sectionEnd;
}

// Generate the sectionBlocks array
let sectionBlocksCode = 'const sectionBlocks = [\n';
blocks.forEach((b, idx) => {
  sectionBlocksCode += `  // ${b.comment.replace(/\n/g, ' ')}\n`;
  sectionBlocksCode += `  (d: any, prdSectionClass: string, index: number, moveUp: () => void, moveDown: () => void) => (\n`;
  let codeWithControls = b.code.replace('<CopySectionButton />', '<SectionControls index={index} total={sectionBlocks.length} moveUp={moveUp} moveDown={moveDown} />');
  
  if (b.prefix) {
     // Check if prefix has extra divs we need to close
     // e.g., `    {d.additionalLegalClauses &&\n      Object.values(d.additionalLegalClauses).some(Boolean) && (\n        <div className="pdf-page-break-before space-y-6 pt-6">\n          `
     let divCount = (b.prefix.match(/<div/g) || []).length;
     let closeDivs = '</div>\n'.repeat(divCount);
     sectionBlocksCode += `${b.prefix}${codeWithControls}${b.suffix}${closeDivs}\n`;
  } else {
     sectionBlocksCode += `    ${codeWithControls}\n`;
  }
  sectionBlocksCode += `  ),\n`;
});
sectionBlocksCode += '];\n';

fs.writeFileSync('sections-test.tsx', sectionBlocksCode);
console.log('Wrote to sections-test.tsx, extracted', blocks.length, 'blocks');
