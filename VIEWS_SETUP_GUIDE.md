# Views Setup Guide

This guide shows you exactly how to create the recommended views for your Indie Game Studio OS.

## 📊 View 1: By Platform (Projects Database)

### Steps:
1. Open the **Projects** database
2. Click **"+ Add a view"** → Select **"Board"**
3. Name it: **"By Platform"**
4. Click **"Group by"** → Select **"Platform"**
5. Click **"Properties"** → Show: Name, Status, Release Date, Progress
6. Click **"Save"**

**Result:** You'll see projects grouped by iOS, Android, Steam, etc.

---

## 📅 View 2: Release Roadmap (Projects Database)

### Steps:
1. Open the **Projects** database
2. Click **"+ Add a view"** → Select **"Timeline"**
3. Name it: **"Release Roadmap"**
4. Set **Date property** to: **"Release Date"**
5. Click **"Group by"** → Select **"Status"**
6. Click **"Filter"** → Add filter:
   - Property: Status
   - Condition: Is
   - Value: In Development OR Released
7. Click **"Save"**

**Result:** Timeline view showing when projects will be released

---

## 🐛 View 3: Bugs by Priority (Bugs Database)

### Steps:
1. Open the **Bugs** database
2. Click **"+ Add a view"** → Select **"Table"**
3. Name it: **"Bugs by Priority"**
4. Click **"Group by"** → Select **"Priority"**
5. Click **"Sort"** → Add sort:
   - Property: Priority
   - Order: Custom (Drag to order: Critical, High, Medium, Low)
6. Click **"Filter"** → Add filter:
   - Property: Status
   - Condition: Is
   - Value: New OR In Progress
7. Click **"Save"**

**Result:** Bugs grouped by priority, showing only active bugs

---

## 🎯 Additional Useful Views

### Active Projects View
**Database:** Projects
**Type:** Table
**Filter:** Status = "In Development"
**Sort:** Release Date (ascending)

### Active Bugs View
**Database:** Bugs
**Type:** Board
**Group by:** Status
**Filter:** Status = "New" OR "In Progress"
**Sort:** Priority (descending)

### Release Timeline View
**Database:** Builds
**Type:** Timeline
**Date property:** Release Date
**Group by:** Platform
**Filter:** Status = "Released" OR "Ready"

### Upcoming Marketing Tasks
**Database:** Marketing Tasks
**Type:** Calendar
**Date property:** Due Date
**Filter:** Status ≠ "Completed" AND Due Date is not empty
**Sort:** Due Date (ascending)

---

## 💡 Pro Tips

1. **Save views as templates** - Once you create a view, others can use it
2. **Use filters** - Combine multiple filters for precise views
3. **Group views** - Group by status, platform, or priority for better organization
4. **Timeline views** - Perfect for release planning and deadlines
5. **Board views** - Great for Kanban-style workflow management

---

## 🚀 Quick Setup Checklist

- [ ] Create "By Platform" view in Projects
- [ ] Create "Release Roadmap" timeline view
- [ ] Create "Bugs by Priority" view
- [ ] Create "Active Projects" view
- [ ] Create "Active Bugs" view
- [ ] Create "Release Timeline" view in Builds
- [ ] Create "Upcoming Marketing Tasks" calendar view

Once you've created these views, your Indie Game Studio OS will be fully functional! 🎮

