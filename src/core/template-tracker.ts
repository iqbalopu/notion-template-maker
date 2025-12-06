/**
 * Template Tracker - Tracks created templates to prevent duplicates
 */

import * as fs from 'fs';
import * as path from 'path';

export interface CreatedTemplate {
  name: string;
  topicName: string;
  pageId: string;
  url?: string;
  createdAt: string;
  category: string;
}

interface TemplateHistory {
  templates: CreatedTemplate[];
  lastRunDate?: string;
}

const HISTORY_FILE = 'template-history.json';

/**
 * Get the path to the history file
 */
function getHistoryFilePath(): string {
  const configDir = path.join(process.cwd(), '.notion-template-maker');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  return path.join(configDir, HISTORY_FILE);
}

/**
 * Load template history
 */
export function loadTemplateHistory(): TemplateHistory {
  const filePath = getHistoryFilePath();
  
  if (!fs.existsSync(filePath)) {
    return { templates: [] };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn('Failed to load template history, starting fresh');
    return { templates: [] };
  }
}

/**
 * Save template history
 */
export function saveTemplateHistory(history: TemplateHistory): void {
  const filePath = getHistoryFilePath();
  fs.writeFileSync(filePath, JSON.stringify(history, null, 2), 'utf-8');
}

/**
 * Add a created template to history
 */
export function addTemplateToHistory(template: CreatedTemplate): void {
  const history = loadTemplateHistory();
  history.templates.push(template);
  history.lastRunDate = new Date().toISOString();
  saveTemplateHistory(history);
}

/**
 * Check if a template name has already been created
 */
export function isTemplateCreated(topicName: string): boolean {
  const history = loadTemplateHistory();
  return history.templates.some(t => t.topicName === topicName);
}

/**
 * Get all created templates
 */
export function getCreatedTemplates(): CreatedTemplate[] {
  const history = loadTemplateHistory();
  return history.templates;
}

/**
 * Get templates created today
 */
export function getTemplatesCreatedToday(): CreatedTemplate[] {
  const history = loadTemplateHistory();
  const today = new Date().toISOString().split('T')[0];
  
  return history.templates.filter(t => {
    const createdDate = new Date(t.createdAt).toISOString().split('T')[0];
    return createdDate === today;
  });
}

/**
 * Get templates created in the last N days
 */
export function getTemplatesCreatedInLastDays(days: number): CreatedTemplate[] {
  const history = loadTemplateHistory();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return history.templates.filter(t => {
    const createdDate = new Date(t.createdAt);
    return createdDate >= cutoffDate;
  });
}

/**
 * Filter out already created templates from a list of topics
 */
export function filterOutCreatedTemplates(topicNames: string[]): string[] {
  const history = loadTemplateHistory();
  const createdNames = new Set(history.templates.map(t => t.topicName));
  
  return topicNames.filter(name => !createdNames.has(name));
}

/**
 * Clear template history (use with caution)
 */
export function clearTemplateHistory(): void {
  const filePath = getHistoryFilePath();
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

