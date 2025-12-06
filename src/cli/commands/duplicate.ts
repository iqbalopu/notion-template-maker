/**
 * Duplicate command - duplicates an existing template
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { duplicateTemplate } from '../../core/template-builder';
import { getNotionClient } from '../../core/notion-client';

export function createDuplicateCommand(): Command {
  const command = new Command('duplicate')
    .alias('dup')
    .description('Duplicate an existing Notion template')
    .argument('<source-page-id>', 'Page ID of the template to duplicate')
    .option('-t, --title <title>', 'Title for the duplicated template')
    .option('-p, --parent-page-id <id>', 'Parent page ID where duplicate will be created')
    .action(async (sourcePageId: string, options: { title?: string; parentPageId?: string }) => {
      try {
        console.log(chalk.blue('📋 Duplicating Notion template...'));

        const newPageId = await duplicateTemplate(
          sourcePageId,
          options.title,
          options.parentPageId
        );

        // Get the created page URL
        const notion = getNotionClient();
        const page = await notion.pages.retrieve({ page_id: newPageId });
        const pageUrl = (page as any).url || `https://notion.so/${newPageId.replace(/-/g, '')}`;

        console.log(chalk.green('✅ Template duplicated successfully!'));
        console.log(chalk.cyan(`   New Page ID: ${newPageId}`));
        console.log(chalk.cyan(`   URL: ${pageUrl}`));
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

