/**
 * Notion API client wrapper
 */

import { Client } from '@notionhq/client';
import { getNotionApiToken } from '../utils/config';

let notionClient: Client | null = null;

/**
 * Get or create Notion API client instance
 */
export function getNotionClient(): Client {
  if (!notionClient) {
    const token = getNotionApiToken();
    notionClient = new Client({
      auth: token,
    });
  }
  return notionClient;
}

/**
 * Create a new Notion client with a custom token
 */
export function createNotionClient(token: string): Client {
  return new Client({
    auth: token,
  });
}

/**
 * Reset the client instance (useful for testing)
 */
export function resetNotionClient(): void {
  notionClient = null;
}

