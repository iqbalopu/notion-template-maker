#!/usr/bin/env node

/**
 * Daily Template Generator Script
 * 
 * This script can be run daily via cron (Linux/Mac) or Task Scheduler (Windows)
 * to automatically create 10 Notion templates every day.
 * 
 * Usage:
 *   node scripts/daily-generate.js
 * 
 * To schedule daily runs:
 *   - Linux/Mac: Add to crontab: 0 9 * * * cd /path/to/project && node scripts/daily-generate.js
 *   - Windows: Use Task Scheduler to run this script daily
 */

const { execSync } = require('child_process');
const path = require('path');

// Change to project directory
process.chdir(path.join(__dirname, '..'));

console.log('🚀 Starting daily template generation...');
console.log(`📅 Date: ${new Date().toISOString()}`);
console.log('');

try {
  // Run the auto-generate command
  execSync('npm run build', { stdio: 'inherit' });
  execSync('node dist/cli/index.js auto-generate --count 10', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });
  
  console.log('');
  console.log('✅ Daily template generation completed successfully!');
} catch (error) {
  console.error('');
  console.error('❌ Daily template generation failed!');
  console.error(error.message);
  process.exit(1);
}

