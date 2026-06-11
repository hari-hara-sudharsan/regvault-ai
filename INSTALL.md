# 🎉 MantleGuard Extension - Installation Guide

## ✅ Extension Successfully Packaged!

Your extension has been packaged as: **mantleguard-0.1.0.vsix**

---

## 📦 Installation Methods

### Method 1: Install from VSIX File (Recommended)

#### Option A: Using VS Code UI
1. Open VS Code
2. Go to Extensions panel (`Ctrl+Shift+X`)
3. Click the `...` (three dots) at the top right
4. Select "Install from VSIX..."
5. Browse to `mantleguard-0.1.0.vsix`
6. Click "Install"
7. Reload VS Code when prompted

#### Option B: Using Command Line
```bash
code --install-extension mantleguard-0.1.0.vsix
```

#### Option C: Drag and Drop
1. Open VS Code
2. Drag `mantleguard-0.1.0.vsix` file
3. Drop it onto VS Code window
4. Confirm installation

---

### Method 2: Development Mode (For Testing)

If you want to test/develop:
```bash
cd extension/
code .
# Press F5 to launch Extension Development Host
```

---

## 🚀 After Installation

### 1. Verify Installation
- Open Extensions panel (`Ctrl+Shift+X`)
- Search for "MantleGuard"
- Should show as installed ✅

### 2. Activate Extension
- Open any `.sol` file
- Extension activates automatically
- See 🛡️ icon in Activity Bar (left sidebar)

### 3. Quick Test
```solidity
// Create a file: test.sol
pragma solidity ^0.8.0;

contract Test {
    function hello() public pure returns (string memory) {
        return "Hello MantleGuard!";
    }
}
```

- You should see CodeLens above the `hello()` function
- Click the 🛡️ MantleGuard icon in Activity Bar
- Try commands: `Ctrl+Shift+P` → Type "MantleGuard"

---

## ⚙️ Configuration

### Settings
Open Settings (`Ctrl+,`) and search for "mantleguard":

```json
{
  "mantleguard.apiUrl": "http://localhost:3000",
  "mantleguard.enableAutoAnalysis": true
}
```

### Backend Setup (Required for Full Functionality)
The extension requires the MantleGuard backend to be running:

```bash
# In your project root
cd apps/web
npm run dev
# Backend should run at http://localhost:3000
```

---

## 🎯 Features to Test

After installation, test these features:

### ✅ Activity Bar
- Click 🛡️ MantleGuard icon
- See 7 views: AI Chat, Dashboard, Gas, Audit, Copilot, Reports, Settings

### ✅ Command Palette
- Press `Ctrl+Shift+P`
- Type "MantleGuard"
- See 6 commands

### ✅ Context Menu
- Right-click on `.sol` file
- See 5 MantleGuard options

### ✅ CodeLens
- Open `.sol` file
- See inline actions above functions
- Click: Analyze | Optimize | Ask AI

### ✅ Hover
- Hover over function names
- See Gas Score & Security Score popup

### ✅ Problems Panel
- Run: `Ctrl+Shift+P` → "MantleGuard: Show Sample Diagnostics"
- Open Problems: `Ctrl+Shift+M`
- Click issues to navigate

### ✅ AI Chat
- Click "Ask MantleGuard" in Activity Bar
- Type questions about your contracts

### ✅ Status Bar
- Look at bottom right
- See: 🛡 MantleGuard Ready

### ✅ Quick Fix
- Click on red squiggly lines
- See lightbulb 💡
- Apply AI fixes with preview

### ✅ Generate Reports
- Right-click `.sol` file
- Select "Generate Report"
- Choose format: Markdown, JSON, or PDF

---

## 🐛 Troubleshooting

### Extension Not Activating
**Solution:** Open a `.sol` file (Solidity contract)

### Commands Not Showing
**Solution:** 
- Check if .sol file is open
- Reload window: `Ctrl+Shift+P` → "Reload Window"

### Backend Connection Errors
**Solution:**
- Ensure backend is running at http://localhost:3000
- Check settings: `mantleguard.apiUrl`

### Features Not Working
**Solution:**
- View Output panel: View → Output → Select "MantleGuard"
- Check for error messages

---

## 📋 Complete Testing Checklist

Follow these guides for comprehensive testing:

1. **Quick Test (5 min):** `QUICK_REFERENCE.md`
2. **Full Test (2 hours):** `LOCAL_TESTING_GUIDE.md`
3. **Test Checklist:** `TEST_CHECKLIST.md`

---

## 🔄 Uninstall

If you need to uninstall:

1. Open Extensions panel (`Ctrl+Shift+X`)
2. Search for "MantleGuard"
3. Click gear icon ⚙️
4. Select "Uninstall"
5. Reload VS Code

Or via command line:
```bash
code --uninstall-extension mantleguard.mantleguard
```

---

## 🔄 Update/Reinstall

To install a new version:

1. Uninstall current version (see above)
2. Install new `.vsix` file
3. Reload VS Code

Or simply install over the existing version - VS Code will update it.

---

## 📦 Package Details

**File:** `mantleguard-0.1.0.vsix`  
**Size:** ~131 KB  
**Files:** 58 files included  
**Version:** 0.1.0  
**VS Code Required:** ^1.120.0  

### What's Included:
- ✅ All source code (compiled)
- ✅ 20+ documentation files
- ✅ Test sample contracts
- ✅ Configuration files
- ✅ Media assets

---

## 🎓 Next Steps

After installation:

1. **Read:** `START_HERE.md` for overview
2. **Test:** Use `TEST_SAMPLE.sol` for quick tests
3. **Learn:** Check `QUICK_REFERENCE.md` for commands
4. **Explore:** Read full docs in extension folder

---

## ✅ Verification

Extension is working correctly if you see:

- ✅ 🛡️ icon in Activity Bar
- ✅ Commands in Command Palette
- ✅ Context menu options on .sol files
- ✅ CodeLens above functions
- ✅ Status bar shows "MantleGuard Ready"
- ✅ Hover tooltips work
- ✅ AI Chat loads in sidebar

---

## 🎉 You're All Set!

Your MantleGuard extension is ready to use!

**Enjoy secure smart contract development!** 🛡️

---

## 📞 Support

- **Documentation:** See extension folder for 20+ guides
- **Issues:** Check Output panel (View → Output → MantleGuard)
- **Testing:** Follow `LOCAL_TESTING_GUIDE.md`

---

*MantleGuard - Securing smart contracts, one line at a time* 🛡️
