/**
 * Template builder - creates Notion pages from template configurations
 */

import { getNotionClient } from './notion-client';
import { TemplateConfig } from '../types/template';
import { createBlocks, processTemplateVariables } from './block-factory';
import { loadConfig } from '../utils/config';

export interface CreateTemplateOptions {
  parentPageId?: string;
  variables?: Record<string, string>;
}

/**
 * Create a Notion page from a template configuration
 */
export async function createTemplateFromConfig(
  config: TemplateConfig,
  options: CreateTemplateOptions = {}
): Promise<string> {
  const notion = getNotionClient();
  const { template } = config;

  // Process page title with variables
  const pageTitle = template.page?.title 
    ? processTemplateVariables(template.page.title, options.variables)
    : template.name;

  // Build page properties
  const pageProperties: any = {
    title: {
      title: [
        {
          type: 'text',
          text: {
            content: pageTitle,
          },
        },
      ],
    },
  };

  // Build page icon and cover
  const icon = template.page?.icon
    ? { type: 'emoji' as const, emoji: template.page.icon }
    : undefined;

  const cover = template.page?.cover
    ? { type: 'external' as const, external: { url: template.page.cover } }
    : undefined;

  // Create the page
  const appConfig = loadConfig();
  const parentPageId = options.parentPageId || process.env.NOTION_PARENT_PAGE_ID || appConfig.parentPageId;
  if (!parentPageId) {
    throw new Error(
      'Parent page ID is required. Set NOTION_PARENT_PAGE_ID environment variable, configure via init command, or provide --parent-page-id option'
    );
  }

  const createParams: any = {
    parent: {
      page_id: parentPageId,
    },
    properties: pageProperties,
  };

  if (icon) {
    createParams.icon = icon;
  }
  if (cover) {
    createParams.cover = cover;
  }

  const page = await notion.pages.create(createParams);

  const pageId = page.id;

  // Add blocks if defined
  if (template.blocks && template.blocks.length > 0) {
    const blocks = createBlocks(template.blocks);
    
    // Process blocks in batches (Notion API has limits)
    const batchSize = 100;
    for (let i = 0; i < blocks.length; i += batchSize) {
      const batch = blocks.slice(i, i + batchSize);
      await notion.blocks.children.append({
        block_id: pageId,
        children: batch,
      });
    }
  }

  return pageId;
}

/**
 * Duplicate an existing Notion page (template)
 */
export async function duplicateTemplate(
  sourcePageId: string,
  newTitle?: string,
  parentPageId?: string
): Promise<string> {
  const notion = getNotionClient();

  // Get the source page
  const sourcePage = await notion.pages.retrieve({ page_id: sourcePageId });

  // Get all blocks from source page
  const blocks: any[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: sourcePageId,
      start_cursor: cursor,
    });

    blocks.push(...response.results);
    cursor = response.next_cursor || undefined;
  } while (cursor);

  // Determine parent page ID
  const appConfig = loadConfig();
  const targetParentPageId = parentPageId || process.env.NOTION_PARENT_PAGE_ID || appConfig.parentPageId;
  if (!targetParentPageId) {
    throw new Error(
      'Parent page ID is required. Set NOTION_PARENT_PAGE_ID environment variable, configure via init command, or provide --parent-page-id option'
    );
  }

  // Extract title from source page
  const sourcePageAny = sourcePage as any;
  const titleProperty = sourcePageAny.properties && 'title' in sourcePageAny.properties
    ? sourcePageAny.properties.title 
    : null;

  let pageTitle = newTitle;
  if (!pageTitle && titleProperty && 'title' in titleProperty) {
    const titleArray = titleProperty.title;
    pageTitle = titleArray.length > 0 
      ? titleArray[0].plain_text 
      : 'Untitled';
  }
  pageTitle = pageTitle || 'Untitled';

  // Create new page
  const newPage = await notion.pages.create({
    parent: {
      page_id: targetParentPageId,
    },
    properties: {
      title: {
        title: [
          {
            type: 'text',
            text: {
              content: pageTitle,
            },
          },
        ],
      },
    },
  });

  const newPageId = newPage.id;

  // Copy blocks to new page
  if (blocks.length > 0) {
    // Convert retrieved blocks to block requests
    const blockRequests = blocks.map(block => {
      // Remove read-only fields
      const { id, created_time, created_by, last_edited_time, last_edited_by, ...blockRequest } = block as any;
      return blockRequest;
    });

    // Process blocks in batches
    const batchSize = 100;
    for (let i = 0; i < blockRequests.length; i += batchSize) {
      const batch = blockRequests.slice(i, i + batchSize);
      await notion.blocks.children.append({
        block_id: newPageId,
        children: batch as any,
      });
    }
  }

  return newPageId;
}

/**
 * List templates (pages) in a parent page
 */
export async function listTemplates(parentPageId?: string): Promise<any[]> {
  const notion = getNotionClient();

  const appConfig = loadConfig();
  const targetParentPageId = parentPageId || process.env.NOTION_PARENT_PAGE_ID || appConfig.parentPageId;
  if (!targetParentPageId) {
    throw new Error(
      'Parent page ID is required. Set NOTION_PARENT_PAGE_ID environment variable, configure via init command, or provide --parent-page-id option'
    );
  }

  // Get child pages
  const pages: any[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: targetParentPageId,
      start_cursor: cursor,
    });

    // Filter for page blocks
    const pageBlocks = response.results.filter(
      (block: any) => block.type === 'child_page'
    );

    // Get full page details
    for (const block of pageBlocks) {
      const pageId = block.id;
      const page = await notion.pages.retrieve({ page_id: pageId });
      pages.push(page);
    }

    cursor = response.next_cursor || undefined;
  } while (cursor);

  return pages;
}

