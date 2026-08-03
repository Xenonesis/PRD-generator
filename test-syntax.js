const fs = require('fs');
const ts = require('typescript');

const code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const sourceFile = ts.createSourceFile(
  'DocumentView.tsx',
  code,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);

function traverse(node) {
  if (node.kind === ts.SyntaxKind.JsxElement || node.kind === ts.SyntaxKind.JsxFragment) {
    // maybe we can find the error
  }
  ts.forEachChild(node, traverse);
}
// Actually tsc already told us it's at the end of the file.
// Let's print out the exact parse diagnostics!
const diagnostics = sourceFile.parseDiagnostics;
if (diagnostics.length > 0) {
    diagnostics.forEach(d => {
       const pos = sourceFile.getLineAndCharacterOfPosition(d.start);
       console.log(`Error at ${pos.line + 1}:${pos.character + 1}: ${d.messageText}`);
    });
} else {
    console.log("No parse diagnostics");
}
