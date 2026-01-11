const fs = require('fs');
const path = require('path');

// Add shebang to the compiled index.js file and make it executable
const indexPath = path.join(__dirname, '..', 'packages', 'create-anvil-app', 'dist', 'index.js');
if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  if (!content.startsWith('#!/usr/bin/env node')) {
    fs.writeFileSync(indexPath, '#!/usr/bin/env node\n' + content);
  }
  // Make the file executable
  try {
    fs.chmodSync(indexPath, '755');
  } catch (error) {
    // chmod might fail on Windows, that's okay
  }
}
