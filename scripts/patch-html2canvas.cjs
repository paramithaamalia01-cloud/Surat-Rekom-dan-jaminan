const fs = require('fs');
const path = require('path');

const filesToPatch = [
  path.join(__dirname, '../node_modules/html2canvas/dist/html2canvas.js'),
  path.join(__dirname, '../node_modules/html2canvas/dist/html2canvas.esm.js'),
  path.join(__dirname, '../node_modules/html2canvas/dist/html2canvas.min.js'),
];

filesToPatch.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // In unminified dist files:
  // if (typeof colorFunction === 'undefined') {
  //     throw new Error("Attempting to parse an unsupported color function \"" + value.name + "\"");
  // }
  const regexUnmin = /if\s*\(\s*typeof\s+colorFunction\s*===\s*['"]undefined['"]\s*\)\s*\{\s*throw\s+new\s+Error\([^)]*unsupported\s+color\s+function[^)]*\);\s*\}/g;
  if (regexUnmin.test(content)) {
    content = content.replace(
      regexUnmin,
      "if (typeof colorFunction === 'undefined') { return (15 << 24) | (23 << 16) | (42 << 8) | 255; }"
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched unminified: ${filePath}`);
  } else {
    // In minified files:
    // e.type===18&&(t=M[e.name],void 0===t)
    // or throw new Error("Attempting to parse an unsupported color function \""+e.name+"\"")
    const regexMin = /throw\s+new\s+Error\(['"][^'"]*unsupported\s+color\s+function[^'"]*['"]\s*\+\s*[^)]+\)/g;
    if (regexMin.test(content)) {
      content = content.replace(regexMin, "return ((15 << 24) | (23 << 16) | (42 << 8) | 255)");
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Patched minified: ${filePath}`);
    } else {
      console.log(`Already patched or pattern not found in: ${filePath}`);
    }
  }
});

console.log('html2canvas color patch execution complete.');
