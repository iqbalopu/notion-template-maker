# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
├─────────────────────────────────────────────────────────────┤
│  CLI Commands          │  Web Interface (Future)           │
│  - create              │  - Visual Builder                 │
│  - duplicate           │  - Template Gallery                │
│  - list                │  - Preview                         │
│  - delete              │                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Template Parser  │  Template Builder  │  Block Factory     │
│  (YAML/JSON →     │  (Structure →      │  (Block Types →    │
│   Structure)      │   Notion API)      │   API Calls)       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
├─────────────────────────────────────────────────────────────┤
│              Notion API Client Wrapper                       │
│  - Authentication                                            │
│  - Rate Limiting                                             │
│  - Error Handling                                            │
│  - Retry Logic                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Notion API                                │
│              (External Service)                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Creating a Template

```
1. User provides template config (YAML/JSON)
   ↓
2. Template Parser validates and parses config
   ↓
3. Template Builder converts structure to Notion blocks
   ↓
4. Block Factory creates API-compatible block objects
   ↓
5. Notion Client sends API requests
   ↓
6. Notion API creates template page
   ↓
7. Success response returned to user
```

### Duplicating a Template

```
1. User provides template page ID
   ↓
2. Notion Client retrieves template page structure
   ↓
3. Template Builder extracts blocks and properties
   ↓
4. Notion Client creates new page with same structure
   ↓
5. Success response with new page ID
```

## Component Responsibilities

### CLI Layer
- **Commands**: Handle user input, parse arguments, display output
- **Prompts**: Interactive input for missing information
- **Output**: Format and display results to user

### Application Layer
- **Template Parser**: Convert YAML/JSON config to internal structure
- **Template Builder**: Orchestrate template creation process
- **Block Factory**: Create Notion block objects from definitions
- **Validation**: Ensure template structure is valid

### API Layer
- **Notion Client**: Wrapper around Notion API SDK
- **Authentication**: Manage API tokens
- **Rate Limiting**: Handle API rate limits gracefully
- **Error Handling**: Convert API errors to user-friendly messages
- **Retry Logic**: Retry failed requests with exponential backoff

## Key Design Decisions

### 1. Configuration Format: YAML
- **Why**: Human-readable, supports comments, easy to edit
- **Alternative**: JSON (more structured but less readable)

### 2. Primary Interface: CLI
- **Why**: Fast, scriptable, no infrastructure needed
- **Future**: Web interface for non-technical users

### 3. Language: TypeScript/Node.js
- **Why**: Official SDK, strong typing, great ecosystem
- **Alternative**: Python (good but unofficial SDK)

### 4. Template Storage: Notion Pages
- **Why**: Native Notion integration, easy to manage
- **Alternative**: External storage (adds complexity)

## Security Architecture

```
┌─────────────────────────────────────┐
│         User's Machine              │
│  ┌───────────────────────────────┐  │
│  │  CLI Tool                     │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Config Files           │  │  │
│  │  │  (No secrets)           │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Environment Variables  │  │  │
│  │  │  (API Token)            │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
              │ HTTPS
              ▼
┌─────────────────────────────────────┐
│         Notion API                   │
│  (Validates token, processes request)│
└─────────────────────────────────────┘
```

## Error Handling Flow

```
API Request
    │
    ├─► Success → Return Result
    │
    ├─► Rate Limit → Wait & Retry
    │
    ├─► Auth Error → Prompt for Token
    │
    ├─► Validation Error → Show Helpful Message
    │
    └─► Network Error → Retry with Backoff
```

## Scalability Considerations

### Current Design (CLI Tool)
- **Limitation**: Single user, local execution
- **Advantage**: No infrastructure needed
- **Scales**: Up to API rate limits per user

### Future Enhancement (Web Service)
- **Architecture**: Serverless functions or containerized service
- **Scaling**: Horizontal scaling based on demand
- **Caching**: Template definitions, API responses
- **Queue**: For batch operations

## Testing Strategy

### Unit Tests
- Template parser logic
- Block factory functions
- Validation logic
- Error handling

### Integration Tests
- Notion API interactions
- End-to-end template creation
- Error scenarios

### E2E Tests
- Full CLI workflows
- Template duplication
- Error recovery

## Deployment Strategy

### Phase 1: npm Package
- Publish to npm registry
- Global installation: `npm install -g notion-template-maker`
- Local installation: `npm install notion-template-maker`

### Phase 2: Binary Distribution
- Package as standalone binary (pkg, nexe)
- Cross-platform builds (Windows, macOS, Linux)
- Direct download distribution

### Phase 3: Web Interface (Optional)
- Deploy to Vercel/Netlify
- Serverless functions for API operations
- Static site for UI

