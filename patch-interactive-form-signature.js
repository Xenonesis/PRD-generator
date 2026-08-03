const fs = require('fs');
let code = fs.readFileSync('components/InteractiveForm.tsx', 'utf8');

if (!code.includes('SignatureCapture')) {
  code = code.replace(
    "import { AIQuickFill } from '@/components/AIQuickFill';",
    "import { AIQuickFill } from '@/components/AIQuickFill';\nimport { SignatureCapture } from '@/components/SignatureCapture';"
  );
}

const clientSignoffTarget = `                <div>
                  <label className="block text-[10px] text-black/50 dark:text-white/50 mb-1">Signature Date</label>
                  <input
                    type="text"
                    value={data.clientSignoff.signatureDate}
                    onChange={(e) => updateNestedField('clientSignoff', 'signatureDate', e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 p-2 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
                  />
                </div>`;

const clientSignoffReplacement = `                <div>
                  <label className="block text-[10px] text-black/50 dark:text-white/50 mb-1">Signature Date</label>
                  <input
                    type="text"
                    value={data.clientSignoff.signatureDate}
                    onChange={(e) => updateNestedField('clientSignoff', 'signatureDate', e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 p-2 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none mb-3"
                  />
                  <SignatureCapture 
                    label="Client" 
                    value={data.clientSignoff.signatureDataUrl} 
                    onChange={(val) => updateNestedField('clientSignoff', 'signatureDataUrl', val)} 
                  />
                </div>`;
                
const providerSignoffTarget = `                <div>
                  <label className="block text-[10px] text-black/50 dark:text-white/50 mb-1">Signature Date</label>
                  <input
                    type="text"
                    value={data.providerSignoff.signatureDate}
                    onChange={(e) => updateNestedField('providerSignoff', 'signatureDate', e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 p-2 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
                  />
                </div>`;

const providerSignoffReplacement = `                <div>
                  <label className="block text-[10px] text-black/50 dark:text-white/50 mb-1">Signature Date</label>
                  <input
                    type="text"
                    value={data.providerSignoff.signatureDate}
                    onChange={(e) => updateNestedField('providerSignoff', 'signatureDate', e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 p-2 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none mb-3"
                  />
                  <SignatureCapture 
                    label="Provider" 
                    value={data.providerSignoff.signatureDataUrl} 
                    onChange={(val) => updateNestedField('providerSignoff', 'signatureDataUrl', val)} 
                  />
                </div>`;

if (code.includes('value={data.clientSignoff.signatureDate}')) {
  code = code.replace(clientSignoffTarget, clientSignoffReplacement);
  code = code.replace(providerSignoffTarget, providerSignoffReplacement);
  fs.writeFileSync('components/InteractiveForm.tsx', code);
  console.log('Patched InteractiveForm with SignatureCapture');
}
