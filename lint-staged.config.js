module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // JSON files
  '*.json': [
    'prettier --write',
  ],
  
  // Markdown files
  '*.md': [
    'prettier --write',
  ],
  
  // CSS and SCSS files
  '*.{css,scss,sass}': [
    'prettier --write',
  ],
  
  // YAML files
  '*.{yml,yaml}': [
    'prettier --write',
  ],
  
  // HTML files
  '*.html': [
    'prettier --write',
  ],
  
  // Package.json - only format, don't lint
  'package.json': [
    'prettier --write',
  ],
  
  // Type check all TypeScript files
  '*.{ts,tsx}': () => 'npm run type-check',
};