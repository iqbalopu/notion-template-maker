# Database Schemas for Indie Game Studio OS

This document describes the database structures needed for the Indie Game Studio OS template.

## 📊 Database Structures

### 1. Projects Database

**Properties:**
- **Name** (Title) - Project name
- **Status** (Select) - Not Started, In Development, Testing, Released, On Hold
- **Platform** (Multi-select) - iOS, Android, Steam, Other
- **Genre** (Select) - Action, Adventure, Puzzle, RPG, Strategy, etc.
- **Start Date** (Date) - Project start date
- **Release Date** (Date) - Target/actual release date
- **Team Size** (Number) - Number of team members
- **Budget** (Number) - Project budget
- **Progress** (Number) - Completion percentage (0-100)
- **Sprints** (Relation) - Link to Sprints database
- **Bugs** (Relation) - Link to Bugs database
- **Builds** (Relation) - Link to Builds database

**Views:**
- All Projects
- By Platform (filter by Platform)
- Release Roadmap (timeline view by Release Date)

---

### 2. Sprints Database

**Properties:**
- **Name** (Title) - Sprint name/number
- **Project** (Relation) - Link to Projects database
- **Status** (Select) - Planning, Active, Completed, Blocked
- **Start Date** (Date) - Sprint start date
- **End Date** (Date) - Sprint end date
- **Sprint Goal** (Rich Text) - Main objective
- **Tasks** (Rich Text) - Task list
- **Completed Tasks** (Number) - Count of completed tasks
- **Total Tasks** (Number) - Total tasks in sprint
- **Completion %** (Formula) - (Completed Tasks / Total Tasks) * 100

**Views:**
- All Sprints
- Active Sprints (filter Status = Active)
- By Project (group by Project)

---

### 3. Bugs Database

**Properties:**
- **Title** (Title) - Bug description
- **Project** (Relation) - Link to Projects database
- **Sprint** (Relation) - Link to Sprints database
- **Status** (Select) - New, In Progress, Testing, Fixed, Won't Fix, Duplicate
- **Priority** (Select) - Critical, High, Medium, Low
- **Platform** (Multi-select) - iOS, Android, Steam, Other
- **Severity** (Select) - Crash, Major, Minor, Cosmetic
- **Reporter** (Person) - Who reported the bug
- **Assignee** (Person) - Who's fixing it
- **Created Date** (Created Time) - When bug was reported
- **Fixed Date** (Date) - When bug was fixed
- **Steps to Reproduce** (Rich Text) - How to reproduce
- **Expected Behavior** (Rich Text) - What should happen
- **Actual Behavior** (Rich Text) - What actually happens
- **Build Version** (Relation) - Link to Builds database

**Views:**
- All Bugs
- Bugs by Priority (group by Priority)
- By Platform (filter by Platform)
- Active Bugs (filter Status = New or In Progress)
- By Project (group by Project)

---

### 4. Builds Database

**Properties:**
- **Version** (Title) - Build version (e.g., "1.2.3")
- **Project** (Relation) - Link to Projects database
- **Platform** (Select) - iOS, Android, Steam, Other
- **Build Type** (Select) - Development, Alpha, Beta, Release, Hotfix
- **Build Date** (Date) - When build was created
- **Release Date** (Date) - When build was released
- **Status** (Select) - Building, Ready, Testing, Released, Rolled Back
- **Build Number** (Number) - Build number
- **Download Link** (URL) - Link to build
- **Release Notes** (Rich Text) - What's in this build
- **Bugs Fixed** (Relation) - Link to Bugs database
- **File Size** (Number) - Build file size in MB
- **Test Status** (Select) - Not Tested, Testing, Passed, Failed

**Views:**
- All Builds
- By Platform (filter by Platform)
- Release Timeline (timeline view by Release Date)
- By Project (group by Project)

---

### 5. Marketing Tasks Database

**Properties:**
- **Task** (Title) - Marketing task name
- **Project** (Relation) - Link to Projects database
- **Status** (Select) - Not Started, In Progress, Completed, Cancelled
- **Priority** (Select) - High, Medium, Low
- **Category** (Select) - Social Media, PR, Advertising, Content, Events, Partnerships
- **Platform** (Multi-select) - Twitter, Instagram, TikTok, YouTube, Steam, Other
- **Due Date** (Date) - When task is due
- **Assigned To** (Person) - Who's responsible
- **Description** (Rich Text) - Task details
- **Results** (Rich Text) - Outcomes and metrics
- **Budget** (Number) - Budget allocated
- **Spent** (Number) - Amount spent

**Views:**
- All Marketing Tasks
- By Category (group by Category)
- By Platform (filter by Platform)
- Upcoming (filter by Due Date)
- By Project (group by Project)

---

### 6. Store Assets Database

**Properties:**
- **Asset Name** (Title) - Asset identifier
- **Project** (Relation) - Link to Projects database
- **Platform** (Select) - iOS App Store, Google Play, Steam, Epic Games, Other
- **Asset Type** (Select) - Screenshot, Video, Icon, Banner, Trailer, Description, Keywords
- **Status** (Select) - Draft, Review, Approved, Live
- **Version** (Text) - Asset version
- **File** (Files) - Asset file
- **Dimensions** (Text) - File dimensions (e.g., "1920x1080")
- **File Size** (Number) - Size in MB
- **Language** (Select) - English, Spanish, French, German, etc.
- **Created Date** (Date) - When asset was created
- **Updated Date** (Date) - Last update
- **Notes** (Rich Text) - Additional notes

**Views:**
- All Assets
- By Platform (filter by Platform)
- By Type (group by Asset Type)
- By Status (group by Status)
- By Project (group by Project)

---

### 7. Press Kit Database

**Properties:**
- **Item Name** (Title) - Press kit item name
- **Project** (Relation) - Link to Projects database
- **Type** (Select) - Logo, Screenshot, Trailer, Fact Sheet, Press Release, Bio, Contact Info
- **Status** (Select) - Draft, Review, Approved, Published
- **File** (Files) - Media file
- **Description** (Rich Text) - Item description
- **Usage Rights** (Select) - Free to Use, Attribution Required, Contact for Permission
- **Created Date** (Date) - When item was created
- **Updated Date** (Date) - Last update
- **Download Count** (Number) - Times downloaded
- **Public Link** (URL) - Public download link

**Views:**
- All Press Kit Items
- By Type (group by Type)
- By Status (group by Status)
- By Project (group by Project)
- Public Items (filter Status = Published)

---

## 🔗 Database Relations

- **Projects** → **Sprints** (one-to-many)
- **Projects** → **Bugs** (one-to-many)
- **Projects** → **Builds** (one-to-many)
- **Projects** → **Marketing Tasks** (one-to-many)
- **Projects** → **Store Assets** (one-to-many)
- **Projects** → **Press Kit** (one-to-many)
- **Sprints** → **Bugs** (one-to-many)
- **Builds** → **Bugs** (many-to-many)

---

## 📋 Next Steps

1. Create each database in Notion
2. Add the properties listed above
3. Create the views as described
4. Link databases using relations
5. Add rollup properties to aggregate data
6. Customize formulas as needed

Use the MCP tools or Notion UI to create these databases!

