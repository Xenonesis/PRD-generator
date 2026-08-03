const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

const importTarget = "History,";
const importReplacement = "History,\n  Palette,";
if (!code.includes("Palette")) {
  code = code.replace(importTarget, importReplacement);
}

const propsTarget = "onOpenHistory: () => void;";
const propsReplacement = "onOpenHistory: () => void;\n  onOpenBranding: () => void;";
if (!code.includes("onOpenBranding: () => void;")) {
  code = code.replace(propsTarget, propsReplacement);
}

const destructTarget = "onOpenHistory,";
const destructReplacement = "onOpenHistory,\n  onOpenBranding,";
if (!code.includes("onOpenBranding,")) {
  code = code.replace(destructTarget, destructReplacement);
}

// Add the Branding button before the Save Draft button
const buttonTarget = `<button
            onClick={onSaveDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-black dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition"
            title="Save Draft to Browser"
          >`;

const buttonReplacement = `<button
            onClick={onOpenBranding}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-black dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition"
            title="Document Branding"
          >
            <Palette className="w-4 h-4" />
            <span className="hidden lg:inline font-bold text-xs">Branding</span>
          </button>
          
          <button
            onClick={onSaveDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-black dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition"
            title="Save Draft to Browser"
          >`;

if (!code.includes("onClick={onOpenBranding}")) {
  code = code.replace(buttonTarget, buttonReplacement);
}

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Updated Navbar with Branding');
