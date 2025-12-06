/**
 * Configuration management utilities
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface Config {
  notionApiToken?: string;
  parentPageId?: string;
}

const CONFIG_FILE_NAME = '.notion-template-maker.json';
const CONFIG_PATH = path.join(os.homedir(), CONFIG_FILE_NAME);

/**
 * Load configuration from file or environment variables
 */
export function loadConfig(): Config {
  const config: Config = {};

  // Try to load from environment variables first
  config.notionApiToken = process.env.NOTION_API_TOKEN;
  config.parentPageId = process.env.NOTION_PARENT_PAGE_ID;

  // Try to load from config file
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const fileConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      config.notionApiToken = config.notionApiToken || fileConfig.notionApiToken;
      config.parentPageId = config.parentPageId || fileConfig.parentPageId;
    } catch (error) {
      console.warn('Failed to read config file:', error);
    }
  }

  return config;
}

/**
 * Save configuration to file
 */
export function saveConfig(config: Config): void {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to save config: ${error}`);
  }
}

/**
 * Get Notion API token, throwing if not found
 */
export function getNotionApiToken(): string {
  const config = loadConfig();
  const token = config.notionApiToken;

  if (!token) {
    throw new Error(
      'Notion API token not found. Please set NOTION_API_TOKEN environment variable or run "notion-template init"'
    );
  }

  return token;
}

