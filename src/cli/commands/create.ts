/**
 * Create command - creates a template from a config file
 */

import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { parseTemplateFile } from '../../core/template-parser';
import { createTemplateFromConfig } from '../../core/template-builder';
import { getNotionClient } from '../../core/notion-client';

export function createCreateCommand(): Command {
  const command = new Command('create')
    .description('Create a new Notion template from a configuration file')
    .argument('<template-file>', 'Path to template YAML or JSON file')
    .option('-p, --parent-page-id <id>', 'Parent page ID where template will be created')
    .option('-v, --variable <key=value>', 'Template variables (can be used multiple times)', (value, prev: Record<string, string>) => {
      const [key, val] = value.split('=');
      if (!key || !val) {
        throw new Error(`Invalid variable format: ${value}. Use key=value`);
      }
      return { ...prev, [key]: val };
    }, {})
    .action(async (templateFile: string, options: { parentPageId?: string; variable?: Record<string, string> }) => {
      try {
        console.log(chalk.blue('📝 Creating Notion template...'));

        // Resolve template file path
        const templatePath = path.resolve(templateFile);
        if (!fs.existsSync(templatePath)) {
          console.error(chalk.red(`❌ Template file not found: ${templatePath}`));
          process.exit(1);
        }

        // Parse template file
        console.log(chalk.gray(`Parsing template: ${templatePath}`));
        const config = parseTemplateFile(templatePath);

        // Create template
        const pageId = await createTemplateFromConfig(config, {
          parentPageId: options.parentPageId,
          variables: options.variable,
        });

        // Get the created page URL
        const notion = getNotionClient();
        const page = await notion.pages.retrieve({ page_id: pageId });
        const pageUrl = (page as any).url || `https://notion.so/${pageId.replace(/-/g, '')}`;

        console.log(chalk.green('✅ Template created successfully!'));
        console.log(chalk.cyan(`   Page ID: ${pageId}`));
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

