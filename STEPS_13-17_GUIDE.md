# Steps 13-17 Implementation Guide

## ✅ Files Created for Backend Integration

### Step 13: Webview Integration
**File:** `src/webview/dashboardPanel.ts`

**What it does:**
- Creates a full-page webview panel in VS Code
- Loads your existing React dashboard via iframe
- Falls back to simple UI if backend isn't running
- Integrates with VS Code theme

**Usage:**
```typescript
import { DashboardPanel } from './webview/dashboardPanel';

// Open dashboard
DashboardPanel.createOrShow(context.extensionUri);
```

**Key Features:**
- ✅ Reuses existing React UI (no rebuild needed)
- ✅ Iframe loads `http://localhost:3000`
- ✅ Fallback UI with quick actions
- ✅ CSP configured for security
- ✅ Message passing between webview and extension

---

### Step 14: Enhanced API Service
**File:** `src/services/apiService.ts` (enhanced)

**New Endpoints:**
```typescript
// Health check
await apiService.checkHealth();

// Gas analysis
await apiService.analyzeGas(code, fileName);

// Streaming copilot
await apiService.askCopilotStream(code, query, onChunk);

// Quick fix
await apiService.getQuickFix(code, line, issue);
```

**New Interfaces:**
```typescript
interface AnalysisResult {
  success: boolean;
  issues?: any[];
  gasScore?: number;
  securityScore?: number;
  estimatedSavings?: number;
  findings?: SecurityFinding[];
  suggestions?: GasSuggestion[];
}

interface SecurityFinding {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  line: number;
  column: number;
  fix?: string;
}

interface GasSuggestion {
  title: string;
  description: string;
  line: number;
  currentCost: number;
  optimizedCost: number;
  savings: number;
  fix?: string;
}
```

---

### Step 15: Audit Workflow
**File:** `src/workflows/auditWorkflow.ts`

**Flow:**
```
Open contract
     ↓
Analyze (POST /api/audit)
     ↓
Backend processes
     ↓
Returns findings
     ↓
Display in Problems Panel
     ↓
Quick Fix available
```

**Usage:**
```typescript
const auditWorkflow = new AuditWorkflow(diagnosticsProvider, statusBarManager);
await auditWorkflow.execute(document);
```

**Features:**
- ✅ Calls backend audit API
- ✅ Converts findings to VS Code diagnostics
- ✅ Updates Problems Panel
- ✅ Shows severity-based notifications
- ✅ Provides detailed output channel
- ✅ Supports quick fixes

---

### Step 16: Gas Workflow
**File:** `src/workflows/gasWorkflow.ts`

**Flow:**
```
Open file
     ↓
Analyze (POST /api/gas/analyze)
     ↓
Gas Engine processes
     ↓
Returns suggestions table
     ↓
Display formatted output
     ↓
Show suggestions
```

**Usage:**
```typescript
const gasWorkflow = new GasWorkflow(statusBarManager);
await gasWorkflow.execute(document);
await gasWorkflow.optimize(document);
```

**Features:**
- ✅ Gas score display
- ✅ Formatted table output
- ✅ Line-by-line suggestions
- ✅ Savings calculation
- ✅ Detailed descriptions
- ✅ Optimization recommendations

**Output Format:**
```
=== MantleGuard Gas Analysis Report ===
File: MyContract.sol

⚡ Gas Score: 75/100

📊 Optimization Opportunities:

┌────────────────────────────────┬────────┬────────┬─────────┐
│ Issue                          │ Line   │ Current│ Savings │
├────────────────────────────────┼────────┼────────┼─────────┤
│ Use unchecked for loop         │     15 │  21000 │     12% │
│ Cache storage variable         │     23 │  15000 │      8% │
│ Use custom errors              │     31 │   8000 │      5% │
└────────────────────────────────┴────────┴────────┴─────────┘

💰 Total Estimated Savings: 25%
```

---

### Step 17: Copilot Workflow
**File:** `src/workflows/copilotWorkflow.ts`

**Flow:**
```
Question/Query
     ↓
Backend (POST /api/copilot/stream)
     ↓
LLM processes
     ↓
Streaming response
     ↓
Display in Sidebar (character-by-character)
```

**Usage:**
```typescript
const copilotWorkflow = new CopilotWorkflow(statusBarManager);

// Regular
await copilotWorkflow.ask(code, query);

// Streaming
await copilotWorkflow.askStream(code, query, (chunk) => {
  // Handle each chunk
});

// Prebuilt actions
await copilotWorkflow.explainCode(document);
await copilotWorkflow.fixIssues(document);
await copilotWorkflow.optimizeCode(document);
await copilotWorkflow.generateTests(document);
await copilotWorkflow.summarize(document);
```

**Features:**
- ✅ Streaming support for real-time responses
- ✅ 5 prebuilt workflows (Explain, Fix, Optimize, Tests, Summarize)
- ✅ Context-aware (uses active code)
- ✅ Markdown formatted output
- ✅ Side-by-side display

---

## 🔗 Backend API Requirements

Your backend needs these endpoints:

### Health Check
```
GET /health
Response: 200 OK
```

### Analysis
```
POST /api/analyze
Body: { code: string, fileName: string }
Response: AnalysisResult
```

