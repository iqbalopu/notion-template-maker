/**
 * Auto-generate command - Automatically creates templates daily
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { getRandomTopics } from '../../core/topic-researcher';
import { generateTemplateFromTopic, generateTemplatesFromTopics } from '../../core/template-generator';
import { createTemplateFromConfig } from '../../core/template-builder';
import { getNotionClient } from '../../core/notion-client';
import { 
  addTemplateToHistory, 
  filterOutCreatedTemplates,
  getTemplatesCreatedToday,
  getCreatedTemplates 
} from '../../core/template-tracker';

export function createAutoGenerateCommand(): Command {
  const command = new Command('auto-generate')
    .description('Automatically generate and create 10 well-researched Notion templates')
    .option('-c, --count <number>', 'Number of templates to create', '10')
    .option('-d, --dry-run', 'Generate templates but do not create in Notion', false)
    .option('-f, --force', 'Create templates even if they were already created', false)
    .option('-o, --output-dir <dir>', 'Directory to save generated YAML files', 'templates/generated')
    .option('-p, --parent-page-id <id>', 'Parent page ID where templates will be created')
    .action(async (options: { 
      count: string; 
      dryRun: boolean; 
      force: boolean;
      outputDir: string;
      parentPageId?: string;
    }) => {
      try {
        const count = parseInt(options.count, 10);
        if (isNaN(count) || count < 1) {
          console.error(chalk.red('❌ Count must be a positive number'));
          process.exit(1);
        }

        console.log(chalk.blue(`🚀 Starting automatic template generation...`));
        console.log(chalk.gray(`   Target: ${count} templates`));
        console.log(chalk.gray(`   Mode: ${options.dryRun ? 'DRY RUN (no Notion creation)' : 'LIVE'}`));

        // Check today's creations
        const todayTemplates = getTemplatesCreatedToday();
        if (todayTemplates.length > 0 && !options.force) {
          console.log(chalk.yellow(`⚠️  ${todayTemplates.length} templates already created today`));
          console.log(chalk.gray('   Use --force to create anyway'));
        }

        // Get random topics
        console.log(chalk.gray('\n📚 Researching topics...'));
        let topics = getRandomTopics(count * 2); // Get more than needed to filter
        
        // Filter out already created if not forcing
        if (!options.force) {
          const topicNames = topics.map(t => t.name);
          const filteredNames = filterOutCreatedTemplates(topicNames);
          topics = topics.filter(t => filteredNames.includes(t.name));
          
          if (topics.length < count) {
            console.log(chalk.yellow(`⚠️  Only ${topics.length} unique topics available (requested ${count})`));
            console.log(chalk.gray('   Some topics may have already been created'));
          }
        }

        // Take only the requested count
        topics = topics.slice(0, count);

        if (topics.length === 0) {
          console.error(chalk.red('❌ No topics available to create'));
          process.exit(1);
        }

        console.log(chalk.green(`✅ Selected ${topics.length} topics:`));
        topics.forEach((topic, index) => {
          console.log(chalk.cyan(`   ${index + 1}. ${topic.icon} ${topic.name} (${topic.category})`));
        });

        // Generate template configs
        console.log(chalk.gray('\n🔨 Generating template configurations...'));
        const configs = topics.map(topic => generateTemplateFromTopic(topic));

        // Save YAML files
        console.log(chalk.gray(`\n💾 Saving templates to ${options.outputDir}...`));
        const filePaths = generateTemplatesFromTopics(topics, options.outputDir);
        filePaths.forEach((filePath, index) => {
          console.log(chalk.gray(`   ${index + 1}. ${filePath}`));
        });

        if (options.dryRun) {
          console.log(chalk.yellow('\n⚠️  DRY RUN MODE - Templates not created in Notion'));
          console.log(chalk.gray('   Remove --dry-run to create templates'));
          return;
        }

        // Create templates in Notion
        console.log(chalk.gray('\n📝 Creating templates in Notion...'));
        const notion = getNotionClient();
        const results: Array<{ name: string; pageId: string; url: string; success: boolean; error?: string }> = [];

        for (let i = 0; i < configs.length; i++) {
          const config = configs[i];
          const topic = topics[i];
          
          try {
            console.log(chalk.gray(`   Creating ${i + 1}/${configs.length}: ${topic.name}...`));
            
            const pageId = await createTemplateFromConfig(config, {
              parentPageId: options.parentPageId,
            });

            // Get page URL
            const page = await notion.pages.retrieve({ page_id: pageId });
            const pageUrl = (page as any).url || `https://notion.so/${pageId.replace(/-/g, '')}`;

            // Add to history
            addTemplateToHistory({
              name: config.template.name,
              topicName: topic.name,
              pageId,
              url: pageUrl,
              createdAt: new Date().toISOString(),
              category: topic.category,
            });

            results.push({
              name: topic.name,
              pageId,
              url: pageUrl,
              success: true,
            });

            console.log(chalk.green(`   ✅ Created: ${topic.name}`));
            console.log(chalk.gray(`      URL: ${pageUrl}`));

            // Rate limiting: wait a bit between requests
            if (i < configs.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          } catch (error: any) {
            console.error(chalk.red(`   ❌ Failed: ${topic.name}`));
            console.error(chalk.gray(`      Error: ${error.message}`));
            
            results.push({
              name: topic.name,
              pageId: '',
              url: '',
              success: false,
              error: error.message,
            });
          }
        }

        // Summary
        console.log(chalk.blue('\n📊 Summary:'));
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        console.log(chalk.green(`   ✅ Successfully created: ${successful}`));
        if (failed > 0) {
          console.log(chalk.red(`   ❌ Failed: ${failed}`));
        }

        if (successful > 0) {
          console.log(chalk.cyan('\n📋 Created Templates:'));
          results.filter(r => r.success).forEach((result, index) => {
            console.log(chalk.cyan(`   ${index + 1}. ${result.name}`));
            console.log(chalk.gray(`      ${result.url}`));
          });
        }

        // Show history stats
        const allCreated = getCreatedTemplates();
        console.log(chalk.blue(`\n📈 Total templates created: ${allCreated.length}`));
        console.log(chalk.gray(`   Today: ${getTemplatesCreatedToday().length}`));

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

