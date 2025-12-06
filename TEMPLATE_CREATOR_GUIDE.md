# Template Creator Guide - Create Templates to Sell

## Quick Start

### Interactive Template Generator

Use the `generate` command to create templates interactively:

```bash
npm run dev generate
```

This will guide you through:
1. Template name
2. Description
3. Icon emoji
4. Page title
5. Sections (headings, lists, todos, etc.)

### Example Workflow

```bash
# Start the generator
npm run dev generate

# Follow the prompts:
# Template name: Content Calendar
# Description: Plan and organize your content strategy
# Icon: 📅
# Default page title: {{month}} Content Calendar
# Add sections: Yes
#   Section 1: Content Ideas (Bullet List)
#   Section 2: Publishing Schedule (To-Do List)
#   Section 3: Analytics (Heading + Paragraph)
```

## Two Ways to Create Templates

### Method 1: Interactive Generator (Recommended for Beginners)

```bash
npm run dev generate
```

**Best for:**
- Quick template creation
- Learning the structure
- Creating simple templates

### Method 2: Describe to AI (Recommended for Complex Templates)

Just describe what you want, and I'll create the template file for you!

**Example:**
> "Create a habit tracker template with daily checkboxes, weekly review section, and monthly goals"

I'll create the YAML file for you.

## Template Types for Selling

### Popular Template Categories

1. **Productivity Templates**
   - Daily planner
   - Weekly review
   - Goal tracker
   - Habit tracker

2. **Business Templates**
   - Content calendar
   - Client onboarding
   - Project tracker
   - Meeting notes

3. **Personal Templates**
   - Meal planner
   - Budget tracker
   - Reading list
   - Travel planner

4. **Creative Templates**
   - Blog post planner
   - Social media calendar
   - Idea board
   - Portfolio tracker

## Creating Templates for Sale

### Step 1: Generate Template

```bash
npm run dev generate
```

### Step 2: Customize Template File

Edit the generated YAML file in `templates/` directory:

```yaml
template:
  name: "Your Template Name"
  description: "What it does and who it's for"
  page:
    title: "{{customizable}} Title"
    icon: "🎯"
  blocks:
    # Your content here
```

### Step 3: Test Template

```bash
npm run dev create templates/your-template.yml
```

### Step 4: Create in Notion

```bash
npm run dev create templates/your-template.yml \
  --variable customizable="Test Value"
```

### Step 5: Export for Sale

Once created in Notion, you can:
- Duplicate the page
- Export as template
- Share the template link

## Template Best Practices

### 1. Use Variables

Make templates customizable:

```yaml
page:
  title: "{{project_name}} - Project Plan"
```

### 2. Clear Structure

- Use headings to organize
- Add descriptions
- Include examples

### 3. Professional Icons

Choose appropriate emojis:
- 📋 Planning
- 📅 Calendar
- ✅ Tasks
- 💰 Finance
- 📊 Analytics

### 4. Complete Sections

Don't leave empty sections - add placeholder content:

```yaml
- type: "paragraph"
  text: "Add your notes here..."
```

## Quick Commands Reference

```bash
# Generate new template interactively
npm run dev generate

# Create template in Notion
npm run dev create templates/template-name.yml

# Duplicate existing template
npm run dev duplicate <page-id>

# List all templates
npm run dev list
```

## Example: Creating a "Daily Planner" Template

```bash
# 1. Generate
npm run dev generate

# 2. Enter details:
# Name: Daily Planner
# Description: Organize your day with tasks, priorities, and notes
# Icon: 📝
# Title: {{date}} - Daily Planner

# 3. Add sections:
# - Morning Routine (To-Do List)
# - Top 3 Priorities (Numbered List)
# - Tasks (To-Do List)
# - Notes (Paragraph)
# - Evening Review (Paragraph)

# 4. Template saved to: templates/daily-planner.yml

# 5. Test it:
npm run dev create templates/daily-planner.yml --variable date="2024-01-15"
```

## Need Help?

Just describe what template you want, and I'll create it for you! For example:

- "Create a weekly meal planning template"
- "Make a client onboarding checklist template"
- "Build a habit tracker with daily and weekly views"

I'll generate the YAML file ready to use!

