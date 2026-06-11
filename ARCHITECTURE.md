# MantleGuard Extension Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     VS Code Extension Host                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Activity Bar (Sidebar)                    │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  🛡️ MantleGuard                                 │  │  │
│  │  │  ├── 🏠 Dashboard    → dashboardViewProvider    │  │  │
│  │  │  ├── ⚡ Gas          → gasViewProvider          │  │  │
│  │  │  ├── 🛡️ Audit        → auditViewProvider        │  │  │
│  │  │  ├── 🤖 Copilot      → copilotViewProvider      │  │  │
│  │  │  ├── 📄 Reports      → reportsViewProvider      │  │  │
│  │  │  └── ⚙️ Settings     → settingsViewProvider     │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Command Palette (Ctrl+Shift+P)              │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  MantleGuard: Analyze Contract                   │  │  │
│  │  │  MantleGuard: Audit Contract                     │  │  │
│  │  │  MantleGuard: Optimize Gas                       │  │  │
│  │  │  MantleGuard: AI Copilot                         │  │  │
│  │  │  MantleGuard: Generate Report                    │  │  │
│  │  │  MantleGuard: Open Dashboard                     │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Status Bar                           │  │
│  │  [$(shield) MantleGuard] ← Click to open dashboard   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ (axios)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               MantleGuard Backend Server                      │
│                  (http://localhost:3000)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  API Endpoints:                                               │
│  ├── POST /api/analyze           → Contract Analysis         │
│  ├── POST /api/audit             → Security Audit            │
│  ├── POST /api/gas/optimize      → Gas Optimization          │
│  ├── POST /api/copilot           → AI Assistance             │
│  ├── POST /api/reports/generate  → Report Generation         │
│  └── GET  /api/reports           → List Reports              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📂 Code Structure

```
extension/
│
├── src/
│   │
│   ├── extension.ts                 ← Main Entry Point
│   │   ├── Registers commands
│   │   ├── Registers view providers
│   │   ├── Configures auto-analysis
│   │   └── Creates status bar item
│   │
│   ├── commands/                    ← Command Implementations
│   │   ├── analyzeContract.ts
│   │   ├── auditContract.ts
│   │   ├── optimizeGas.ts
│   │   ├── aiCopilot.ts
│   │   ├── generateReport.ts
│   │   ├── openDashboard.ts
│   │   └── index.ts
│   │
│   ├── providers/                   ← View Providers (Sidebar)
│   │   ├── dashboardViewProvider.ts
│   │   ├── gasViewProvider.ts
│   │   ├── auditViewProvider.ts
│   │   ├── copilotViewProvider.ts
│   │   ├── reportsViewProvider.ts
│   │   ├── settingsViewProvider.ts
│   │   └── index.ts
│   │
│   └── services/                    ← API Integration
│       └── apiService.ts            ← Singleton HTTP client
│
├── media/                           ← Assets
│   └── icon.svg                     ← Extension icon
│
└── Configuration Files
    ├── package.json                 ← Extension manifest
    ├── tsconfig.json                ← TypeScript config
    ├── .eslintrc.json               ← Linting rules
    └── .prettierrc                  ← Code formatting
```

## 🔄 Data Flow

### Command Execution Flow
```
User Action
   │
   ├─→ Command Palette
   │   └─→ "MantleGuard: Analyze Contract"
   │
   ├─→ Activity Bar Click
   │   └─→ "Optimize Current Contract"
   │
   └─→ Status Bar Click
       └─→ Open Dashboard
   
   │
   ▼
Command Handler
(commands/analyzeContract.ts)
   │
   ├─→ Get active editor
   ├─→ Validate Solidity file
   └─→ Extract contract code
   
   │
   ▼
API Service
(services/apiService.ts)
   │
   ├─→ POST /api/analyze
   ├─→ Headers: Content-Type: application/json
   └─→ Body: { code, fileName }
   
   │
   ▼
Backend Server
   │
   ├─→ Process contract
   ├─→ Run analysis
   └─→ Return results
   
   │
   ▼
Response Handler
   │
   ├─→ Show notification
   ├─→ Display in Output Channel
   └─→ Update view providers
   
   │
   ▼
User sees results
```

### Auto-Analysis Flow
```
User saves .sol file
   │
   ▼
onDidSaveTextDocument event
   │
   ├─→ Check if enableAutoAnalysis = true
   ├─→ Check if file is Solidity
   └─→ Trigger analyzeContract()
   
   │
   ▼
[Same flow as Command Execution]
```

## 🧩 Key Components

### 1. Extension Activation (`extension.ts`)
- **Responsibility**: Bootstrap and lifecycle management
- **Key Functions**:
  - `activate()`: Initialize extension
  - `deactivate()`: Cleanup on exit
- **Registers**:
  - All commands
  - All view providers
  - Event listeners
  - Status bar items

### 2. Commands (`commands/`)
- **Responsibility**: User-triggered actions
- **Pattern**: Each command is a separate module
- **Features**:
  - Progress notifications
  - Error handling
  - Input validation
  - Result presentation

### 3. View Providers (`providers/`)
- **Responsibility**: Populate Activity Bar sidebar
- **Pattern**: Implements `TreeDataProvider<T>`
- **Methods**:
  - `getTreeItem()`: Define item appearance
  - `getChildren()`: Define tree structure
  - `refresh()`: Update view data

### 4. API Service (`services/apiService.ts`)
- **Responsibility**: Backend communication
- **Pattern**: Singleton
- **Features**:
  - Centralized HTTP client
  - Error handling
  - Configuration management
  - Type-safe methods

## 🎨 UI Components

### Activity Bar Sidebar
```typescript
TreeDataProvider<Item> {
  onDidChangeTreeData: Event<void>
  getTreeItem(element): TreeItem
  getChildren(element?): Item[]
}
```

### Commands
```typescript
vscode.commands.registerCommand(
  'mantleguard.commandName',
  async () => {
    // Command logic
  }
)
```

### Status Bar
```typescript
StatusBarItem {
  text: '$(shield) MantleGuard'
  tooltip: string
  command: string
  show()
}
```

## 🔐 Configuration

### Settings Schema
```json
{
  "mantleguard.apiUrl": {
    "type": "string",
    "default": "http://localhost:3000",
    "description": "MantleGuard API URL"
  },
  "mantleguard.enableAutoAnalysis": {
    "type": "boolean",
    "default": true,
    "description": "Enable automatic gas analysis on file save"
  }
}
```

### Accessing Settings
```typescript
const config = vscode.workspace.getConfiguration('mantleguard');
const apiUrl = config.get<string>('apiUrl');
```

## 🚀 Extension Lifecycle

```
Install Extension
   │
   ▼
Activate (on Solidity file open or command)
   │
   ├─→ Register commands
   ├─→ Register view providers
   ├─→ Create status bar item
   └─→ Setup event listeners
   │
   ▼
Extension Running
   │
   ├─→ User opens .sol file
   ├─→ User runs commands
   ├─→ User clicks sidebar items
   └─→ Auto-analysis on save
   │
   ▼
Deactivate (on VS Code close)
   │
   └─→ Cleanup resources
```

## 🧪 Testing Points

### Unit Testing
- Command handlers
- API service methods
- View provider logic

### Integration Testing
- Command → API → Response flow
- View provider data updates
- Settings changes

### E2E Testing
- Full user workflows
- Multi-file operations
- Error scenarios

## 📊 Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Commands load only when used
2. **Singleton Pattern**: Single API service instance
3. **Async Operations**: Non-blocking API calls
4. **Progress UI**: User feedback during operations
5. **Error Boundaries**: Graceful degradation

### Resource Management
- Dispose unused resources
- Cache API responses (optional)
- Debounce auto-analysis
- Limit concurrent requests

## 🔧 Extension Points

### Future Enhancements
1. **Diagnostics**: Inline error squiggles
2. **CodeLens**: Inline action buttons
3. **Hover Providers**: Tooltip information
4. **Code Actions**: Quick fixes
5. **Webview Panels**: Rich result displays
6. **Language Server**: Advanced language features

## 📝 Notes

- Extension follows VS Code Extension API best practices
- Modular architecture for easy maintenance
- TypeScript for type safety
- Singleton API service prevents duplicate connections
- Tree view providers allow dynamic content updates
