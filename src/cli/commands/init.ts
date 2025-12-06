/**
 * Init command - initializes configuration
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { saveConfig } from '../../utils/config';

export function createInitCommand(): Command {
  const command = new Command('init')
    .description('Initialize Notion Template Maker configuration')
    .action(async () => {
      try {
        console.log(chalk.blue('🔧 Initializing Notion Template Maker...\n'));

        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'notionApiToken',
            message: 'Enter your Notion API token:',
            validate: (input: string) => {
              if (!input || input.trim().length === 0) {
                return 'Notion API token is required';
              }
              if (!input.startsWith('secret_') && !input.startsWith('ntn_')) {
                return 'Notion API token should start with "secret_" or "ntn_"';
              }
              return true;
            },
          },
          {
            type: 'input',
            name: 'parentPageId',
            message: 'Enter your default parent page ID (optional):',
            default: '',
          },
        ]);

        saveConfig({
          notionApiToken: answers.notionApiToken,
          parentPageId: answers.parentPageId || undefined,
        });

        console.log(chalk.green('\n✅ Configuration saved successfully!'));
        console.log(chalk.gray('   Configuration saved to: ~/.notion-template-maker.json'));
        console.log(chalk.gray('\n   You can also set NOTION_API_TOKEN environment variable instead.'));
      } catch (error: any) {
        console.error(chalk.red(`❌ Error: ${error.message}`));
        if (error.stack && process.env.DEBUG) {
          console.error(chalk.gray(error.stack));
        }
        process.exit(1);
      }
    });

  return command;
}

