# Notion Template Maker

Automated Notion template maker - Create and manage Notion templates programmatically using YAML/JSON configuration files.

## 🚀 Features

- ✅ Create Notion templates from YAML/JSON configuration files
- ✅ Duplicate existing templates
- ✅ List available templates
- ✅ Support for all major Notion block types
- ✅ Template variables for dynamic content
- ✅ Simple CLI interface
- ✅ TypeScript for type safety

## 📋 Prerequisites

- Node.js 16+ installed
- A Notion workspace
- A Notion integration token ([Get one here](https://www.notion.so/my-integrations))

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd notion-template-maker

# Install dependencies
npm install

# Build the project
npm run build
```

## ⚙️ Setup

### 1. Create a Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Template Maker")
4. Select your workspace
5. Copy the "Internal Integration Token" (starts with `secret_`)

### 2. Share a Page with Your Integration

1. Create or open a page in Notion where you want to store templates
2. Click the "..." menu in the top right
3. Select "Add connections"
4. Search for and add your integration
5. Copy the page ID from the URL (the part after the last `/`)

### 3. Configure the Tool

Run the init command:

```bash
npm run dev init
```

Or set environment variables:

```bash
export NOTION_API_TOKEN="secret_your_token_here"
export NOTION_PARENT_PAGE_ID="your-page-id-here"
```

## 📖 Usage

### Initialize Configuration

```bash
notion-template init
```

This will prompt you for your Notion API token and optional parent page ID.

### Create a Template from Config File

```bash
notion-template create templates/project-plan.yml
```

With template variables:

```bash
notion-template create templates/project-plan.yml \
  --variable project_name="My Project" \
  --variable date="2024-01-15"
```

With custom parent page:

```bash
notion-template create templates/project-plan.yml \
  --parent-page-id your-page-id-here
```

### Duplicate an Existing Template

```bash
notion-template duplicate <source-page-id>
```

With custom title:

```bash
notion-template duplicate <source-page-id> --title "New Template Name"
```

### List Available Templates

```bash
notion-template list
```

With custom parent page:

```bash
notion-template list --parent-page-id your-page-id-here
```

## 📝 Template File Format

Templates are defined in YAML or JSON format. Here's an example:

```yaml
template:
  name: "Project Plan Template"
  description: "A comprehensive project planning template"

  page:
    title: "{{project_name}} - Project Plan"
    icon: "📋"
    cover: "https://example.com/cover.jpg"  # Optional

  blocks:
    - type: "heading_1"
      text: "Project Overview"

    - type: "paragraph"
      text: "Brief description of the project."

    - type: "heading_2"
      text: "Goals"

    - type: "bulleted_list_item"
      text: "Goal 1"

    - type: "bulleted_list_item"
      text: "Goal 2"

    - type: "heading_2"
      text: "Tasks"

    - type: "to_do"
      text: "Task 1"
      checked: false
```

### Supported Block Types

- `heading_1`, `heading_2`, `heading_3` - Headings
- `paragraph` - Paragraph text
- `bulleted_list_item` - Bullet points
- `numbered_list_item` - Numbered lists
- `to_do` - Checkboxes
- `toggle` - Toggle blocks
- `quote` - Quote blocks
- `callout` - Callout blocks
- `divider` - Dividers
- `code` - Code blocks

### Template Variables

Use `{{variable_name}}` in your template text, then provide values when creating:

```bash
notion-template create template.yml --variable variable_name="Value"
```

## 📁 Project Structure

```
notion-template-maker/
├── src/
│   ├── cli/              # CLI commands
│   │   ├── commands/     # Individual commands
│   │   └── index.ts      # CLI entry point
│   ├── core/             # Core logic
│   │   ├── notion-client.ts
│   │   ├── template-parser.ts
│   │   ├── template-builder.ts
│   │   └── block-factory.ts
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
├── templates/            # Example templates
├── package.json
└── README.md
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode
npm run dev <command>

# Watch for changes
npm run watch
```

## 🧪 Testing

```bash
npm test
```

## 📚 Example Templates

Check out the `templates/` directory for example templates:

- `project-plan.yml` - Project planning template
- `meeting-notes.yml` - Meeting notes template
- `task-tracker.yml` - Task tracking template

## 🐛 Troubleshooting

### "Notion API token not found"
Make sure you've set the `NOTION_API_TOKEN` environment variable or run `notion-template init`.

### "Parent page ID is required"
Set the `NOTION_PARENT_PAGE_ID` environment variable or use the `--parent-page-id` option.

### "Page not found" or Permission errors
Make sure you've shared the parent page with your Notion integration.

### Rate limiting
The Notion API has rate limits. The tool handles this automatically with retries, but if you hit limits frequently, consider spacing out your requests.

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📖 Documentation

- [Notion API Documentation](https://developers.notion.com)
- [Planning Documents](./PLAN.md)
- [Architecture Overview](./ARCHITECTURE.md)

## 🎯 Roadmap

- [ ] Support for database templates
- [ ] More block types (tables, embeds, etc.)
- [ ] Template validation improvements
- [ ] Web interface for visual template builder
- [ ] Template marketplace
- [ ] Batch operations

