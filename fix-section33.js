const fs = require('fs');
let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const faultyStr = `                </div>
              </section>
            </div>
          )
            </div>
          )</div>
    </React.Fragment>
  ),`;

const fixedStr = `                </div>
              </section>
            </div>
          )}
    </React.Fragment>
  ),`;

code = code.replace(faultyStr, fixedStr);
fs.writeFileSync('components/DocumentView.tsx', code);
console.log('Fixed section 33 syntax error');
