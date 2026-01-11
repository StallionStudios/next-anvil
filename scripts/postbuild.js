const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Add shebang to the compiled anvil.js file
const anvilPath = path.join(__dirname, '..', 'dist', 'bin', 'anvil.js');
if (fs.existsSync(anvilPath)) {
  const content = fs.readFileSync(anvilPath, 'utf8');
  if (!content.startsWith('#!/usr/bin/env node')) {
    fs.writeFileSync(anvilPath, '#!/usr/bin/env node\n' + content);
    // Make the file executable
    fs.chmodSync(anvilPath, '755');
  }
}

// Compile CSS using PostCSS
console.log('Compiling CSS...');
try {
  const cssPath = path.join(__dirname, '..', 'src', 'styles.css');
  const outputPath = path.join(__dirname, '..', 'dist', 'styles.css');
  
  // Ensure dist directory exists
  const distDir = path.dirname(outputPath);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Use postcss-cli to compile CSS (reads .postcssrc.json automatically)
  execSync(
    `npx postcss "${cssPath}" -o "${outputPath}"`,
    { stdio: 'inherit', cwd: path.join(__dirname, '..') }
  );
  
  console.log('CSS compiled successfully to dist/styles.css');
} catch (error) {
  console.error('Error compiling CSS:', error.message);
  process.exit(1);
}
