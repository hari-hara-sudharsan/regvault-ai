# 🧪 Complete Testing Guide - All Features

## 🚀 Quick Start (Press F5)

```bash
cd extension
code .
# Press F5 in VS Code
```

---

## 📝 Test Script (Follow in Order)

### Preparation

1. **Launch Extension Development Host**
   - Press **F5**
   - New VS Code window opens

2. **Create Test File** (`VulnerableBank.sol`):
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

---

## Test 1: Status Bar (STEP 12)

### Test 1.1: Ready State
**Expected:** Bottom-right shows "🛡️ MantleGuard Ready"

✅ **Result:** _______

### Test 1.2: Click Status Bar
**Action:** Click "🛡️ MantleGuard Ready"
**Expected:** Dashboard opens in browser

✅ **Result:** _______

### Test 1.3: Analyzing State
**Action:** Run any command (Ctrl+Shift+P → "Analyze Contract")
**Expected:** Status changes to animated "$(sync~spin) Analyzing..."

✅ **Result:** _______

---

## Test 2: Activity Bar & AI Chat (STEP 11)

### Test 2.1: Activity Bar Icon
**Action:** Look for shield icon in left sidebar
**Expected:** MantleGuard icon visible

✅ **Result:** _______

### Test 2.2: Open Sidebar
**Action:** Click shield icon
**Expected:** 7 sections appear:
1. Ask MantleGuard (AI Chat)
2. Dashboard
3. Gas
4. Audit
5. Copilot
6. Reports
7. Settings

✅ **Result:** _______

### Test 2.3: AI Chat - Example Buttons
**Action:** In "Ask MantleGuard" section, click **"📖 Explain"**
**Expected:**
- Message "Explain this contract" appears
- AI response streams character-by-character
- Response completes

✅ **Result:** _______

### Test 2.4: AI Chat - Custom Message
**Action:**
1. Type: "What vulnerabilities exist?"
2. Press **Enter**

**Expected:**
- Your message appears
- "🤖 Thinking..." indicator shows
- AI response streams in
- Response completes

✅ **Result:** _______

### Test 2.5: AI Chat - Clear History
**Action:** Click **"Clear"** button
**Expected:** All chat history disappears

✅ **Result:** _______

---

## Test 3: Context Menu (STEP 7)

### Test 3.1: Editor Context Menu
**Action:**
1. Right-click anywhere in `VulnerableBank.sol`
2. Look for MantleGuard commands

**Expected:** See 5 commands:
- 🛡️ Analyze with MantleGuard
- 🛡️ Run Audit
- ⚡ Optimize Gas
- 🤖 Ask AI
- 📄 Generate Report

✅ **Result:** _______

### Test 3.2: Explorer Context Menu
**Action:**
1. In File Explorer, right-click `VulnerableBank.sol`
2. Look for MantleGuard commands

**Expected:** See 4 commands

✅ **Result:** _______

---

## Test 4: CodeLens (STEP 8)

### Test 4.1: Contract CodeLens
**Action:** Look above line 5 (`contract VulnerableBank`)

**Expected:** See inline actions:
```
$(file-code) Analyze Contract | $(shield) Security Audit
```

✅ **Result:** _______

### Test 4.2: Function CodeLens
**Action:** Look above each function (lines 8, 12, 18)

**Expected:** See inline actions above each:
```
$(shield) Analyze | $(dashboard) Optimize | $(robot) Ask AI
```

✅ **Result:** _______

### Test 4.3: Click CodeLens
**Action:** Click **"$(shield) Analyze"** above `withdraw()` function

**Expected:**
- Status bar shows "Analyzing Function..."
- Progress notification appears
- Output Channel shows results
- Status returns to "Ready"

✅ **Result:** _______

---

## Test 5: Hover Intelligence (STEP 10)

### Test 5.1: Hover Over Function
**Action:**
1. Place cursor over the word **"withdraw"** on line 12
2. Wait 500ms

**Expected:** Popup shows:
```
🛡️ withdraw()

⚡ Gas Score: 🟡 XX/100
🛡️ Security Score: 🔴 XX/100

💡 Optimizations:
- Use unchecked for gas savings
- Cache storage variable in memory
- Use custom errors instead of require strings

🤖 AI Suggestions:
- Consider adding input validation
- Emit an event after state changes
- Add reentrancy guard

────────────────────────
[Analyze] | [Optimize] | [Ask AI]
```

✅ **Result:** _______

### Test 5.2: Hover Over Different Function
**Action:** Hover over **"deposit"** on line 8

**Expected:** Different scores/suggestions appear

✅ **Result:** _______

### Test 5.3: Click Hover Action
**Action:** In hover popup, click **"[Optimize]"**

**Expected:** Optimization command executes

✅ **Result:** _______

---

## Test 6: Problems Panel (STEP 9)

### Test 6.1: Show Sample Diagnostics
**Action:**
1. Press **Ctrl+Shift+P**
2. Type: "MantleGuard: Show Sample Diagnostics"
3. Press Enter

**Expected:** Notification says "Sample diagnostics added to Problems panel"

✅ **Result:** _______

### Test 6.2: View Problems Panel
**Action:** Press **Ctrl+Shift+M** (or View > Problems)

**Expected:** See 4 issues:
```
VulnerableBank.sol
├─ 🔴 Critical: Reentrancy vulnerability in withdraw()
├─ 🟠 High: Unchecked external call result
├─ 🟡 Medium: State variable could be constant
└─ 🔵 Low: Consider locking pragma version
```

✅ **Result:** _______

### Test 6.3: Navigate to Issue
**Action:** Click on **"Reentrancy vulnerability"** issue

**Expected:**
- Editor jumps to line 15
- Line is highlighted
- Cursor at issue location

✅ **Result:** _______

