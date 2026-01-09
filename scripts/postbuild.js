const fs = require('fs');
const path = require('path');

// Add shebang to the compiled anvil.js file
const anvilPath = path.join(__dirname, '..', 'dist', 'bin', 'anvil.js');
const content = fs.readFileSync(anvilPath, 'utf8');

if (!content.startsWith('#!/usr/bin/env node')) {
  fs.writeFileSync(anvilPath, '#!/usr/bin/env node\n' + content);
  // Make the file executable
  fs.chmodSync(anvilPath, '755');
}

