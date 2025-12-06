/**
 * Template type definitions
 */

export interface TemplateConfig {
  template: {
    name: string;
    description?: string;
    page?: PageConfig;
    properties?: PropertyConfig[];
    blocks?: BlockConfig[];
  };
}

export interface PageConfig {
  title: string;
  icon?: string;
  cover?: string;
}

export interface PropertyConfig {
  name: string;
  type: 'title' | 'rich_text' | 'number' | 'select' | 'multi_select' | 'date' | 'people' | 'files' | 'checkbox' | 'url' | 'email' | 'phone_number' | 'formula' | 'relation' | 'rollup' | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by';
  options?: string[];
  default?: string | number | boolean;
}

export interface BlockConfig {
  type: string;
  text?: string;
  content?: string;
  children?: BlockConfig[];
  [key: string]: any;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  url: string;
  createdTime: string;
  lastEditedTime: string;
}