### Audit
```
POST /api/audit
Body: { code: string, fileName: string }
Response: {
  findings: SecurityFinding[]
  securityScore?: number
}
```

### Gas Analysis
```
POST /api/gas/analyze
Body: { code: string, fileName: string }
Response: {
  gasScore: number
  suggestions: GasSuggestion[]
  estimatedSavings: number
}
```

### Gas Optimization
```
POST /api/gas/optimize
Body: { code: string, fileName: string }
Response: AnalysisResult
```

### Copilot
```
POST /api/copilot
Body: { code: string, query: string }
Response: { response: string }
```

### Copilot Streaming
```
POST /api/copilot/stream
Body: { code: string, query: string }
Response: Server-Sent Events (SSE)
Format:
data: {"content": "chunk"}
data: {"content": "chunk"}
data: [DONE]
```

### Quick Fix
```
POST /api/quickfix
Body: { code: string, line: number, issue: string }
Response: { fix: string }
```

---

## 🔧 Integration Steps

### 1. Update extension.ts

Add imports:
```typescript
import { DashboardPanel } from './webview/dashboardPanel';
import { AuditWorkflow } from './workflows/auditWorkflow';
import { GasWorkflow } from './workflows/gasWorkflow';
import { CopilotWorkflow } from './workflows/copilotWorkflow';
```

Initialize workflows:
```typescript
const auditWorkflow = new AuditWorkflow(diagnosticsProvider, statusBarManager);
const gasWorkflow = new GasWorkflow(statusBarManager);
const copilotWorkflow = new CopilotWorkflow(statusBarManager);
```

Update dashboard command:
```typescript
const openDashboardCmd = vscode.commands.registerCommand(
  'mantleguard.openDashboard',
  () => DashboardPanel.createOrShow(context.extensionUri)
);
```

### 2. Update Commands

Replace command implementations to use workflows:

**analyzeContract.ts:**
```typescript
export async function analyzeContract() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'solidity') {
    vscode.window.showWarningMessage('Please open a Solidity file');
    return;
  }
  
  const auditWorkflow = new AuditWorkflow(/* ... */);
  await auditWorkflow.execute(editor.document);
}
```

**optimizeGas.ts:**
```typescript
export async function optimizeGas() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'solidity') {
    vscode.window.showWarningMessage('Please open a Solidity file');
    return;
  }
  
  const gasWorkflow = new GasWorkflow(/* ... */);
  await gasWorkflow.execute(editor.document);
}
```

### 3. Update AI Chat Provider

Integrate copilot workflow for streaming:

```typescript
const copilotWorkflow = new CopilotWorkflow(statusBarManager);

await copilotWorkflow.askStream(contextCode, message, (chunk) => {
  this.sendMessageToWebview({
    type: 'streamChunk',
    chunk: chunk,
  });
});
```

---

## 🧪 Testing

### Test Dashboard (Step 13)
1. Press Ctrl+Shift+P
2. Run "MantleGuard: Open Dashboard"
3. Should open full-page webview
4. If backend running: Shows React dashboard
5. If backend not running: Shows fallback UI with quick actions

### Test Gas Workflow (Step 16)
1. Open a `.sol` file
2. Run "MantleGuard: Optimize Gas"
3. Should show:
   - Animated status bar
   - Gas analysis table
   - Detailed suggestions
   - Total savings

### Test Audit Workflow (Step 15)
1. Open a `.sol` file
2. Run "MantleGuard: Audit Contract"
3. Should show:
   - Animated status bar
   - Problems Panel with issues
   - Clickable diagnostics
   - Quick fix options

### Test Copilot Workflow (Step 17)
1. Open AI Chat sidebar
2. Type a question
3. Should show:
   - Streaming response
   - Character-by-character display
   - Context-aware answers

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    VS Code Extension                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  User Action → Command → Workflow → API Service         │
│                                          ↓               │
│                                    HTTP Request          │
│                                          ↓               │
└──────────────────────────────────────────┼──────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────┐
│              MantleGuard Backend (localhost:3000)        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Endpoints:                                              │
│  ├─ /health                                              │
│  ├─ /api/analyze                                         │
│  ├─ /api/audit         → Security Scanner               │
│  ├─ /api/gas/analyze   → Gas Engine                     │
│  ├─ /api/gas/optimize  → Optimizer                      │
│  ├─ /api/copilot       → LLM Integration                │
│  └─ /api/quickfix      → AI Fix Generator               │
│                                                          │
└──────────────────────────────────────────┬──────────────┘
                                           │
                                           ▼
                                     JSON Response
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Extension Displays                    │
├─────────────────────────────────────────────────────────┤
│  • Problems Panel (diagnostics)                          │
│  • Output Channel (formatted tables)                     │
│  • Webview (React dashboard)                             │
│  • AI Chat (streaming)                                   │
│  • Status Bar (progress)                                 │
│  • Notifications (results)                               │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Implementation Complete

All Steps 13-17 are ready:
- ✅ Webview integration with existing React UI
- ✅ Enhanced API service with all endpoints
- ✅ Complete audit workflow
- ✅ Complete gas workflow
- ✅ Complete copilot workflow with streaming
- ✅ Backend connection architecture
- ✅ Error handling and fallbacks

**Next:** Start your backend server and test all workflows!
