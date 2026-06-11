# ✅ MantleGuard Extension - Testing Checklist

**Testing Date:** _____________  
**Tester:** _____________  
**Backend Status:** ⬜ Running | ⬜ Not Running  
**VS Code Version:** _____________

---

## 🚀 Pre-Testing Setup

- [ ] Backend running at http://localhost:3000
- [ ] Extension folder open in VS Code
- [ ] Pressed F5 to launch Extension Development Host
- [ ] New window opened successfully
- [ ] TEST_SAMPLE.sol file available

---

## Phase 1: Extension Activation (2 min)

- [ ] Extension activated notification appears
- [ ] Activity Bar shows 🛡️ MantleGuard icon
- [ ] No errors in Output panel (View > Output > MantleGuard)
- [ ] Status Bar shows "🛡 MantleGuard Ready"

**Issues Found:**
```
_______________________________________
```

---

## Phase 2: Command Palette (3 min)

Press `Ctrl+Shift+P` and type "MantleGuard":

- [ ] MantleGuard: Analyze Contract
- [ ] MantleGuard: Audit Contract
- [ ] MantleGuard: Optimize Gas
- [ ] MantleGuard: AI Copilot
- [ ] MantleGuard: Generate Report
- [ ] MantleGuard: Open Dashboard

**Test One Command:**
- [ ] Select "Analyze Contract"
- [ ] Status bar shows "Analyzing..."
- [ ] Command completes or shows error
- [ ] Status bar returns to "Ready"

**Issues Found:**
```
_______________________________________
```

---

## Phase 3: Activity Bar Views (5 min)

Click 🛡️ MantleGuard icon in Activity Bar:

- [ ] "Ask MantleGuard" (AI Chat) view loads
- [ ] Dashboard view appears
- [ ] Gas view appears
- [ ] Audit view appears
- [ ] Copilot view appears
- [ ] Reports view appears
- [ ] Settings view appears

**Click Each View:**
- [ ] All views expand/collapse correctly
- [ ] No error messages
- [ ] Refresh icons work (if present)

**Issues Found:**
```
_______________________________________
```

---

## Phase 4: Context Menus (3 min)

### Editor Context Menu
Open TEST_SAMPLE.sol, right-click in editor:

- [ ] "Analyze with MantleGuard" appears
- [ ] "Run Audit" appears
- [ ] "Optimize Gas" appears
- [ ] "Ask AI" appears
- [ ] "Generate Report" appears
- [ ] Menu only shows for .sol files

### Explorer Context Menu
Right-click TEST_SAMPLE.sol in file explorer:

- [ ] "Analyze with MantleGuard" appears
- [ ] "Run Audit" appears
- [ ] "Optimize Gas" appears
- [ ] "Generate Report" appears

**Test One Action:**
- [ ] Click context menu command
- [ ] Command executes

**Issues Found:**
```
_______________________________________
```

---

## Phase 5: CodeLens (5 min)

Open TEST_SAMPLE.sol:

### Function-Level CodeLens
Look above `withdraw()` function:

- [ ] "🛡 Analyze" appears
- [ ] "⚡ Optimize" appears
- [ ] "🤖 Ask AI" appears

### Contract-Level CodeLens
Look above `contract VulnerableBank`:

- [ ] "🛡 Analyze Contract" appears
- [ ] "🔒 Security Audit" appears

**Test Actions:**
- [ ] Click "🛡 Analyze" → Command runs
- [ ] Click "⚡ Optimize" → Command runs
- [ ] Click "🤖 Ask AI" → AI chat opens

**Issues Found:**
```
_______________________________________
```

---

## Phase 6: Hover Intelligence (3 min)

In TEST_SAMPLE.sol:

- [ ] Hover over `withdraw` function name
- [ ] Popup appears with information
- [ ] Shows "Gas Score" section
- [ ] Shows "Security Score" section
- [ ] Shows "Optimizations" section
- [ ] Shows "AI Suggestions" section
- [ ] Action links work (Analyze, Optimize, Ask AI)

**Test Different Functions:**
- [ ] `deposit()` - hover works
- [ ] `safeWithdraw()` - hover works
- [ ] `emergencyWithdraw()` - hover works

**Issues Found:**
```
_______________________________________
```

---

## Phase 7: Problems Panel (5 min)

Run: `Ctrl+Shift+P` > "MantleGuard: Show Sample Diagnostics"

- [ ] Command executes
- [ ] Open Problems Panel: `Ctrl+Shift+M`
- [ ] Diagnostics appear
- [ ] See Critical issues (red)
- [ ] See High issues (orange)
- [ ] See Medium issues (yellow)
- [ ] See Low issues (blue)

**Test Click-to-Navigate:**
- [ ] Click on a diagnostic
- [ ] Editor jumps to correct line
- [ ] Correct code is highlighted

**Issues Found:**
```
_______________________________________
```

---

## Phase 8: AI Chat Sidebar (5 min)

Click "Ask MantleGuard" in Activity Bar:

- [ ] Chat interface loads
- [ ] Text input field present
- [ ] Send button present
- [ ] Quick action buttons visible:
  - [ ] Explain
  - [ ] Fix
  - [ ] Optimize
  - [ ] Summarize
  - [ ] Generate Tests

**Test Chat:**
- [ ] Type: "Explain this contract"
- [ ] Press send
- [ ] Response appears (or shows error if backend down)
- [ ] Streaming effect works (if backend running)

**Test Quick Action:**
- [ ] Click "Explain" button
- [ ] Response appears

**Issues Found:**
```
_______________________________________
```

---

