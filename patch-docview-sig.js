const fs = require('fs');
let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const clientTarget = `<p>
                  <span className="font-bold text-black/60 dark:text-white/60 uppercase text-[9px] block">
                    Signature
                  </span>{" "}
                  __________________________
                </p>
                <p>
                  <span className="font-bold text-black/60 dark:text-white/60 uppercase text-[9px] block">
                    Date
                  </span>{" "}
                  {d.clientSignoff.signatureDate ||
                    "______________________________"}
                </p>`;
                
const clientReplacement = `<p>
                  <span className="font-bold text-black/60 dark:text-white/60 uppercase text-[9px] block mb-2">
                    Signature
                  </span>
                  {d.clientSignoff.signatureDataUrl ? (
                    <img src={d.clientSignoff.signatureDataUrl} alt="Client Signature" className="h-16 object-contain" />
                  ) : (
                    "__________________________"
                  )}
                </p>
                <p>
                  <span className="font-bold text-black/60 dark:text-white/60 uppercase text-[9px] block">
                    Date
                  </span>{" "}
                  {d.clientSignoff.signatureDate ||
                    "______________________________"}
                </p>`;
                
const providerTarget = `<p>
                  <span className="font-bold text-black/60 dark:text-white/60 uppercase text-[9px] block">
                    Signature
                  </span>{" "}
                  __________________________
                </p>
                <p>
                  <span className="font-bold text-black/60 dark:text-white/60 uppercase text-[9px] block">
                    Date
                  </span>{" "}
                  {d.providerSignoff.signatureDate ||
                    "______________________________"}
                </p>`;

const providerReplacement = `<p>
                  <span className="font-bold text-black/60 dark:text-white/60 uppercase text-[9px] block mb-2">
                    Signature
                  </span>
                  {d.providerSignoff.signatureDataUrl ? (
                    <img src={d.providerSignoff.signatureDataUrl} alt="Provider Signature" className="h-16 object-contain" />
                  ) : (
                    "__________________________"
                  )}
                </p>
                <p>
                  <span className="font-bold text-black/60 dark:text-white/60 uppercase text-[9px] block">
                    Date
                  </span>{" "}
                  {d.providerSignoff.signatureDate ||
                    "______________________________"}
                </p>`;

code = code.replace(clientTarget, clientReplacement);
code = code.replace(providerTarget, providerReplacement);

fs.writeFileSync('components/DocumentView.tsx', code);
console.log('Patched DocumentView.tsx for signatures');
