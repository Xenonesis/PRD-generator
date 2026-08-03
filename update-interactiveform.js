const fs = require('fs');

let code = fs.readFileSync('components/InteractiveForm.tsx', 'utf8');

const targetStr = `
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-black dark:border-white/10">`;

const fieldsToAdd = `
            {/* Cover Page Configurations */}
            <div className="pt-4 border-t border-black dark:border-white/10 mt-6">
              <h3 className="text-xs font-bold uppercase mb-4 text-black/80 dark:text-white/80">Cover Page Customization</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Cover Badge</label>
                  <input
                    type="text"
                    value={data.coverBadge || ''}
                    placeholder="Confidential & Proprietary"
                    onChange={(e) => updateField('coverBadge', e.target.value)}
                    className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 p-2 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Document Type</label>
                  <input
                    type="text"
                    value={data.coverDocumentType || ''}
                    placeholder="Product Requirement Specification & Development Agreement"
                    onChange={(e) => updateField('coverDocumentType', e.target.value)}
                    className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 p-2 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Cover Subtitle</label>
                  <input
                    type="text"
                    value={data.coverSubtitle || ''}
                    placeholder="— Official Project Specification —"
                    onChange={(e) => updateField('coverSubtitle', e.target.value)}
                    className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 p-2 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Cover Description</label>
                  <textarea
                    value={data.coverDescription || ''}
                    placeholder="Comprehensive Technical Architecture..."
                    onChange={(e) => updateField('coverDescription', e.target.value)}
                    rows={2}
                    className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 p-2 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none resize-y min-h-[60px]"
                  />
                </div>
              </div>
            </div>`;

code = code.replace(targetStr, fieldsToAdd + targetStr);

fs.writeFileSync('components/InteractiveForm.tsx', code);
console.log('Updated InteractiveForm');
