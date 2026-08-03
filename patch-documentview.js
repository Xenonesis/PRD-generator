const fs = require('fs');
let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const filterCode = `
  const getSectionIdForIdx = (idx: number) => {
    if (idx <= 24) return idx + 1;
    if (idx === 25) return 27;
    if (idx === 26) return 28;
    if (idx === 27) return 30;
    if (idx === 28) return 31;
    if (idx === 29) return 32;
    return -1;
  };
`;

if (!code.includes('getSectionIdForIdx')) {
  // Insert the helper function right before `const [order`
  code = code.replace(
    '  const [order, setOrder] = React.useState<number[]>(Array.from({ length: 31 }, (_, i) => i));',
    filterCode + '\n  const [order, setOrder] = React.useState<number[]>(Array.from({ length: 31 }, (_, i) => i));'
  );
  
  // Replace the rendering of order
  code = code.replace(
    '{order.map(idx => sectionBlocks[idx](d, prdSectionClass, idx, moveUp, moveDown))}',
    '{order.filter(idx => !d.hiddenSections?.includes(getSectionIdForIdx(idx))).map(idx => sectionBlocks[idx](d, prdSectionClass, idx, moveUp, moveDown))}'
  );
  
  // Also wrap the final signoff section
  const targetSignoff = '<section className="pt-6 border-t-2 border-black dark:border-white/30 pdf-page-break-before relative group section-container">';
  const signoffReplacement = `
        {!d.hiddenSections?.includes(33) && (
        <section id="section-33" className="pt-6 border-t-2 border-black dark:border-white/30 pdf-page-break-before relative group section-container">
  `.trim();
  code = code.replace(targetSignoff, signoffReplacement);
  
  // And close it properly. 
  // It ends with <SignatureCapture ... /> \n </div> \n </section>
  const targetSignoffEnd = '</section>\n      </div>\n    </div>\n  );\n};';
  const signoffEndReplacement = '</section>\n        )}\n      </div>\n    </div>\n  );\n};';
  code = code.replace(targetSignoffEnd, signoffEndReplacement);
  
  fs.writeFileSync('components/DocumentView.tsx', code);
  console.log('Patched DocumentView.tsx');
}
