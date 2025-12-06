# Quick Template Creation Guide

## 🚀 Two Ways to Create Templates

### Method 1: Interactive Generator (Easiest)

```bash
npm run dev generate
```

Just follow the prompts! Perfect for creating templates quickly.

### Method 2: Tell Me What You Want

Just describe your template idea, and I'll create the YAML file for you!

**Examples:**
- "Create a daily habit tracker with checkboxes for morning and evening routines"
- "Make a content calendar template for social media planning"
- "Build a client onboarding checklist template"
- "Create a meal planning template with shopping list"

## 📝 Quick Examples

### Create a Daily Planner
```bash
npm run dev generate
# Follow prompts, then:
npm run dev create templates/daily-planner.yml --variable date="2024-01-15"
```

### Create a Content Calendar
```bash
npm run dev generate
# Name: Content Calendar
# Add sections: Content Ideas, Publishing Schedule, Analytics
npm run dev create templates/content-calendar.yml
```

## 🎯 Popular Templates to Create

1. **Productivity**
   - Daily/Weekly Planner
   - Habit Tracker
   - Goal Tracker
   - Time Blocking

2. **Business**
   - Client Onboarding
   - Project Tracker
   - Meeting Notes
   - Content Calendar

3. **Personal**
   - Meal Planner
   - Budget Tracker
   - Reading List
   - Travel Planner

## 💡 Pro Tips

- Use variables: `{{variable_name}}` for customization
- Add clear descriptions
- Include example content
- Test before selling: `npm run dev create templates/your-template.yml`

## 🛒 Ready to Sell?

1. Create template: `npm run dev generate`
2. Customize: Edit the YAML file
3. Test: `npm run dev create templates/your-template.yml`
4. Export from Notion and sell!

---

**Just tell me what template you want, and I'll create it!** 🎨

