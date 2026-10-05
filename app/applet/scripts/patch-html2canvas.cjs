const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../node_modules/html2canvas/dist');

const filesToPatch = [
  path.join(targetDir, 'html2canvas.js'),
  path.join(targetDir, 'html2canvas.esm.js'),
  path.join(targetDir, 'html2canvas.min.js'),
];

filesToPatch.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`[patch-html2canvas] File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Match unminified:
  const regexUnmin = /if\s*\(\s*typeof\s+colorFunction\s*===\s*['"]undefined['"]\s*\)\s*\{\s*throw\s+new\s+Error\([^)]*unsupported\s+color\s+function[^)]*\);\s*\}/g;
  if (regexUnmin.test(content)) {
    content = content.replace(
      regexUnmin,
      "if (typeof colorFunction === 'undefined') { return (15 << 24) | (23 << 16) | (42 << 8) | 255; }"
    );
  }

  // Match minified & general regex:
  const regexMin = /throw\s+new\s+Error\(['"]Attempting\s+to\s+parse\s+an?\s+unsupported\s+color\s+function\s*[^)]+\)/g;
  if (regexMin.test(content)) {
    content = content.replace(regexMin, "return ((15 << 24) | (23 << 16) | (42 << 8) | 255)");
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[patch-html2canvas] Successfully verified/patched: ${path.basename(filePath)}`);
});

console.log('[patch-html2canvas] Patching complete.');
