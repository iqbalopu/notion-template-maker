# Quick Start: Automated Daily Template Generation

## 🚀 Run Now

```bash
npm run auto-generate
```

This will create 10 templates right now!

## ⚙️ Setup Daily Automation

### Windows
```powershell
# Run as Administrator
.\scripts\schedule-daily.ps1
```

### Linux/Mac
```bash
chmod +x scripts/schedule-daily.sh
./scripts/schedule-daily.sh
```

## 📋 What Gets Created

- **10 templates per day** focused on Software Management
- **13+ curated templates** including:
  - 📊 Project Management Dashboards, Release Plans, Quality Management
  - 🔧 Maintenance Schedules, Operations Runbooks, Architecture Management
  - 👥 Team Management, Documentation Management, Security Management
  - ⚡ Performance Management, Change Management, License Management
  - 📊 Monitoring Dashboards

## 🎯 Options

```bash
# Create 5 templates instead of 10
node dist/cli/index.js auto-generate --count 5

# Test without creating (dry run)
node dist/cli/index.js auto-generate --dry-run

# Force creation even if templates exist
node dist/cli/index.js auto-generate --force
```

## 📚 Full Documentation

See [AUTOMATED_DAILY_GENERATION.md](./AUTOMATED_DAILY_GENERATION.md) for complete details.

