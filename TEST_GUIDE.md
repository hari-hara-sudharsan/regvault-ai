# 🧪 MantleGuard Extension - Complete Testing Guide

## 🚀 Quick Start Testing (5 Minutes)

### Step 1: Launch Extension Development Host

```bash
cd extension
code .
```

Press **F5** (or Run > Start Debugging)

A new VS Code window opens with the extension loaded.

---

## 📝 Test Scenario 1: Context Menu (Right-Click)

### Test 1A: Editor Context Menu

1. In Extension Development Host, create `MyToken.sol`:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyToken {
    uint256 public totalSupply;
    
    function mint(address to, uint256 amount) public {
        totalSupply += amount;
    }
}
```

2. **Right-click** anywhere in the editor

3. **Expected Result**: You should see:
   ```
   ✅ 🛡️ Analyze with MantleGuard
   ✅ 🛡️ Run Audit
   ✅ ⚡ Optimize Gas
   ✅ 🤖 Ask AI
   ✅ 📄 Generate Report
   ```

4. Click **"🛡️ Analyze with MantleGuard"**
   - Progress notification appears
   - Output channel shows results

### Test 1B: Explorer Context Menu

1. In File Explorer sidebar, find `MyToken.sol`
2. **Right-click** on the file name
3. **Expected Result**: Same MantleGuard commands appear
4. Click **"⚡ Optimize Gas"**

**✅ PASS CRITERIA**: 
- Commands appear only for `.sol` files
- Commands are grouped together
- Clicking executes the command

---

## 💡 Test Scenario 2: CodeLens (Inline Actions)

### Test 2A: Function CodeLens

1. Open `MyToken.sol`
2. Look **above** the `mint` function (line 7)

3. **Expected Result**: You should see inline text:
   ```
   $(shield) Analyze | $(dashboard) Optimize | $(robot) Ask AI
   function mint(address to, uint256 amount) public {
   ```

4. Click **"$(shield) Analyze"**
   - Progress notification appears
   - Analysis runs for just the `mint()` function
   - Results open in new document

### Test 2B: Contract CodeLens

1. Look **above** the `contract MyToken` line (line 4)

2. **Expected Result**: You should see:
   ```
   $(file-code) Analyze Contract | $(shield) Security Audit
   contract MyToken {
   ```

3. Click **"$(shield) Security Audit"**
   - Full security audit runs

### Test 2C: Multiple Functions

Add another function:
```solidity
function transfer(address to, uint256 amount) public {
    totalSupply -= amount;
}
```

**Expected Result**: 
- CodeLens appears above BOTH functions
- Each function has 3 separate actions
- Contract still has 2 actions

**✅ PASS CRITERIA**:
- CodeLens appears above functions
- CodeLens appears above contracts
- Clicking executes function-specific analysis
- CodeLens refreshes when you edit code

---

## 🔴 Test Scenario 3: Problems Panel (Diagnostics)

### Test 3A: Show Sample Diagnostics

1. Open `MyToken.sol`
2. Press **Ctrl+Shift+P** (Cmd+Shift+P on Mac)
3. Type: `MantleGuard: Show Sample`
4. Select **"MantleGuard: Show Sample Diagnostics"**

5. **Expected Result**: Notification says "Sample diagnostics added to Problems panel"

### Test 3B: View Problems Panel

1. Press **Ctrl+Shift+M** (Cmd+Shift+M on Mac)
   - OR: View > Problems

2. **Expected Result**: You should see 4 issues:
   ```
   MyToken.sol
   ├─ 🔴 Critical: Reentrancy vulnerability in withdraw()
   ├─ 🟠 High: Unchecked external call result  
   ├─ 🟡 Medium: State variable could be constant
   └─ 🔵 Low: Consider locking pragma version
   ```

### Test 3C: Click-to-Navigate

1. In Problems Panel, click the **"Reentrancy"** issue

2. **Expected Result**:
   - Editor jumps to line 15
   - Line is highlighted
   - Cursor moves to the issue location

3. Click each other issue - each should jump to its respective line

### Test 3D: Clear Diagnostics

1. Press **Ctrl+Shift+P**
2. Type: `MantleGuard: Clear Diagnostics`
3. Press Enter

**Expected Result**: Problems Panel clears

**✅ PASS CRITERIA**:
- Sample diagnostics appear in Problems Panel
- Issues show correct severity colors
- Clicking navigates to exact line
- Issues can be cleared

---

## 🎯 Test Scenario 4: Integration Test

### Full Workflow Test

1. **Create vulnerable contract**:
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

2. **Test CodeLens**:
   - See actions above `contract`
   - See actions above both functions
   - Click "Analyze" on `withdraw()`

3. **Test Context Menu**:
   - Right-click → Select "Run Audit"

4. **Test Diagnostics**:
   - Show sample diagnostics
   - Navigate to issues in Problems Panel

5. **Test Activity Bar**:
   - Click shield icon in left sidebar
   - Explore all 6 sections
   - Click "Audit Current Contract" in Audit section

6. **Test Status Bar**:
   - Click "$(shield) MantleGuard" in bottom-right
   - Dashboard should open

**✅ PASS CRITERIA**: All features work together seamlessly

---

## 🛠️ Test Scenario 5: Edge Cases

### Test 5A: Non-Solidity Files

1. Create `test.js` (JavaScript file)
2. Right-click in editor

**Expected Result**: MantleGuard commands should NOT appear

### Test 5B: Empty Solidity File

1. Create `Empty.sol` with just:
```solidity
// Empty file
```

2. Check for CodeLens

**Expected Result**: No CodeLens (no functions/contracts detected)

### Test 5C: Multiple Contracts

```solidity
contract A {
    function funcA() public {}
}

contract B {
    function funcB() public {}
}
```

**Expected Result**: 
- 2 contract-level CodeLens (one per contract)
- 2 function-level CodeLens (one per function)

**✅ PASS CRITERIA**: Extension handles edge cases gracefully

---

## 📊 Checklist

Use this checklist while testing:

### Context Menu
- [ ] Editor right-click shows 5 commands
- [ ] Explorer right-click shows 4 commands
- [ ] Commands only appear for `.sol` files
- [ ] Commands execute when clicked

### CodeLens
- [ ] Function CodeLens shows 3 actions
- [ ] Contract CodeLens shows 2 actions
- [ ] Multiple functions = multiple CodeLens
- [ ] CodeLens updates on edit
- [ ] Actions execute function-specific analysis

### Problems Panel
- [ ] Sample diagnostics appear
- [ ] 4 severity levels display correctly
- [ ] Clicking navigates to line
- [ ] Issues show in correct format
- [ ] Diagnostics can be cleared

### General
- [ ] Extension activates on `.sol` files
- [ ] Status bar shows shield icon
- [ ] Activity bar shows MantleGuard icon
- [ ] No errors in Debug Console
- [ ] All commands in Command Palette work

---

## 🐛 Troubleshooting

### CodeLens Not Appearing
- **Solution**: Ensure file is saved as `.sol`
- **Check**: `editor.codeLens` setting is not disabled

### Context Menu Missing
- **Solution**: Verify file extension is `.sol`
- **Check**: Right-click inside editor, not in margin

### Diagnostics Not Showing
- **Solution**: Open Problems Panel (Ctrl+Shift+M)
- **Check**: Run "Show Sample Diagnostics" command first

### Commands Not Working
- **Solution**: Check Debug Console for errors (Help > Toggle Developer Tools)
- **Check**: Backend API might not be running (expected during development)

---

## ✅ Success Criteria

All features pass when:
1. ✅ Context menus appear and execute
2. ✅ CodeLens displays inline actions
3. ✅ Problems Panel shows and navigates to issues
4. ✅ No errors in Debug Console
5. ✅ All commands complete successfully

---

## 🎉 Test Complete!

If all tests pass, the extension is ready for:
- ✅ Backend integration
- ✅ User testing
- ✅ Production deployment

**Next Steps**:
1. Connect to real backend API
2. Test with real contract analysis
3. Package extension: `npx vsce package`
4. Publish to marketplace!
