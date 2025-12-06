/**
 * List command - lists available templates
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { listTemplates } from '../../core/template-builder';

export function createListCommand(): Command {
  const command = new Command('list')
    .alias('ls')
    .description('List available Notion templates')
    .option('-p, --parent-page-id <id>', 'Parent page ID to list templates from')
    .action(async (options: { parentPageId?: string }) => {
      try {
        console.log(chalk.blue('📚 Listing Notion templates...'));

        const pages = await listTemplates(options.parentPageId);

        if (pages.length === 0) {
          console.log(chalk.yellow('No templates found.'));
          return;
        }

        console.log(chalk.green(`\nFound ${pages.length} template(s):\n`));

        pages.forEach((page: any, index: number) => {
          const titleProperty = 'title' in page.properties ? page.properties.title : null;
          const title = titleProperty && 'title' in titleProperty && titleProperty.title.length > 0
            ? titleProperty.title[0].plain_text
            : 'Untitled';

          const pageUrl = page.url || `https://notion.so/${page.id.replace(/-/g, '')}`;
          const createdDate = new Date(page.created_time).toLocaleDateString();

          console.log(chalk.cyan(`${index + 1}. ${title}`));
          console.log(chalk.gray(`   ID: ${page.id}`));
          console.log(chalk.gray(`   Created: ${createdDate}`));
          console.log(chalk.gray(`   URL: ${pageUrl}`));
          console.log('');
        });
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

