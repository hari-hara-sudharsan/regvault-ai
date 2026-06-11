# MantleGuard Extension - Advanced Features Guide

## 🎯 New Features Implemented

### 1. Context Menu (Right-Click Menu) ✅
### 2. CodeLens (Inline Editor Actions) ✅
### 3. Problems Panel (Diagnostics) ✅

---

## 📝 1. Context Menu Integration

### Editor Context Menu
When you **right-click** inside a `.sol` file in the editor:

```
Cut
Copy
Paste
──────────────────────
🛡️ Analyze with MantleGuard
🛡️ Run Audit
⚡ Optimize Gas
🤖 Ask AI
📄 Generate Report
```

### Explorer Context Menu
When you **right-click** a `.sol` file in the File Explorer:

```
Open
Reveal in File Explorer
──────────────────────
🛡️ Analyze with MantleGuard
🛡️ Run Audit
⚡ Optimize Gas
📄 Generate Report
```

**Features:**
- Automatically appears for `.sol` files only
- Grouped under "mantleguard" section
- Quick access to all main commands

---

## 💡 2. CodeLens (Inline Actions)

### What is CodeLens?
CodeLens provides **inline, clickable actions** above functions and contracts.

### Function-Level CodeLens

Above each function:

```
$(shield) Analyze | $(dashboard) Optimize | $(robot) Ask AI
function withdraw() public {
    // function code
}
```

**Actions:**
- **🛡️ Analyze** - Analyzes just this function
- **⚡ Optimize** - Gas optimization for this function
- **🤖 Ask AI** - AI assistance for this function

### Contract-Level CodeLens

Above each contract:
```
$(file-code) Analyze Contract | $(shield) Security Audit
contract MyToken {
    // contract code
}
```

**Actions:**
- **📄 Analyze Contract** - Full contract analysis
- **🛡️ Security Audit** - Security vulnerability scan

### How It Works

1. **Automatic Detection**: CodeLens automatically detects functions and contracts
2. **Click to Execute**: Click any action to run it immediately
3. **Function Extraction**: Automatically extracts and analyzes the specific function
4. **Results Display**: Opens results in Output Channel or side-by-side editor

### Testing CodeLens

Create a test Solidity file:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestContract {
    function testFunction() public pure returns (uint) {
        return 42;
    }
}
```

You should see CodeLens appear above both the contract and function!

---

## 🔴 3. Problems Panel (Diagnostics)

### What is the Problems Panel?
The **Problems Panel** shows security issues, warnings, and optimizations as clickable items.


### Location
- Bottom of VS Code window
- View > Problems (Ctrl+Shift+M / Cmd+Shift+M)
- Shows all issues across all files

### Issue Display

```
PROBLEMS
┌─────────────────────────────────────────────────────────────┐
│ 🔴 Critical  withdraw()  Possible Reentrancy Attack         │ ← Line 15
│ 🟠 High      transfer()  Unchecked External Call            │ ← Line 23
│ 🟡 Medium    owner       Could be constant (Gas)            │ ← Line 8
│ 🔵 Low       pragma      Floating Pragma Version            │ ← Line 1
└─────────────────────────────────────────────────────────────┘
```

### Clicking on Issues

When you **click** an issue:
1. ✅ Editor jumps to the exact line
2. ✅ Code is highlighted
3. ✅ Cursor positioned at the issue

### Severity Levels

| Icon | Severity | VS Code Type | Use Case |
|------|----------|--------------|----------|
| 🔴 | Critical/High | Error | Security vulnerabilities |
| 🟡 | Medium | Warning | Best practices, gas issues |
| 🔵 | Low/Info | Information | Suggestions, style |
| ⚪ | Hint | Hint | Minor improvements |

### Testing Diagnostics

**Command Palette Method:**
1. Open a `.sol` file
2. Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
3. Type: `MantleGuard: Show Sample Diagnostics`
4. Press Enter
5. Check the **Problems Panel** (Ctrl+Shift+M)

You should see sample security issues appear!

### Programmatic Usage

In your API response, return issues in this format:
```typescript
{
  issues: [
    {
      severity: 'critical',
      title: 'Reentrancy Vulnerability',
      message: 'Possible reentrancy attack. Use ReentrancyGuard.',
      line: 15,
      column: 4,
      code: 'REENTRANCY-001'
    }
  ]
}
```

The extension will automatically display them in the Problems Panel!

---


## 🎮 Testing All Features

### Step 1: Create Test File

Create `test.sol`:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public {
        uint amount = balances[msg.sender];
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        balances[msg.sender] = 0;
    }
}
```

### Step 2: Test CodeLens
1. Open `test.sol`
2. Look above the `contract` line - see 2 actions
3. Look above each `function` - see 3 actions each
4. Click "$(shield) Analyze" on `withdraw()`

### Step 3: Test Context Menu
1. Right-click anywhere in `test.sol`
2. See MantleGuard commands at bottom
3. Click "🛡️ Run Audit"

### Step 4: Test Diagnostics
1. Press `Ctrl+Shift+P`
2. Type "MantleGuard: Show Sample Diagnostics"
3. Open Problems Panel (`Ctrl+Shift+M`)
4. Click on "Reentrancy" issue
5. Editor should jump to line 15 (the vulnerable `withdraw()` function)

