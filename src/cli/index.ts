#!/usr/bin/env node

/**
 * CLI entry point for Notion Template Maker
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { createCreateCommand } from './commands/create';
import { createDuplicateCommand } from './commands/duplicate';
import { createListCommand } from './commands/list';
import { createInitCommand } from './commands/init';
import { createGenerateCommand } from './commands/generate';
import { createAutoGenerateCommand } from './commands/auto-generate';

const program = new Command();

program
  .name('notion-template')
  .description('Automated Notion template maker - Create and manage Notion templates programmatically')
  .version('0.1.0');

// Add commands
program.addCommand(createInitCommand());
program.addCommand(createCreateCommand());
program.addCommand(createDuplicateCommand());
program.addCommand(createListCommand());
program.addCommand(createGenerateCommand());
program.addCommand(createAutoGenerateCommand());

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red(`Unknown command: ${program.args.join(' ')}`));
  console.log(chalk.gray('\nRun "notion-template --help" for usage information.'));
  process.exit(1);
});

// Parse arguments
program.parse();

