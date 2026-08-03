const fs = require('fs');

let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const startIndex = code.indexOf('const SectionControls = ');
const endIndex = code.indexOf('const sectionBlocks = ');

const oldSectionControls = code.substring(startIndex, endIndex);

const sectionControlsCode = `const SectionControls = ({ index, total, moveUp, moveDown }: { index: number, total: number, moveUp: (i: number) => void, moveDown: (i: number) => void }) => {
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

code = code.replace(oldSectionControls, sectionControlsCode);
fs.writeFileSync('components/DocumentView.tsx', code);
console.log('Fixed SectionControls');