### Step 5: Test Explorer Context
1. In File Explorer (left sidebar), find `test.sol`
2. Right-click on the file
3. See MantleGuard commands
4. Click "⚡ Optimize Gas"

---

## 🔧 Configuration

All features work automatically, but you can configure:

### Disable CodeLens
Add to `settings.json`:
```json
{
  "editor.codeLens": false
}
```

### Disable Auto-Analysis (keeps diagnostics manual)
```json
{
  "mantleguard.enableAutoAnalysis": false
}
```

---


## 🏗️ Architecture

### CodeLens Flow
```
1. User opens .sol file
2. MantleGuardCodeLensProvider.provideCodeLenses()
3. Scans for "function" and "contract" keywords
4. Creates CodeLens objects with commands
5. VS Code displays inline actions
6. User clicks action
7. Command handler executes
8. Results shown in Output Channel
```

### Diagnostics Flow
```
1. Analysis runs (manual or auto)
2. Backend returns issues array
3. MantleGuardDiagnosticsProvider.updateDiagnostics()
4. Creates Diagnostic objects
5. Adds to diagnostic collection
6. VS Code displays in Problems Panel
7. User clicks issue
8. Editor jumps to line
```

### Context Menu Flow
```
1. User right-clicks .sol file
2. VS Code checks "when" conditions
3. Shows commands where resourceExtname == .sol
4. User selects command
5. Command handler executes
6. Results displayed
```

---

## 📊 API Integration

### Backend Response Format

Your backend should return diagnostics in responses:

```typescript
// POST /api/analyze response
{
  "success": true,
  "issues": [
    {
      "severity": "critical",
      "title": "Reentrancy Vulnerability",
      "message": "The withdraw() function is vulnerable to reentrancy attacks",
      "line": 15,
      "column": 4,
      "endLine": 18,
      "endColumn": 5,
      "code": "REENTRANCY-001",
      "source": "MantleGuard Security Scanner"
    }
  ],
  "estimatedSavings": 12.5,
  "gasScore": 78
}
```

The extension will:
1. Parse the `issues` array
2. Create diagnostics for each issue
3. Display in Problems Panel
4. Allow users to click and jump to issues

---


## 🎨 Visual Examples

### CodeLens in Action
```
  1 | // SPDX-License-Identifier: MIT
  2 | pragma solidity ^0.8.0;
  3 |
  4 | $(file-code) Analyze Contract | $(shield) Security Audit
  5 | contract MyToken {
  6 |     uint256 public totalSupply;
  7 |     
  8 |     $(shield) Analyze | $(dashboard) Optimize | $(robot) Ask AI
  9 |     function mint(address to, uint256 amount) public {
 10 |         totalSupply += amount;
 11 |     }
 12 | }
```

### Problems Panel Display
```
PROBLEMS (4)
├─ contract.sol
│  ├─ 🔴 Line 15: Reentrancy vulnerability in withdraw()
│  ├─ 🟠 Line 23: Unchecked external call result
│  ├─ 🟡 Line 8: State variable could be constant
│  └─ 🔵 Line 1: Consider locking pragma version
```

### Context Menu
```
Right-click on contract.sol:
┌─────────────────────────────────┐
│ Reveal in File Explorer         │
│ Copy Path                       │
│ Copy Relative Path              │
├─────────────────────────────────┤  ← MantleGuard Group
│ 🛡️ Analyze with MantleGuard    │
│ 🛡️ Run Audit                   │
│ ⚡ Optimize Gas                 │
│ 🤖 Ask AI                       │
│ 📄 Generate Report              │
└─────────────────────────────────┘
```

---

## 🚀 Next Steps

### Enhance Diagnostics
- Add quick fixes (Code Actions)
- Provide multiple fix suggestions
- Auto-fix on save

### Enhance CodeLens
- Show gas cost estimates inline
- Display security scores
- Add performance metrics

### Enhance Context Menu
- Add "Fix All Issues"
- Add "Compare with Previous Audit"
- Add "Deploy to Testnet"

---

## 📝 Commands Reference

### New Commands

| Command | Description | Location |
|---------|-------------|----------|
| `mantleguard.analyzeFunction` | Analyze specific function | CodeLens |
| `mantleguard.optimizeFunction` | Optimize specific function | CodeLens |
| `mantleguard.askAIAboutFunction` | AI help for function | CodeLens |
| `mantleguard.showSampleDiagnostics` | Test diagnostics | Command Palette |
| `mantleguard.clearDiagnostics` | Clear problems | Command Palette |
| `mantleguard.refreshCodeLens` | Refresh inline actions | Command Palette |

---

## ✅ Feature Checklist

- ✅ Context menu in editor
- ✅ Context menu in explorer
- ✅ CodeLens for functions
- ✅ CodeLens for contracts
- ✅ Problems panel integration
- ✅ Click-to-navigate diagnostics
- ✅ Severity color coding
- ✅ Function extraction
- ✅ Auto-refresh on edit
- ✅ Clear on document close

All features are production-ready! 🎉
