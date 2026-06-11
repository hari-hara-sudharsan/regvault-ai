# MantleGuard VS Code Extension - Quick Start Guide

## ✅ Setup Complete

Your MantleGuard VS Code extension is now fully configured!

## 📋 What's Included

### Commands (Command Palette - Ctrl+Shift+P)
- ✅ **MantleGuard: Analyze Contract** - Full contract analysis
- ✅ **MantleGuard: Audit Contract** - Security audit
- ✅ **MantleGuard: Optimize Gas** - Gas optimization suggestions
- ✅ **MantleGuard: AI Copilot** - AI-powered assistance
- ✅ **MantleGuard: Generate Report** - Create comprehensive reports
- ✅ **MantleGuard: Open Dashboard** - Launch web dashboard

### Activity Bar (Sidebar)
Click the MantleGuard shield icon to access:
- 🏠 **Dashboard** - Quick access to web dashboard
- ⚡ **Gas** - Gas analysis tools
- 🛡️ **Audit** - Security audit features
- 🤖 **Copilot** - AI assistance
- 📄 **Reports** - Report management
- ⚙️ **Settings** - Extension configuration

### Features
- ✅ Status bar integration (bottom-right corner)
- ✅ Auto-analysis on save (configurable)
- ✅ Solidity language support
- ✅ API integration with MantleGuard backend

## 🚀 Testing the Extension

### Method 1: Press F5
1. Open the `extension` folder in VS Code
2. Press **F5** to launch Extension Development Host
3. A new VS Code window opens with the extension loaded

### Method 2: Run and Debug
1. Click **Run and Debug** in the left sidebar
2. Select **Run Extension**
3. Click the green play button

## 🧪 Test Commands

In the Extension Development Host window:

1. **Open a Solidity file** (create a test .sol file)
2. **Open Command Palette** (Ctrl+Shift+P / Cmd+Shift+P)
3. **Type "MantleGuard"** to see all available commands
4. **Click the shield icon** in the Activity Bar to see the sidebar

## ⚙️ Configuration

Access settings via:
- Command Palette → "Preferences: Open Settings"
- Search for "mantleguard"

Available settings:
- `mantleguard.apiUrl` - Backend API URL (default: http://localhost:3000)
- `mantleguard.enableAutoAnalysis` - Auto-analyze on save (default: true)

## 📂 Project Structure

```
extension/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── commands/              # Command implementations
│   │   ├── analyzeContract.ts
│   │   ├── auditContract.ts
│   │   ├── optimizeGas.ts
│   │   ├── aiCopilot.ts
│   │   ├── generateReport.ts
│   │   └── openDashboard.ts
│   ├── providers/             # View providers for sidebar
│   │   ├── dashboardViewProvider.ts
│   │   ├── gasViewProvider.ts
│   │   ├── auditViewProvider.ts
│   │   ├── copilotViewProvider.ts
│   │   ├── reportsViewProvider.ts
│   │   └── settingsViewProvider.ts
│   └── services/              # API services
│       └── apiService.ts
├── media/                     # Icons and assets
├── package.json              # Extension manifest
└── tsconfig.json             # TypeScript config
```

## 🔧 Development Commands

```bash
# Compile TypeScript
npm run compile

# Watch mode (auto-compile on changes)
npm run watch

# Lint code
npm run lint

# Format code
npx prettier --write src/**/*.ts
```

## 🌐 Backend Integration

The extension expects a MantleGuard backend at `http://localhost:3000` with these endpoints:

- `POST /api/analyze` - Contract analysis
- `POST /api/audit` - Security audit
- `POST /api/gas/optimize` - Gas optimization
- `POST /api/copilot` - AI Copilot
- `POST /api/reports/generate` - Generate reports
- `GET /api/reports` - List reports

## 📦 Next Steps

1. **Start your backend** (if not already running)
2. **Test the extension** (Press F5)
3. **Customize commands** in `src/commands/`
4. **Add features** to providers in `src/providers/`
5. **Package extension**: `npx vsce package`

## 🐛 Debugging

- Check **Developer Tools** in Extension Host (Help → Toggle Developer Tools)
- View **Debug Console** in main VS Code window
- Add breakpoints in TypeScript files

## 📝 Publishing (When Ready)

```bash
# Install vsce
npm install -g @vscode/vsce

# Package extension
vsce package

# Publish to marketplace
vsce publish
```

## 🎉 Success!

Your MantleGuard extension is ready to use! Press **F5** to start testing.

For questions, check the [VS Code Extension API docs](https://code.visualstudio.com/api).
