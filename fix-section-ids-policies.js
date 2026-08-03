const fs = require('fs');
let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const mapping = {
  '23': '23. HOSTING',
  '24': '24. INTELLECTUAL PROPERTY',
  '25': '25. CONFIDENTIALITY',
  '27': '27. DATA',
  '28': '28. PROJECT DELAYS',
  '30': '30. LIMITATIONS',
  '31': '31. OUT-OF-SCOPE',
  '32': '32. FINAL HANDOVER',
};

for (const [id, text] of Object.entries(mapping)) {
  const regex = new RegExp(`(<section\\s)className="mb-8 relative group section-container">\\s*(?:{/\\* COPY_BTN \\*/})\\s*<SectionControls[^>]+>\\s*<h2[^>]+>\\s*${id}\\.`, 'g');
  code = code.replace(regex, `$1id="section-${id}" className="mb-8 relative group section-container">\n            {/* COPY_BTN */}\n            $2<h2`);
}
// wait, matching <SectionControls>... to keep it simple, I'll just match <h2...> 23. and replace the nearest <section> backwards.
