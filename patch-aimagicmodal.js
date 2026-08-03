const fs = require('fs');
let code = fs.readFileSync('components/AIMagicModal.tsx', 'utf8');

// Add tone state
if (!code.includes('const [tone, setTone]')) {
  code = code.replace(
    "const [industry, setIndustry] = useState('E-Commerce');",
    "const [industry, setIndustry] = useState('E-Commerce');\n  const [tone, setTone] = useState('Professional');"
  );
}

// Add to fetch payload
const payloadTarget = `        body: JSON.stringify({
          prompt,
          clientName,
          serviceProvider,
          projectCost,
          timeline,
          industry
        }),`;
const payloadReplacement = `        body: JSON.stringify({
          prompt,
          clientName,
          serviceProvider,
          projectCost,
          timeline,
          industry,
          tone
        }),`;
if (code.includes(payloadTarget)) {
  code = code.replace(payloadTarget, payloadReplacement);
} else if (code.includes('industry\n        })')) {
  code = code.replace(
    'industry\n        }),',
    'industry,\n          tone\n        }),'
  );
}

// Add the Tone dropdown in the UI (Grid Fields section)
const gridTarget = `            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Target Timeline</label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                disabled={loading}
                placeholder="e.g. 6 Weeks"
                className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 focus:border-black dark:border-white/30 px-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
              />
            </div>
          </div>`;

const gridReplacement = `            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Target Timeline</label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                disabled={loading}
                placeholder="e.g. 6 Weeks"
                className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 focus:border-black dark:border-white/30 px-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Tone of Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                disabled={loading}
                className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 focus:border-black dark:border-white/30 px-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
              >
                <option value="Professional">Professional (Default)</option>
                <option value="Formal">Formal & Legal</option>
                <option value="Concise">Concise & Direct</option>
                <option value="Technical">Technical & Detailed</option>
                <option value="Persuasive">Persuasive & Sales-Oriented</option>
                <option value="Creative">Creative & Playful</option>
              </select>
            </div>
          </div>`;

if (code.includes('Target Timeline')) {
  code = code.replace(gridTarget, gridReplacement);
}

fs.writeFileSync('components/AIMagicModal.tsx', code);
console.log('Patched AIMagicModal.tsx');
