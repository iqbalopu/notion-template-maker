# Automated Daily Template Generation

This feature automatically creates 10 well-researched Notion templates every day. The system includes:

- **30+ curated template topics** across multiple categories (Productivity, Business, Personal Development, Health & Wellness, Creative & Content, Finance, Travel, Education, Project Management)
- **Smart topic selection** that ensures variety and avoids duplicates
- **Template tracking** to prevent creating the same template twice
- **Automatic scheduling** support for daily runs

## Quick Start

### Manual Run

To manually generate 10 templates right now:

```bash
npm run auto-generate
```

Or with custom options:

```bash
npm run build
node dist/cli/index.js auto-generate --count 10
```

### Options

- `--count <number>` - Number of templates to create (default: 10)
- `--dry-run` - Generate templates but don't create them in Notion (useful for testing)
- `--force` - Create templates even if they were already created
- `--output-dir <dir>` - Directory to save generated YAML files (default: `templates/generated`)
- `--parent-page-id <id>` - Override the parent page ID for template creation

### Examples

```bash
# Generate 5 templates
node dist/cli/index.js auto-generate --count 5

# Dry run to see what would be created
node dist/cli/index.js auto-generate --dry-run

# Force creation even if templates exist
node dist/cli/index.js auto-generate --force

# Save templates to custom directory
node dist/cli/index.js auto-generate --output-dir my-templates
```

## Setting Up Daily Automation

### Windows (Task Scheduler)

1. Open PowerShell as Administrator
2. Navigate to the project directory
3. Run the setup script:

```powershell
.\scripts\schedule-daily.ps1
```

This creates a scheduled task that runs daily at 9:00 AM.

**Manual Setup:**
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to "Daily" at 9:00 AM
4. Set action to run: `node scripts/daily-generate.js`
5. Set working directory to your project folder

### Linux/Mac (Cron)

1. Make the script executable:

```bash
chmod +x scripts/schedule-daily.sh
chmod +x scripts/daily-generate.js
```

2. Run the setup script:

```bash
./scripts/schedule-daily.sh
```

This adds a cron job that runs daily at 9:00 AM.

**Manual Setup:**

Add this line to your crontab (`crontab -e`):

```
0 9 * * * cd /path/to/notion-template-maker && node scripts/daily-generate.js >> logs/daily-generate.log 2>&1
```

### Cloud/Server Options

#### GitHub Actions

Create `.github/workflows/daily-templates.yml`:

```yaml
name: Daily Template Generation

on:
  schedule:
    - cron: '0 9 * * *'  # 9 AM UTC daily
  workflow_dispatch:  # Allow manual trigger

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run auto-generate
        env:
          NOTION_API_TOKEN: ${{ secrets.NOTION_API_TOKEN }}
          NOTION_PARENT_PAGE_ID: ${{ secrets.NOTION_PARENT_PAGE_ID }}
```

#### Other Cloud Options

- **AWS Lambda** - Use EventBridge (CloudWatch Events) to trigger daily
- **Google Cloud Functions** - Use Cloud Scheduler
- **Azure Functions** - Use Timer Trigger
- **Heroku Scheduler** - Add-on for Heroku apps
- **Vercel Cron** - For Vercel deployments

## Template Categories

The system focuses on **Software Management** templates covering all aspects of managing software:

### 📊 Software Management (12 templates)
- Software Project Management Dashboard
- Software Release Management Plan
- Software Quality Management Dashboard
- Software Maintenance Schedule
- Software Operations Runbook
- Software Architecture Management
- Software Team Management
- Software Documentation Management
- Software Security Management
- Software Performance Management
- Software Change Management
- Software License Management
- Software Monitoring Dashboard

**Total: 13 curated templates** focused on comprehensive software management, operations, and lifecycle management.

## Template Tracking

The system tracks all created templates to prevent duplicates:

- **History File**: `.notion-template-maker/template-history.json`
- **Tracking**: Each template includes name, page ID, URL, creation date, and category
- **Duplicate Prevention**: Templates are filtered out if already created (unless using `--force`)

### Viewing History

The history is automatically maintained. You can check:

- Templates created today
- All templates ever created
- Templates by category

## Generated Files

When templates are generated:

1. **YAML Files**: Saved to `templates/generated/` (or custom directory)
2. **Notion Pages**: Created in your configured parent page
3. **History**: Tracked in `.notion-template-maker/template-history.json`

## Troubleshooting

### Templates Not Creating

- **Check Notion API Token**: Ensure `NOTION_API_TOKEN` is set correctly
- **Check Parent Page**: Verify `NOTION_PARENT_PAGE_ID` is set and the page is shared with your integration
- **Rate Limiting**: The script includes delays between requests, but if you hit limits, wait and retry

### Duplicate Templates

- The system prevents duplicates by default
- Use `--force` if you want to create duplicates
- Check history: `.notion-template-maker/template-history.json`

### Scheduling Issues

- **Windows**: Check Task Scheduler for errors
- **Linux/Mac**: Check cron logs: `grep CRON /var/log/syslog` (Linux) or check Console.app (Mac)
- **Logs**: Check `logs/daily-generate.log` for execution logs

### Dry Run Testing

Always test with `--dry-run` first:

```bash
node dist/cli/index.js auto-generate --dry-run --count 5
```

This shows what would be created without actually creating anything.

## Customization

### Adding New Topics

Edit `src/core/topic-researcher.ts` to add new template topics:

```typescript
{
  name: "Your Template Name",
  description: "Description of what this template is for",
  category: "Category Name",
  icon: "🎯",
  blocks: [
    { type: "heading_1", text: "Title" },
    { type: "paragraph", text: "Content" },
    // ... more blocks
  ],
}
```

### Changing Default Count

Modify the default in `src/cli/commands/auto-generate.ts`:

```typescript
.option('-c, --count <number>', 'Number of templates to create', '10')
```

### Custom Schedule Time

- **Windows**: Edit the time in `scripts/schedule-daily.ps1` (change `-At 9am`)
- **Linux/Mac**: Edit the cron expression in `scripts/schedule-daily.sh` (change `0 9`)

## Monitoring

### Check Today's Templates

The command shows a summary after running, including:
- Number of templates created
- URLs of created templates
- Total templates created (all time)
- Templates created today

### Logs

- **Windows**: Check Task Scheduler history
- **Linux/Mac**: Check `logs/daily-generate.log`
- **Manual runs**: Output is shown in console

## Best Practices

1. **Test First**: Always run with `--dry-run` before scheduling
2. **Monitor Initially**: Check the first few automated runs to ensure everything works
3. **Backup History**: The history file helps track what's been created
4. **Review Templates**: Periodically review created templates to ensure quality
5. **Adjust Schedule**: Run at a time when you can monitor (initially)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review logs for error messages
3. Test manually with `--dry-run` first
4. Verify Notion API credentials and permissions

