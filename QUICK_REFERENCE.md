# 🚀 MantleGuard Extension - Quick Reference Card

## ⚡ 30-Second Start

```bash
cd extension/
code .
# Press F5
# Open TEST_SAMPLE.sol
# Done! 🎉
```

---

## 🎯 Key Features at a Glance

| Feature | Access Method | Shortcut |
|---------|--------------|----------|
| **Activity Bar** | Click 🛡️ icon on left | - |
| **Command Palette** | Type "MantleGuard" | `Ctrl+Shift+P` |
| **Context Menu** | Right-click .sol file | - |
| **CodeLens** | Above functions | Auto-appears |
| **Hover** | Hover function name | - |
| **AI Chat** | Activity Bar > Ask | - |
| **Status Bar** | Bottom right | Click to open |
| **Problems** | View > Problems | `Ctrl+Shift+M` |
| **Quick Fix** | Click lightbulb 💡 | `Ctrl+.` |
| **Report** | Command > Generate Report | - |

---

## 📋 Commands Cheat Sheet

```
Ctrl+Shift+P then type:

MantleGuard: Analyze Contract      → Full analysis
MantleGuard: Audit Contract        → Security scan
MantleGuard: Optimize Gas          → Gas optimization
MantleGuard: AI Copilot            → AI help
MantleGuard: Generate Report       → Export report
MantleGuard: Open Dashboard        → Dashboard view
```

---

## 🎨 UI Elements

```
Activity Bar (Left)
├── 🛡️ MantleGuard
│   ├── 💬 Ask MantleGuard (AI Chat)
│   ├── 🏠 Dashboard
│   ├── ⚡ Gas
│   ├── 🛡️ Audit
│   ├── 🤖 Copilot
│   ├── 📄 Reports
│   └── ⚙️ Settings

Editor (Top of functions)
├── 🛡 Analyze
├── ⚡ Optimize
└── 🤖 Ask AI

Status Bar (Bottom Right)
└── 🛡 MantleGuard Ready
```

---

## 🔧 Settings

```json
{
  "mantleguard.apiUrl": "http://localhost:3000",
  "mantleguard.enableAutoAnalysis": true
}
```

**Access:** File > Preferences > Settings > Search "mantleguard"

---

## 🧪 Quick Test (2 minutes)

### 1. Launch Extension
- Open `extension/` folder in VS Code
- Press **F5**
- New window opens

### 2. Open Test File
- Open `TEST_SAMPLE.sol`
- See CodeLens above functions ✅

### 3. Test Commands
- **Command Palette:** `Ctrl+Shift+P` → Type "MantleGuard"
- **Right-Click:** On .sol file → See 5 commands
- **CodeLens:** Click "🛡 Analyze" above a function
- **Hover:** Hover over "withdraw" function name

### 4. Test Views
- **Activity Bar:** Click 🛡️ icon
- **AI Chat:** Type "Explain this contract"
- **Status Bar:** See "🛡 MantleGuard Ready" at bottom

### 5. Test Diagnostics
- `Ctrl+Shift+P` → "Show Sample Diagnostics"
- `Ctrl+Shift+M` → View Problems Panel
- Click issue → Jump to code ✅

### 6. Test Quick Fix
- Click red squiggly line
- Click lightbulb 💡
- See "Apply AI Fix"
- Preview diff → Accept/Reject

### 7. Test Report
- Right-click `TEST_SAMPLE.sol`
- "Generate Report"
- Choose Markdown
- Preview opens ✅

---

## 🐛 Troubleshooting Fast

| Problem | Solution |
|---------|----------|
| Extension not activating | Open a .sol file |
| Commands not showing | Reload window: `Ctrl+Shift+P` > "Reload Window" |
| Backend error | Start backend: `cd apps/web && npm run dev` |
| CodeLens missing | Save file or reload |
| Hover not working | Clear cache: Command > "Clear Hover Cache" |

---

## 📱 Contact & Support

- **Output Panel:** View > Output > Select "MantleGuard"
- **Problems Panel:** `Ctrl+Shift+M`
- **Developer Tools:** Help > Toggle Developer Tools

---

## 🎯 Test Checklist

Quick validation in 5 minutes:

- [ ] Extension activates (see notification)
- [ ] Activity bar shows icon
- [ ] Commands appear in palette
- [ ] Right-click shows menu
- [ ] CodeLens appears
- [ ] Hover shows popup
- [ ] AI Chat loads
- [ ] Status bar shows "Ready"
- [ ] Problems panel works
- [ ] Quick fix available
- [ ] Report generates

**All checked?** You're ready to go! 🚀

---

## 📚 Documentation

| Doc | Purpose | Time |
|-----|---------|------|
| **READY_TO_TEST.md** | Quick start | 5 min |
| **LOCAL_TESTING_GUIDE.md** | Full testing | 2 hours |
| **FINAL_STATUS.md** | Complete status | 10 min |
| **ARCHITECTURE.md** | System design | 20 min |

---

## 🎓 Tips & Tricks

### Keyboard Shortcuts
- `Ctrl+Shift+P` - Command Palette
- `Ctrl+Shift+M` - Problems Panel
- `Ctrl+.` - Quick Fix
- `F5` - Launch Extension Dev

### Productivity Hacks
1. **Auto-analysis on save** - Enabled by default
2. **Hover for quick info** - No need to run commands
3. **CodeLens for function-level** - Click inline actions
4. **AI Chat for questions** - Faster than web search
5. **Reports for documentation** - Export & share

### Development Tips
- Watch mode: `npm run watch`
- Reload: `Ctrl+R` in Extension Host
- Logs: Output panel > MantleGuard
- Debug: Set breakpoints in .ts files

---

## 🏆 Success Metrics

After testing, you should see:
- ✅ 0 compilation errors
- ✅ All commands working
- ✅ All providers active
- ✅ Backend connected
- ✅ UI responsive
- ✅ No console errors

---

## 🎉 You're All Set!

**Press F5 and start testing!** 🚀

For detailed testing: See `LOCAL_TESTING_GUIDE.md`  
For full documentation: See `FINAL_STATUS.md`

---

*MantleGuard - Your AI-Powered Solidity Assistant* 🛡️
