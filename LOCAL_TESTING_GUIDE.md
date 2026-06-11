# 🧪 Step 20: Local Testing Guide

## ✅ Compilation Status: SUCCESS

```bash
> mantleguard@0.1.0 compile
> tsc -p ./

Exit Code: 0 ✅
```

---

## 🚀 Quick Start Testing

### Step 1: Open Extension in VS Code

```bash
cd extension
code .
```

### Step 2: Launch Extension Development Host

Press **F5** (or Run > Start Debugging)

A new VS Code window opens titled: **"[Extension Development Host]"**

---

## 📋 Complete Testing Checklist

### ✅ Phase 1: Extension Activation (5 min)

**1.1 Check Extension Loaded**
- [ ] Look for notification: "MantleGuard extension activated! 🛡️"
- [ ] Check status bar (bottom-right): Should show "🛡️ MantleGuard Ready"
- [ ] Check Activity Bar (left): Should see shield icon 🛡️

**Expected Result:**
```
✅ Notification appears
✅ Status bar shows shield icon
✅ Activity Bar has MantleGuard icon
```

---

### ✅ Phase 2: Create Test File (2 min)

**2.1 Create Solidity File**

Create `TestContract.sol`:

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
        require(success, "Failed");
        balances[msg.sender] = 0;
    }
    
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
}
```

**Expected Result:**
```
✅ File created
✅ Syntax highlighting works
✅ Status bar updates (if configured)
```

---

### ✅ Phase 3: Command Palette (10 min)

**3.1 Open Command Palette**
- Press: **Ctrl+Shift+P** (Windows/Linux) or **Cmd+Shift+P** (Mac)

**3.2 Test All Commands**

Type "MantleGuard" and verify these appear:

- [ ] **MantleGuard: Analyze Contract**
  - Select it
  - Expected: Progress notification, output channel shows results
  
- [ ] **MantleGuard: Audit Contract**
  - Select it
  - Expected: Status bar animates, Problems Panel may show issues
  
- [ ] **MantleGuard: Optimize Gas**
  - Select it
  - Expected: Gas analysis output, table display
  
- [ ] **MantleGuard: AI Copilot**
  - Select it
  - Expected: Input box appears for query
  
- [ ] **MantleGuard: Generate Report**
  - Select it
  - Expected: Export menu appears with 4 options
  
- [ ] **MantleGuard: Open Dashboard**
  - Select it
  - Expected: Webview panel opens
  
- [ ] **MantleGuard: Show Sample Diagnostics**
  - Select it
  - Expected: Problems Panel populated with 4 sample issues

**Test Results:**
```
Commands found: ___/7
Commands executed: ___/7
Commands working: ___/7
```

---

### ✅ Phase 4: Activity Bar & Sidebar (10 min)

**4.1 Open MantleGuard Sidebar**
- Click the **🛡️ shield icon** in Activity Bar (left sidebar)

**4.2 Verify All Sections**

Should see 7 sections:

1. **Ask MantleGuard** (AI Chat)
   - [ ] Quick action buttons visible (Explain, Fix, Optimize, etc.)
   - [ ] Input box at bottom
   - [ ] Send and Clear buttons
   - Test: Type "Hello" and press Send
   - Expected: Message appears, AI response (if backend running)

2. **Dashboard**
   - [ ] "Open Web Dashboard" item visible
   - [ ] Click it
   - Expected: Browser opens or webview appears

3. **Gas**
   - [ ] "Optimize Current Contract" visible
   - [ ] "Gas Reports" visible
   - [ ] "Best Practices" visible
   - Test: Click "Optimize Current Contract"
   - Expected: Gas analysis runs

4. **Audit**
   - [ ] "Audit Current Contract" visible
   - [ ] "View Issues" visible
   - [ ] "Security Score" visible
   - Test: Click "Audit Current Contract"
   - Expected: Audit runs

5. **Copilot**
   - [ ] "Ask AI Copilot" visible
   - [ ] Other AI actions listed
   - Test: Click "Ask AI Copilot"
   - Expected: Input dialog appears

6. **Reports**
   - [ ] "Generate New Report" visible
   - [ ] "Recent Reports" visible
   - [ ] "Export Options" visible
   - Test: Click "Generate New Report"
   - Expected: Report generation starts

7. **Settings**
   - [ ] Current API URL shown
   - [ ] Auto Analysis status shown
   - [ ] "Open Settings" button
   - Test: Click "Open Settings"
   - Expected: Settings panel opens

**Test Results:**
```
Sections visible: ___/7
Sections clickable: ___/7
Actions working: ___/7
```

---

### ✅ Phase 5: Context Menu (5 min)

**5.1 Editor Context Menu**

With `TestContract.sol` open:
- **Right-click** anywhere in the editor

**Expected Menu Items:**
```
Cut
Copy
Paste
────────────────────
🛡️ Analyze with MantleGuard
🛡️ Run Audit
⚡ Optimize Gas
🤖 Ask AI
📄 Generate Report
```

**Test Each:**
- [ ] Click "Analyze with MantleGuard" → Analysis runs
- [ ] Click "Run Audit" → Audit runs
- [ ] Click "Optimize Gas" → Gas optimization runs
- [ ] Click "Ask AI" → AI input dialog appears
- [ ] Click "Generate Report" → Report menu appears

**5.2 Explorer Context Menu**

In File Explorer:
- **Right-click** on `TestContract.sol`

**Expected Menu Items:**
```
Open
Reveal in File Explorer
────────────────────
🛡️ Analyze with MantleGuard
🛡️ Run Audit
⚡ Optimize Gas
📄 Generate Report
```

**Test:**
- [ ] All 4 commands visible
- [ ] Commands execute when clicked

**Test Results:**
```
Editor menu items: ___/5
Explorer menu items: ___/4
Commands working: ___/9
```

---

### ✅ Phase 6: CodeLens (5 min)

**6.1 Check Contract-Level CodeLens**

Look above line with `contract VulnerableBank`:

**Expected:**
```
$(file-code) Analyze Contract | $(shield) Security Audit
contract VulnerableBank {
```

**Test:**
- [ ] CodeLens visible above contract
- [ ] Click "Analyze Contract" → Analysis runs
- [ ] Click "Security Audit" → Audit runs

**6.2 Check Function-Level CodeLens**

Look above each function (`deposit`, `withdraw`, `getBalance`):

**Expected (above each function):**
```
$(shield) Analyze | $(dashboard) Optimize | $(robot) Ask AI
function withdraw() public {
```

**Test Each Function:**
- [ ] CodeLens visible above all 3 functions
- [ ] Click "Analyze" on `withdraw()` → Function analysis
- [ ] Click "Optimize" on any function → Optimization suggestions
- [ ] Click "Ask AI" on any function → AI dialog with function context

**Test Results:**
```
Contract CodeLens: ___/1 visible, ___/2 actions working
Function CodeLens: ___/3 visible, ___/9 actions working
```

---

### ✅ Phase 7: Hover Intelligence (3 min)

**7.1 Test Hover**

- Place cursor over the word **"withdraw"** in `function withdraw()`
- Wait 500ms

**Expected Popup:**
```
🛡️ withdraw()

⚡ Gas Score: 🟡 XX/100
🛡️ Security Score: 🔴 XX/100

💡 Optimizations:
- Use unchecked for gas savings
- Cache storage variable in memory
- Use custom errors instead of require

🤖 AI Suggestions:
- Consider adding input validation
- Emit an event after state changes
- Add reentrancy guard

────────────────────
[$(shield) Analyze] | [$(dashboard) Optimize] | [$(robot) Ask AI]
```

**Test:**
- [ ] Hover popup appears
- [ ] Shows gas score
- [ ] Shows security score
- [ ] Shows optimizations
- [ ] Shows AI suggestions
- [ ] Action links clickable

**Test Results:**
```
Hover appears: ___
All sections visible: ___
Actions work: ___
```

---

### ✅ Phase 8: Problems Panel (5 min)

**8.1 Show Sample Diagnostics**

- Press **Ctrl+Shift+P**
- Type: "MantleGuard: Show Sample Diagnostics"
- Press Enter

**8.2 Open Problems Panel**

- Press **Ctrl+Shift+M** (or View > Problems)

**Expected Issues:**
```
TestContract.sol (4)
├─ 🔴 Critical: Reentrancy vulnerability in withdraw()
├─ 🟠 High: Unchecked external call result
├─ 🟡 Medium: State variable could be constant
└─ 🔵 Low: Consider locking pragma version
```

**8.3 Test Navigation**

- [ ] Click "Reentrancy" issue
  - Expected: Editor jumps to line 15, code highlighted
  
- [ ] Click "Unchecked call" issue
  - Expected: Editor jumps to line 23
  
- [ ] Click each issue
  - Expected: Navigation works for all 4

**8.4 Test Quick Fix (if Step 18 integrated)**

- Click an issue in Problems Panel
- Look for lightbulb 💡 icon
- Click lightbulb
- Expected: Quick fix menu appears

**Test Results:**
```
Sample diagnostics: ___/4 visible
Navigation: ___/4 working
Quick fix: ___ (available/not available)
```

---

### ✅ Phase 9: AI Chat (7 min)

**9.1 Open AI Chat**

- Click 🛡️ icon in Activity Bar
- See "Ask MantleGuard" section at top

**9.2 Test Quick Actions**

Click each button:

- [ ] **📖 Explain** 
  - Expected: Message sent, response appears
  
- [ ] **🔧 Fix**
  - Expected: Fix query sent
  
- [ ] **⚡ Optimize**
  - Expected: Optimization query sent
  
- [ ] **📝 Summarize**
  - Expected: Summary query sent
  
- [ ] **🧪 Tests**
  - Expected: Test generation query sent

**9.3 Test Custom Message**

- Type in input: "What does this contract do?"
- Press **Enter** or click **Send**

**Expected:**
- Your message appears
- "🤖 Thinking..." indicator shows
- Response streams character-by-character (if backend running)
- OR: Error message (if backend not running)

**9.4 Test Clear**

- Click **Clear** button
- Expected: All chat history disappears

**Test Results:**
```
Quick actions: ___/5 working
Custom message: ___ sent
Streaming: ___ (working/not working)
Clear: ___ (working/not working)
```

---

### ✅ Phase 10: Status Bar (3 min)

**10.1 Check Initial State**

Look at bottom-right corner:

**Expected:**
```
🛡️ MantleGuard Ready
```

**10.2 Test Status Updates**

Run any command (e.g., "Analyze Contract"):

**Expected States:**
1. **Before:** `🛡️ MantleGuard Ready`
2. **During:** `$(sync~spin) Analyzing...` (animated)
3. **After:** `🛡️ MantleGuard Ready`

**10.3 Test Click**

- Click the status bar item
- Expected: Dashboard opens (webview or browser)

**Test Results:**
```
Initial state: ___
Animated during operation: ___
Returns to ready: ___
Click opens dashboard: ___
```

---

### ✅ Phase 11: Webview Dashboard (5 min)

**11.1 Open Dashboard**

Method 1: Click status bar
Method 2: Command Palette → "Open Dashboard"
Method 3: Sidebar → Dashboard → "Open Web Dashboard"

**11.2 Check Dashboard**

**If backend running (localhost:3000):**
- [ ] Full React dashboard loads in iframe
- [ ] All dashboard features work
- [ ] Theme matches VS Code

**If backend NOT running:**
- [ ] Fallback UI appears
- [ ] Shows error message about connection
- [ ] Shows 4 quick action cards
- [ ] Buttons work (trigger extension commands)

**Test Results:**
```
Dashboard opens: ___
Content loads: ___
Fallback works: ___
```

---

### ✅ Phase 12: Report Generation (10 min)

**12.1 Generate Report**

- Open `TestContract.sol`
- Command Palette → "MantleGuard: Generate Report"
- Wait for analysis (5-10 seconds)

**Expected:**
Export menu appears with 4 options:
```
$(markdown) Export as Markdown
$(json) Export as JSON
$(file-pdf) Export as PDF
$(eye) Preview Report
```

**12.2 Test Preview**

- Select "$(eye) Preview Report"
- Expected: Markdown preview opens in new tab

**Verify Content:**
- [ ] Header with contract name
- [ ] Security score
- [ ] Gas score
- [ ] Executive summary
- [ ] Security findings list
- [ ] Gas suggestions list
- [ ] Recommendations

**12.3 Test Markdown Export**

- Generate report again
- Select "$(markdown) Export as Markdown"
- Choose save location
- Expected: File saved, notification appears

**Verify File:**
- [ ] File created at chosen location
- [ ] Contains all sections
- [ ] Proper markdown formatting
- [ ] Code blocks formatted

**12.4 Test JSON Export**

- Generate report again
- Select "$(json) Export as JSON"
- Choose save location
- Expected: JSON file saved

**Verify File:**
- [ ] Valid JSON structure
- [ ] All data fields present
- [ ] Can be parsed by JSON viewer

**Test Results:**
```
Report generation: ___
Preview: ___
Markdown export: ___
JSON export: ___
PDF export: ___ (if backend available)
```

---

### ✅ Phase 13: Quick Fix (if Step 18 ready)

**13.1 Setup**

- Show sample diagnostics (Ctrl+Shift+P → "Show Sample Diagnostics")
- Open Problems Panel (Ctrl+Shift+M)

**13.2 Test AI Fix**

- Click "Reentrancy" issue
- Look for lightbulb 💡
- Click lightbulb
- Expected: Menu appears

**Menu Options:**
```
🤖 Apply AI Fix (with preview)
🔒 Add ReentrancyGuard
```

- Select "🤖 Apply AI Fix"
- Expected: Diff view opens
- Shows Before ↔ After
- Modal dialog: "Accept" or "Reject"

**Test Accept:**
- Click "Accept"
- Expected: Code updated, notification shown

**Test Reject:**
- Generate issue again
- Click "Reject"
- Expected: No changes, notification shown

**Test Results:**
```
Quick fix available: ___
Diff preview: ___
Accept works: ___
Reject works: ___
```

---

## 📊 Final Test Summary

### Results Tracking

```
Phase 1: Extension Activation          ___/3  ( %)
Phase 2: Test File Creation            ___/3  ( %)
Phase 3: Command Palette              ___/7  ( %)
Phase 4: Activity Bar & Sidebar       ___/7  ( %)
Phase 5: Context Menu                 ___/9  ( %)
Phase 6: CodeLens                    ___/12  ( %)
Phase 7: Hover Intelligence           ___/6  ( %)
Phase 8: Problems Panel               ___/4  ( %)
Phase 9: AI Chat                      ___/8  ( %)
Phase 10: Status Bar                  ___/4  ( %)
Phase 11: Webview Dashboard           ___/3  ( %)
Phase 12: Report Generation           ___/4  ( %)
Phase 13: Quick Fix                   ___/4  ( %)

TOTAL: ___/74 tests passed
```

### Success Criteria

- **🟢 Excellent:** 70-74 tests passed (95%+)
- **🟡 Good:** 60-69 tests passed (80%+)
- **🟠 Fair:** 50-59 tests passed (67%+)
- **🔴 Needs Work:** <50 tests passed

---

## 🐛 Troubleshooting

### Issue: Extension doesn't activate
**Solution:** 
- Check Debug Console (Help → Toggle Developer Tools → Console tab)
- Look for error messages
- Verify compilation: `npm run compile`

### Issue: Commands not appearing
**Solution:**
- Ensure file is saved as `.sol`
- Restart Extension Development Host
- Check activationEvents in package.json

### Issue: Backend connection errors
**Solution:**
- This is expected if backend not running
- Extension shows fallback UI
- Test frontend features work independently

### Issue: CodeLens not showing
**Solution:**
- Save file
- Check language mode (should be "Solidity")
- Verify functions are properly formatted

### Issue: Hover not appearing
**Solution:**
- Hover directly over function name in declaration
- Wait 500ms
- Check console for errors

---

## ✅ Success Criteria

### Minimum Viable Test
- [ ] Extension activates
- [ ] At least 1 command works
- [ ] Sidebar opens
- [ ] Context menu appears
- [ ] CodeLens visible

### Full Feature Test
- [ ] All 13 commands work
- [ ] All 7 sidebar sections functional
- [ ] Context menus in 2 locations
- [ ] CodeLens on contracts and functions
- [ ] Hover shows intelligence
- [ ] Problems Panel integrates
- [ ] AI Chat responsive
- [ ] Status bar updates
- [ ] Dashboard opens
- [ ] Reports generate

---

## 🎉 Testing Complete!

If you've completed this testing guide, you've verified:
- ✅ 19 implementation steps
- ✅ 74+ test scenarios
- ✅ 10 UI integration points
- ✅ 13 commands
- ✅ 11 providers
- ✅ 4 workflows

**Congratulations!** Your MantleGuard extension is fully tested and ready for use!

---

## 📝 Next Steps After Testing

1. **Document Issues** - Note any bugs found
2. **Fix Critical Issues** - Address show-stoppers
3. **Polish UX** - Improve based on testing feedback
4. **Backend Integration** - Connect to real API
5. **User Testing** - Get team feedback
6. **Package** - Create VSIX: `npx vsce package`
7. **Publish** - Submit to marketplace

---

*Happy Testing!* 🧪🚀
