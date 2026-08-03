const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

if (!code.includes('onOpenTranslate')) {
  // Add to interface
  code = code.replace(
    'onOpenAIMagic: () => void;',
    'onOpenAIMagic: () => void;\n  onOpenTranslate: () => void;'
  );

  // Add to destructuring
  code = code.replace(
    'onOpenAIMagic,\n  onSelectTemplate,',
    'onOpenAIMagic,\n  onOpenTranslate,\n  onSelectTemplate,'
  );

  // If the above destructuring replace didn't work (might be single line)
  if (!code.includes('onOpenTranslate,') && code.includes('onOpenAIMagic, onSelectTemplate,')) {
    code = code.replace(
      'onOpenAIMagic, onSelectTemplate,',
      'onOpenAIMagic, onOpenTranslate, onSelectTemplate,'
    );
  } else if (!code.includes('onOpenTranslate,')) {
     // fallback
     code = code.replace('onOpenAIMagic,', 'onOpenAIMagic, onOpenTranslate,');
  }

  // Add the button right before AI Generator button
  const aiGenBtn = `            {/* AI Generator Button */}
            <button
              onClick={onOpenAIMagic}`;
              
  const translateBtn = `            {/* Translate Button */}
            <button
              onClick={onOpenTranslate}
              className="flex items-center space-x-1 sm:space-x-1.5 bg-[#F4F1EE] dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] px-2.5 sm:px-3.5 py-1.5 text-[10px] uppercase font-bold tracking-wider transition active:scale-95"
              title="Translate Document"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Translate</span>
            </button>

`;
  code = code.replace(aiGenBtn, translateBtn + aiGenBtn);
  
  // Add Languages icon to lucide-react import
  if (!code.includes('Languages,')) {
    code = code.replace('Sparkles, ', 'Sparkles, Languages, ');
  }

  fs.writeFileSync('components/Navbar.tsx', code);
  console.log('Patched Navbar.tsx');
}
