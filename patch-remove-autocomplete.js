const fs = require('fs');
let code = fs.readFileSync('components/InteractiveForm.tsx', 'utf8');

const regexFunc = /  const handleAutoComplete = async \([\s\S]*?\} finally \{\n      setAutocompletingField\(null\);\n    \}\n  };\n/;
code = code.replace(regexFunc, '');

const regexState = /  const \[autocompletingField, setAutocompletingField\] = useState<string \| null>\(null\);\n/;
code = code.replace(regexState, '');

const regexObjButton = /                  <button\n                    type="button"\n                    onClick=\{\(\) => handleAutoComplete\('projectObjectives'\)\}\n                    disabled=\{autocompletingField === 'projectObjectives'\}\n                    className="flex items-center space-x-1 bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-0\.5 text-\[9px\] uppercase font-bold tracking-wider transition-colors disabled:opacity-50"\n                  >\n                    \{autocompletingField === 'projectObjectives' \? <Loader2 className="w-3 h-3 animate-spin" \/> : <Sparkles className="w-3 h-3 text-amber-600" \/>\}\n                    <span>Auto-Complete<\/span>\n                  <\/button>/;

const replacementObj = `<AIQuickFill field="projectObjectives" schemaDescription="Array of strings" data={data} onUpdate={(val) => updateField('projectObjectives', val)} title="Project Objectives" />`;

code = code.replace(regexObjButton, replacementObj);

const regexTechButton = /                  <button\n                    type="button"\n                    onClick=\{\(\) => handleAutoComplete\('techStack'\)\}\n                    disabled=\{autocompletingField === 'techStack'\}\n                    className="flex items-center space-x-1 bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-0\.5 text-\[9px\] uppercase font-bold tracking-wider transition-colors disabled:opacity-50"\n                  >\n                    \{autocompletingField === 'techStack' \? <Loader2 className="w-3 h-3 animate-spin" \/> : <Sparkles className="w-3 h-3 text-amber-600" \/>\}\n                    <span>Auto-Complete<\/span>\n                  <\/button>/;

code = code.replace(regexTechButton, '');

fs.writeFileSync('components/InteractiveForm.tsx', code);
console.log('Removed handleAutoComplete');