### Test 6.4: Navigate to Each Issue
**Action:** Click each of the 4 issues

**Expected:** Each click navigates to correct line

✅ **Result:** _______

### Test 6.5: Clear Diagnostics
**Action:**
1. Press **Ctrl+Shift+P**
2. Type: "MantleGuard: Clear Diagnostics"
3. Press Enter

**Expected:** Problems Panel clears

✅ **Result:** _______

---

## Test 7: Command Palette

### Test 7.1: List Commands
**Action:**
1. Press **Ctrl+Shift+P**
2. Type: "MantleGuard"

**Expected:** See all commands:
- Analyze Contract
- Audit Contract
- Optimize Gas
- AI Copilot
- Generate Report
- Open Dashboard
- Show Sample Diagnostics
- Clear Diagnostics
- Refresh CodeLens
- Clear Hover Cache

✅ **Result:** _______

### Test 7.2: Execute Command
**Action:** Select "MantleGuard: Audit Contract"

**Expected:**
- Status bar: "$(sync~spin) Auditing..."
- Progress notification
- Output Channel shows results
- Status returns to "Ready"

✅ **Result:** _______

---

## Test 8: Integration Test (All Features Together)

### Scenario: Full Analysis Workflow

1. **Open file** `VulnerableBank.sol`
2. **Status Bar** should show "🛡️ MantleGuard Ready"
3. **Right-click** in editor → Select "Run Audit"
4. **Status Bar** animates to "Auditing..."
5. **Wait for completion**
6. **Status Bar** returns to "Ready"
7. **Open Problems Panel** (Ctrl+Shift+M)
8. **Click first issue** → Navigates to code
9. **Hover over function** → See intelligence popup
10. **Click CodeLens "Optimize"** → See optimization
11. **Open AI Chat** → Ask "How to fix this?"
12. **Watch streaming response**

**Expected:** All features work seamlessly together

✅ **Result:** _______

---

## Test 9: Edge Cases

### Test 9.1: Non-Solidity File
**Action:**
1. Create `test.js`
2. Right-click in editor

**Expected:** No MantleGuard commands appear

✅ **Result:** _______

### Test 9.2: Empty Solidity File
**Action:**
1. Create empty `Empty.sol`
2. Check for CodeLens

**Expected:** No CodeLens (no functions detected)

✅ **Result:** _______

### Test 9.3: Multiple Functions
**Action:** Verify CodeLens appears above ALL functions

**Expected:** 3 actions per function, 2 per contract

✅ **Result:** _______

---

## Test 10: Performance

### Test 10.1: Hover Response Time
**Action:** Hover over function, measure time to popup

**Expected:** < 1 second

✅ **Result:** _______

### Test 10.2: AI Chat Response
**Action:** Send message, watch streaming

**Expected:** Starts streaming within 2 seconds

✅ **Result:** _______

### Test 10.3: Status Bar Animation
**Action:** Watch status bar during operation

**Expected:** Smooth animation, no flickering

✅ **Result:** _______

---

## 📊 Final Checklist

| Feature | Test | Status |
|---------|------|--------|
| Status Bar - Ready | Test 1.1 | ☐ |
| Status Bar - Click | Test 1.2 | ☐ |
| Status Bar - Analyzing | Test 1.3 | ☐ |
| Activity Bar Icon | Test 2.1 | ☐ |
| AI Chat - Examples | Test 2.3 | ☐ |
| AI Chat - Custom | Test 2.4 | ☐ |
| AI Chat - Clear | Test 2.5 | ☐ |
| Context Menu - Editor | Test 3.1 | ☐ |
| Context Menu - Explorer | Test 3.2 | ☐ |
| CodeLens - Contract | Test 4.1 | ☐ |
| CodeLens - Function | Test 4.2 | ☐ |
| CodeLens - Click | Test 4.3 | ☐ |
| Hover - Function | Test 5.1 | ☐ |
| Hover - Different | Test 5.2 | ☐ |
| Hover - Action | Test 5.3 | ☐ |
| Problems - Show | Test 6.1 | ☐ |
| Problems - View | Test 6.2 | ☐ |
| Problems - Navigate | Test 6.3 | ☐ |
| Problems - Clear | Test 6.5 | ☐ |
| Commands - List | Test 7.1 | ☐ |
| Commands - Execute | Test 7.2 | ☐ |
| Integration Test | Test 8 | ☐ |

---

## ✅ Success Criteria

**ALL features pass when:**
- ✅ Status bar updates correctly (3/3 states)
- ✅ AI Chat works with streaming (3/3 tests)
- ✅ Context menus appear (2/2 locations)
- ✅ CodeLens displays and executes (3/3 tests)
- ✅ Hover shows intelligence (3/3 tests)
- ✅ Problems Panel navigates (4/5 tests)
- ✅ Commands execute (2/2 tests)
- ✅ Integration test passes
- ✅ Edge cases handled correctly
- ✅ Performance acceptable

**Total: 23 Tests**

---

## 🐛 Troubleshooting

### Issue: CodeLens not appearing
**Solution:** Save file as `.sol`, ensure it has functions

### Issue: Hover not showing
**Solution:** Hover directly over function name in declaration line

### Issue: AI Chat not in sidebar
**Solution:** Click MantleGuard shield icon to open sidebar

### Issue: Status bar not visible
**Solution:** Check bottom-right corner, may be hidden by other extensions

### Issue: Problems Panel empty
**Solution:** Run "Show Sample Diagnostics" command first

---

## 🎉 Test Complete!

If all tests pass (23/23), the extension is **production-ready**!

**Next Steps:**
1. Connect to real backend API
2. User acceptance testing
3. Package: `npx vsce package`
4. Publish to VS Code Marketplace

**Congratulations!** 🚀