## Phase 9: Status Bar (3 min)

Look at bottom right:

- [ ] "🛡 MantleGuard Ready" text visible
- [ ] Status bar item is clickable

**Test States:**
- [ ] Run any command
- [ ] Status changes to "Analyzing..." (animated)
- [ ] After completion, returns to "Ready"
- [ ] On error, shows "Failed" (red)
- [ ] Auto-recovers after 5 seconds

**Click Status Bar:**
- [ ] Click the status bar item
- [ ] Dashboard opens

**Issues Found:**
```
_______________________________________
```

---

## Phase 10: Quick Fix (5 min)

In TEST_SAMPLE.sol with diagnostics visible:

- [ ] Red squiggly line appears under code
- [ ] Click on the squiggly line
- [ ] Yellow lightbulb 💡 appears in margin
- [ ] Click lightbulb (or press `Ctrl+.`)
- [ ] Quick Fix menu appears
- [ ] "Apply AI Fix" option visible
- [ ] Other specific fixes visible (if any)

**Test Quick Fix:**
- [ ] Select "Apply AI Fix"
- [ ] Preview dialog appears
- [ ] Shows "Before" code
- [ ] Shows "After" code
- [ ] Diff highlighting visible
- [ ] "Accept" button present
- [ ] "Reject" button present

**Test Accept:**
- [ ] Click "Accept"
- [ ] Code is updated
- [ ] Changes applied correctly

**Test Reject:**
- [ ] Apply another fix
- [ ] Click "Reject"
- [ ] Code unchanged

**Issues Found:**
```
_______________________________________
```

---

## Phase 11: Report Generation (5 min)

Right-click TEST_SAMPLE.sol > "Generate Report":

- [ ] Report menu appears
- [ ] Three format options shown:
  - [ ] Markdown
  - [ ] JSON
  - [ ] PDF

**Test Markdown Export:**
- [ ] Select "Markdown"
- [ ] Preview opens
- [ ] Contains Security Score
- [ ] Contains Gas Score
- [ ] Contains Summary
- [ ] Contains Recommendations
- [ ] Proper formatting visible
- [ ] Save/export works

**Test JSON Export:**
- [ ] Select "JSON"
- [ ] File preview or save dialog appears
- [ ] Valid JSON structure

**Test PDF Export (if backend running):**
- [ ] Select "PDF"
- [ ] PDF generation starts
- [ ] PDF opens or saves

**Issues Found:**
```
_______________________________________
```

---

## Phase 12: Webview Dashboard (3 min)

Run: `Ctrl+Shift+P` > "MantleGuard: Open Dashboard"

- [ ] Dashboard webview opens
- [ ] Shows React UI (if backend running)
- [ ] Shows fallback UI (if backend not running)
- [ ] Dashboard is interactive
- [ ] No console errors (F12 > Console)

**Issues Found:**
```
_______________________________________
```

---

## Phase 13: Auto-Analysis (3 min)

Setting enabled by default:

- [ ] Edit TEST_SAMPLE.sol
- [ ] Make a small change
- [ ] Save file (`Ctrl+S`)
- [ ] Notification: "Auto-analyzing contract..."
- [ ] Status bar shows "Auto-analyzing..."
- [ ] Analysis completes
- [ ] CodeLens refreshes

**Disable Auto-Analysis:**
- [ ] Settings > Search "mantleguard"
- [ ] Uncheck "Enable Auto Analysis"
- [ ] Save file again
- [ ] No auto-analysis triggered ✅

**Issues Found:**
```
_______________________________________
```

---

## Phase 14: Error Handling (5 min)

**Backend Not Running:**
- [ ] Stop backend (if running)
- [ ] Run any command
- [ ] Error message shown
- [ ] Extension doesn't crash
- [ ] Can retry after starting backend

**Invalid File:**
- [ ] Open non-.sol file
- [ ] Commands don't appear in palette (or greyed out)
- [ ] Context menu doesn't show options

**Network Timeout:**
- [ ] Set wrong API URL in settings
- [ ] Run command
- [ ] Timeout error shown
- [ ] Extension recovers

**Issues Found:**
```
_______________________________________
```

---

## Phase 15: Performance (3 min)

- [ ] Open large .sol file (>500 lines)
- [ ] CodeLens appears within 2 seconds
- [ ] Hover response < 1 second
- [ ] Commands complete in reasonable time
- [ ] UI remains responsive
- [ ] No memory leaks (check Task Manager)

**Issues Found:**
```
_______________________________________
```

---

## 📊 Test Summary

### Total Tests Run: _____/74

### Pass Rate: _____%

### Critical Issues: _____
```
1. _______________________________________
2. _______________________________________
3. _______________________________________
```

### Medium Issues: _____
```
1. _______________________________________
2. _______________________________________
```

### Minor Issues: _____
```
1. _______________________________________
2. _______________________________________
```

---

## ✅ Sign-Off

- [ ] All critical features tested
- [ ] No blockers found
- [ ] Extension ready for next phase

**Tester Signature:** _____________  
**Date:** _____________

---

## 🔄 Next Actions

Based on test results:

1. **If All Pass (≥95%):**
   - [ ] Proceed to packaging
   - [ ] Create demo video
   - [ ] Prepare for release

2. **If Some Issues (80-94%):**
   - [ ] Log issues in tracker
   - [ ] Fix critical bugs first
   - [ ] Re-test affected areas

3. **If Many Issues (<80%):**
   - [ ] Review architecture
   - [ ] Debug systematically
   - [ ] Test again after fixes

---

*Testing completed for MantleGuard Extension v0.1.0*
