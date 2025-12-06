/**
 * Template parser - converts YAML/JSON config to internal structure
 */

import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { TemplateConfig } from '../types/template';
import { z } from 'zod';

// Zod schema for validation
const BlockConfigSchema: z.ZodType<any> = z.object({
  type: z.string(),
  text: z.string().optional(),
  content: z.string().optional(),
  children: z.lazy(() => z.array(BlockConfigSchema)).optional(),
}).passthrough();

const PropertyConfigSchema = z.object({
  name: z.string(),
  type: z.enum([
    'title', 'rich_text', 'number', 'select', 'multi_select', 'date',
    'people', 'files', 'checkbox', 'url', 'email', 'phone_number',
    'formula', 'relation', 'rollup', 'created_time', 'created_by',
    'last_edited_time', 'last_edited_by'
  ]),
  options: z.array(z.string()).optional(),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

const PageConfigSchema = z.object({
  title: z.string(),
  icon: z.string().optional(),
  cover: z.string().optional(),
});

const TemplateConfigSchema = z.object({
  template: z.object({
    name: z.string(),
    description: z.string().optional(),
    page: PageConfigSchema.optional(),
    properties: z.array(PropertyConfigSchema).optional(),
    blocks: z.array(BlockConfigSchema).optional(),
  }),
});

/**
 * Parse template file (YAML or JSON)
 */
export function parseTemplateFile(filePath: string): TemplateConfig {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Template file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();

  let parsed: any;

  try {
    if (ext === '.yaml' || ext === '.yml') {
      parsed = yaml.load(content);
    } else if (ext === '.json') {
      parsed = JSON.parse(content);
    } else {
      throw new Error(`Unsupported file format: ${ext}. Use .yaml, .yml, or .json`);
    }
  } catch (error) {
    throw new Error(`Failed to parse template file: ${error}`);
  }

  // Validate using Zod schema
  const validationResult = TemplateConfigSchema.safeParse(parsed);
  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(e => 
      `${e.path.join('.')}: ${e.message}`
    ).join('\n');
    throw new Error(`Template validation failed:\n${errors}`);
  }

  return validationResult.data;
}

/**
 * Parse template from string content
 */
export function parseTemplate(content: string, format: 'yaml' | 'json' = 'yaml'): TemplateConfig {
  let parsed: any;

  try {
    if (format === 'yaml') {
      parsed = yaml.load(content);
    } else {
      parsed = JSON.parse(content);
    }
  } catch (error) {
    throw new Error(`Failed to parse template: ${error}`);
  }

  const validationResult = TemplateConfigSchema.safeParse(parsed);
  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(e => 
      `${e.path.join('.')}: ${e.message}`
    ).join('\n');
    throw new Error(`Template validation failed:\n${errors}`);
  }

  return validationResult.data;
}

