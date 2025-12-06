/**
 * Block factory - creates Notion block objects from template definitions
 */

import { BlockConfig } from '../types/template';
import type { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints';

/**
 * Convert template block config to Notion block request
 */
export function createBlock(blockConfig: BlockConfig): BlockObjectRequest {
  const { type, text, content, children, ...rest } = blockConfig;

  // Use text or content field for block text
  const blockText = text || content || '';

  // Create rich text array
  const richText = blockText ? [
    {
      type: 'text' as const,
      text: {
        content: blockText,
      },
    },
  ] : [];

  // Map template block types to Notion block types
  switch (type) {
    case 'heading_1':
      return {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: richText,
        },
      };

    case 'heading_2':
      return {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: richText,
        },
      };

    case 'heading_3':
      return {
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: richText,
        },
      };

    case 'paragraph':
      return {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: richText,
        },
      };

    case 'bulleted_list_item':
      return {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: richText,
        },
      };

    case 'numbered_list_item':
      return {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: richText,
        },
      };

    case 'to_do':
      return {
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: richText,
          checked: rest.checked || false,
        },
      };

    case 'toggle':
      return {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: richText,
        },
      };

    case 'quote':
      return {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: richText,
        },
      };

    case 'callout':
      return {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: richText,
          icon: rest.icon ? { type: 'emoji', emoji: rest.icon } : undefined,
        },
      };

    case 'divider':
      return {
        object: 'block',
        type: 'divider',
        divider: {},
      };

    case 'code':
      return {
        object: 'block',
        type: 'code',
        code: {
          rich_text: richText,
          language: rest.language || 'plain text',
        },
      };

    default:
      // Default to paragraph for unknown types
      return {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: richText,
        },
      };
  }
}

/**
 * Create multiple blocks from template config
 */
export function createBlocks(blockConfigs: BlockConfig[]): BlockObjectRequest[] {
  return blockConfigs.map(createBlock);
}

/**
 * Process template variables in text (e.g., {{variable}})
 */
export function processTemplateVariables(text: string, variables: Record<string, string> = {}): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match;
  });
}

