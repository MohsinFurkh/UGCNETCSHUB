const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running vercel-build script...');
try {
  // Ensure we're in the correct directory
  process.chdir(path.join(__dirname));
  console.log('Current directory:', process.cwd());

  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build the app with environment variables
  console.log('Building app...');
  execSync('CI=false DISABLE_ESLINT_PLUGIN=true npm run build', { stdio: 'inherit' });

  // Verify build directory exists
  const buildDir = path.join(process.cwd(), 'build');
  if (!fs.existsSync(buildDir)) {
    throw new Error('Build directory not found!');
  }
  console.log('Build directory contents:', fs.readdirSync(buildDir));

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
