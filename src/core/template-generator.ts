/**
 * Template Generator - Converts topics to YAML template configurations
 */

import { TemplateTopic } from './topic-researcher';
import { TemplateConfig } from '../types/template';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate a template configuration from a topic
 */
export function generateTemplateFromTopic(topic: TemplateTopic): TemplateConfig {
  return {
    template: {
      name: topic.name,
      description: topic.description,
      page: {
        title: topic.name,
        icon: topic.icon,
      },
      blocks: topic.blocks.map(block => ({
        type: block.type,
        text: block.text || block.content,
        ...Object.fromEntries(
          Object.entries(block).filter(([key]) => 
            !['type', 'text', 'content'].includes(key)
          )
        ),
      })),
    },
  };
}

/**
 * Generate YAML string from template config
 */
export function generateTemplateYAML(config: TemplateConfig): string {
  return yaml.dump(config, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
  });
}

/**
 * Save template to file
 */
export function saveTemplateToFile(
  config: TemplateConfig,
  outputDir: string,
  filename?: string
): string {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate filename if not provided
  if (!filename) {
    const sanitizedName = config.template.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    filename = `${sanitizedName}.yml`;
  }

  const filePath = path.join(outputDir, filename);
  const yamlContent = generateTemplateYAML(config);

  fs.writeFileSync(filePath, yamlContent, 'utf-8');

  return filePath;
}

/**
 * Generate multiple templates from topics
 */
export function generateTemplatesFromTopics(
  topics: TemplateTopic[],
  outputDir: string = 'templates/generated'
): string[] {
  const filePaths: string[] = [];

  for (const topic of topics) {
    const config = generateTemplateFromTopic(topic);
    const filePath = saveTemplateToFile(config, outputDir);
    filePaths.push(filePath);
  }

  return filePaths;
}

