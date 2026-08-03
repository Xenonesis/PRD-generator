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
  
  let textBefore = sectionsContent.substring(currentIndex, sectionStart);
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
  
  blocks.push({
    comment: comment,
    prefix: prefix,
    code: rawCode,
    suffix: suffix
  });
  
  currentIndex = sectionEnd;
}

// Build sectionBlocks array
let sectionBlocksCode = 'const sectionBlocks = [\n';
blocks.forEach((b, idx) => {
  if (b.comment) {
     sectionBlocksCode += `  // ${b.comment.replace(/\n/g, ' ')}\n`;
  }
  sectionBlocksCode += `  (d: any, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (\n`;
  
  // Use index from mapped array, but we also pass the stable ID as 'index' parameter.
  let codeWithControls = b.code.replace('<CopySectionButton />', '<SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />');
  
  // Replace React.useState with React.useState since it's a function now, it can't use hooks directly unless it's a component.
  // Wait, these are render functions! `SectionControls` uses hooks, so it MUST be a real component.
  // We can just define SectionControls.
  
  // Wrap in a stable key fragment
  if (b.prefix) {
     let divCount = (b.prefix.match(/<div/g) || []).length;
     let closeDivs = '</div>\n'.repeat(divCount);
     sectionBlocksCode += `    <React.Fragment key="sec-${idx}">\n${b.prefix}${codeWithControls}${b.suffix}${closeDivs}    </React.Fragment>\n`;
  } else {
     sectionBlocksCode += `    <React.Fragment key="sec-${idx}">\n      ${codeWithControls}\n    </React.Fragment>\n`;
  }
  sectionBlocksCode += `  ),\n`;
});
sectionBlocksCode += '];\n\n';

// We need to inject SectionControls and state.

// 1. Add ArrowUp, ArrowDown to lucide-react imports
let newBeforeSections = beforeSections.replace('import { Copy, Check } from "lucide-react";', 'import { Copy, Check, ArrowUp, ArrowDown } from "lucide-react";');

// 2. Replace CopySectionButton with SectionControls
const copyBtnRegex = /const CopySectionButton = \(\) => \{[\s\S]*?\};\n/;
const sectionControlsCode = `
const SectionControls = ({ index, total, moveUp, moveDown }: { index: number, total: number, moveUp: (i: number) => void, moveDown: (i: number) => void }) => {
  const [copied, React_setCopied] = React.useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const section = btn.closest("section") || btn.closest(".section-container");
    if (section) {
      const clone = section.cloneNode(true) as HTMLElement;
      const btns = clone.querySelectorAll(".section-controls");
      btns.forEach((b) => b.remove());
      navigator.clipboard.writeText(clone.innerText.trim());
      React_setCopied(true);
      setTimeout(() => React_setCopied(false), 2000);
    }
  };
  return (
    <div className="section-controls no-print absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded z-10 flex flex-row items-center p-1 gap-1">
      <button onClick={() => moveUp(index)} className="p-1 hover:text-black dark:hover:text-white text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 rounded" title="Move Up">
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => moveDown(index)} className="p-1 hover:text-black dark:hover:text-white text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 rounded" title="Move Down">
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-3 bg-black/20 dark:bg-white/20 mx-0.5" />
      <button onClick={handleCopy} className="p-1 hover:text-black dark:hover:text-white text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 rounded" title="Copy Section">
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};
`;
newBeforeSections = newBeforeSections.replace(copyBtnRegex, sectionControlsCode);

// Add sectionBlocksCode before DocumentView
newBeforeSections = newBeforeSections.replace('export const DocumentView:', sectionBlocksCode + 'export const DocumentView:');

// 3. Inject state into DocumentView
const getPriorityBadgeRegex = /  const getPriorityBadge = \(p: string\) => \{/;
const stateInjection = `
  const [order, setOrder] = React.useState<number[]>(Array.from({ length: 31 }, (_, i) => i));
  const moveUp = (idx: number) => {
    setOrder(prev => {
      const newOrder = [...prev];
      const pos = newOrder.indexOf(idx);
      if (pos > 0) {
        [newOrder[pos - 1], newOrder[pos]] = [newOrder[pos], newOrder[pos - 1]];
      }
      return newOrder;
    });
  };
  const moveDown = (idx: number) => {
    setOrder(prev => {
      const newOrder = [...prev];
      const pos = newOrder.indexOf(idx);
      if (pos < newOrder.length - 1) {
        [newOrder[pos + 1], newOrder[pos]] = [newOrder[pos], newOrder[pos + 1]];
      }
      return newOrder;
    });
  };

  const getPriorityBadge = (p: string) => {`;
newBeforeSections = newBeforeSections.replace(getPriorityBadgeRegex, stateInjection);

// 4. Inject the mapped sections
const mappedSections = `
        {/* DYNAMIC SECTIONS REORDERING */}
        <div className="flex flex-col">
          {order.map(idx => sectionBlocks[idx](d, prdSectionClass, idx, moveUp, moveDown))}
        </div>
`;

let finalCode = newBeforeSections + mappedSections + '\n' + afterSections;

// wait! The original sections 23-32 were in `<div className="space-y-6 mb-8">`.
// By pulling them out, they lose `space-y-6` and `mb-8`. Let's add `mb-8` to their `<section>` if they don't have it.
// We can do that by replacing `<section className="relative group section-container">` with `<section className="mb-8 relative group section-container">`.

finalCode = finalCode.replace(/<section className="relative group section-container">/g, '<section className="mb-8 relative group section-container">');

fs.writeFileSync('components/DocumentView.tsx', finalCode);
console.log('DocumentView successfully rewritten.');
