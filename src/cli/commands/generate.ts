/**
 * Generate command - interactively creates a new template
 */

import { Command } from 'commander';
import * as inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { TemplateConfig } from '../../types/template';

export function createGenerateCommand(): Command {
  const command = new Command('generate')
    .alias('gen')
    .description('Interactively generate a new Notion template')
    .option('-o, --output <dir>', 'Output directory for template files', 'templates')
    .action(async (options: { output?: string }) => {
      try {
        console.log(chalk.blue('🎨 Notion Template Generator\n'));
        console.log(chalk.gray('Let\'s create a professional template you can sell!\n'));

        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Template name:',
            validate: (input: string) => {
              if (!input || input.trim().length === 0) {
                return 'Template name is required';
              }
              return true;
            },
          },
          {
            type: 'input',
            name: 'description',
            message: 'Template description:',
            default: '',
          },
          {
            type: 'input',
            name: 'icon',
            message: 'Icon emoji (optional):',
            default: '📋',
          },
          {
            type: 'input',
            name: 'title',
            message: 'Default page title (use {{variable}} for placeholders):',
            default: (answers: any) => `${answers.name} Template`,
          },
          {
            type: 'confirm',
            name: 'addSections',
            message: 'Would you like to add custom sections?',
            default: true,
          },
        ]);

        const sections: Array<{ name: string; type: string; items: string[] }> = [];

        if (answers.addSections) {
          let addMore = true;
          while (addMore) {
            const sectionAnswers = await inquirer.prompt([
              {
                type: 'input',
                name: 'sectionName',
                message: 'Section name (or "done" to finish):',
                validate: (input: string) => {
                  if (!input || input.trim().length === 0) {
                    return 'Section name is required';
                  }
                  return true;
                },
              },
              {
                type: 'list',
                name: 'sectionType',
                message: 'Section type:',
                choices: [
                  { name: 'Heading + Paragraph', value: 'heading_para' },
                  { name: 'Heading + Bullet List', value: 'heading_bullets' },
                  { name: 'Heading + Numbered List', value: 'heading_numbered' },
                  { name: 'Heading + To-Do List', value: 'heading_todos' },
                  { name: 'Heading + Toggle List', value: 'heading_toggles' },
                  { name: 'Just Heading', value: 'heading_only' },
                ],
                when: (answers: any) => answers.sectionName.toLowerCase() !== 'done',
              },
            ]);

            if (sectionAnswers.sectionName.toLowerCase() === 'done') {
              addMore = false;
              break;
            }

            let items: string[] = [];
            if (sectionAnswers.sectionType !== 'heading_only') {
              const itemAnswers = await inquirer.prompt([
                {
                  type: 'input',
                  name: 'items',
                  message: 'Enter items (comma-separated, or press Enter for defaults):',
                  default: '',
                },
              ]);

              if (itemAnswers.items) {
                items = itemAnswers.items.split(',').map((item: string) => item.trim());
              } else {
                // Default items based on type
                if (sectionAnswers.sectionType === 'heading_para') {
                  items = ['Description text here...'];
                } else {
                  items = ['Item 1', 'Item 2', 'Item 3'];
                }
              }
            }

            sections.push({
              name: sectionAnswers.sectionName,
              type: sectionAnswers.sectionType,
              items,
            });

            const continueAnswer = await inquirer.prompt([
              {
                type: 'confirm',
                name: 'continue',
                message: 'Add another section?',
                default: true,
              },
            ]);

            addMore = continueAnswer.continue;
          }
        }

        // Build template config
        const blocks: any[] = [];

        // Add default intro section if no sections
        if (sections.length === 0) {
          blocks.push(
            { type: 'heading_1', text: 'Overview' },
            { type: 'paragraph', text: 'Brief description of this template and how to use it.' }
          );
        }

        // Add sections
        sections.forEach((section, index) => {
          const headingLevel = index === 0 ? 'heading_1' : 'heading_2';
          
          blocks.push({ type: headingLevel, text: section.name });

          switch (section.type) {
            case 'heading_para':
              if (section.items.length > 0) {
                blocks.push({ type: 'paragraph', text: section.items[0] });
              }
              break;

            case 'heading_bullets':
              section.items.forEach((item) => {
                blocks.push({ type: 'bulleted_list_item', text: item });
              });
              break;

            case 'heading_numbered':
              section.items.forEach((item) => {
                blocks.push({ type: 'numbered_list_item', text: item });
              });
              break;

            case 'heading_todos':
              section.items.forEach((item) => {
                blocks.push({ type: 'to_do', text: item, checked: false });
              });
              break;

            case 'heading_toggles':
              section.items.forEach((item) => {
                blocks.push({ type: 'toggle', text: item });
              });
              break;

            case 'heading_only':
              // Just the heading, no content
              break;
          }
        });

        // Create template config
        const templateConfig: TemplateConfig = {
          template: {
            name: answers.name,
            description: answers.description || undefined,
            page: {
              title: answers.title,
              icon: answers.icon || undefined,
            },
            blocks,
          },
        };

        // Generate filename
        const filename = answers.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') + '.yml';

        const outputDir = path.resolve(options.output || 'templates');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const filePath = path.join(outputDir, filename);

        // Convert to YAML
        const yamlContent = convertToYAML(templateConfig);

        // Save file
        fs.writeFileSync(filePath, yamlContent, 'utf-8');

        console.log(chalk.green('\n✅ Template created successfully!'));
        console.log(chalk.cyan(`   File: ${filePath}`));
        console.log(chalk.gray('\n   You can now:'));
        console.log(chalk.gray(`   1. Edit the template: ${filePath}`));
        console.log(chalk.gray(`   2. Create it in Notion: npm run dev create ${filePath}`));
        console.log(chalk.gray(`   3. Customize it further before selling`));
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

/**
 * Convert template config to YAML string
 */
function convertToYAML(config: TemplateConfig): string {
  const lines: string[] = ['template:'];
  
  lines.push(`  name: "${escapeYAML(config.template.name)}"`);
  
  if (config.template.description) {
    lines.push(`  description: "${escapeYAML(config.template.description)}"`);
  }
  
  if (config.template.page) {
    lines.push('  page:');
    lines.push(`    title: "${escapeYAML(config.template.page.title)}"`);
    if (config.template.page.icon) {
      lines.push(`    icon: "${config.template.page.icon}"`);
    }
    if (config.template.page.cover) {
      lines.push(`    cover: "${config.template.page.cover}"`);
    }
  }
  
  if (config.template.blocks && config.template.blocks.length > 0) {
    lines.push('  blocks:');
    config.template.blocks.forEach((block) => {
      lines.push('    - type: "' + block.type + '"');
      if (block.text) {
        lines.push(`      text: "${escapeYAML(block.text)}"`);
      }
      if (block.content) {
        lines.push(`      content: "${escapeYAML(block.content)}"`);
      }
      if ('checked' in block && block.checked !== undefined) {
        lines.push(`      checked: ${block.checked}`);
      }
    });
  }
  
  return lines.join('\n');
}

function escapeYAML(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

