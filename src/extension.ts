import * as vscode from 'vscode';
import * as commands from './commands';
import {
    DashboardViewProvider,
    GasViewProvider,
    AuditViewProvider,
    CopilotViewProvider,
    ReportsViewProvider,
    SettingsViewProvider,
    MantleGuardCodeLensProvider,
    MantleGuardDiagnosticsProvider,
    MantleGuardHoverProvider,
    AIChatViewProvider,
    QuickFixProvider,
} from './providers';
import { StatusBarManager } from './utils/statusBarManager';

export function activate(context: vscode.ExtensionContext) {
    console.log('MantleGuard extension is now active');

    // Initialize Status Bar Manager
    const statusBarManager = StatusBarManager.getInstance();

    // Register View Providers for Activity Bar
    const dashboardProvider = new DashboardViewProvider();
    const gasProvider = new GasViewProvider();
    const auditProvider = new AuditViewProvider();
    const copilotProvider = new CopilotViewProvider();
    const reportsProvider = new ReportsViewProvider();
    const settingsProvider = new SettingsViewProvider();

    vscode.window.registerTreeDataProvider('mantleguard.dashboard', dashboardProvider);
    vscode.window.registerTreeDataProvider('mantleguard.gas', gasProvider);
    vscode.window.registerTreeDataProvider('mantleguard.audit', auditProvider);
    vscode.window.registerTreeDataProvider('mantleguard.copilot', copilotProvider);
    vscode.window.registerTreeDataProvider('mantleguard.reports', reportsProvider);
    vscode.window.registerTreeDataProvider('mantleguard.settings', settingsProvider);

    // Register AI Chat Webview Provider
    const aiChatProvider = new AIChatViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            AIChatViewProvider.viewType,
            aiChatProvider
        )
    );

    // Register CodeLens Provider
    const codeLensProvider = new MantleGuardCodeLensProvider();
    const codeLensDisposable = vscode.languages.registerCodeLensProvider(
        { language: 'solidity', scheme: 'file' },
        codeLensProvider
    );

    // Register Diagnostics Provider
    const diagnosticsProvider = new MantleGuardDiagnosticsProvider();

    // Register Hover Provider
    const hoverProvider = new MantleGuardHoverProvider();
    const hoverDisposable = vscode.languages.registerHoverProvider(
        { language: 'solidity', scheme: 'file' },
        hoverProvider
    );

    // Register Quick Fix Provider (Code Actions)
    const quickFixProvider = new QuickFixProvider();
    const quickFixDisposable = vscode.languages.registerCodeActionsProvider(
        { language: 'solidity', scheme: 'file' },
        quickFixProvider,
        {
            providedCodeActionKinds: QuickFixProvider.providedCodeActionKinds
        }
    );

    // Wrap commands with status bar updates
    const wrapCommandWithStatus = (
        commandFn: Function,
        operationName: string
    ) => {
        return async (...args: any[]) => {
            try {
                statusBarManager.setAnalyzing(`${operationName}...`);
                await commandFn(...args);
                statusBarManager.setReady();
            } catch (error) {
                statusBarManager.setError(`${operationName} failed`);
                throw error;
            }
        };
    };

    // Register Commands with status bar integration
    const analyzeContractCmd = vscode.commands.registerCommand(
        'mantleguard.analyzeContract',
        wrapCommandWithStatus(commands.analyzeContract, 'Analyzing')
    );

    const auditContractCmd = vscode.commands.registerCommand(
        'mantleguard.auditContract',
        wrapCommandWithStatus(commands.auditContract, 'Auditing')
    );

    const optimizeGasCmd = vscode.commands.registerCommand(
        'mantleguard.optimizeGas',
        wrapCommandWithStatus(commands.optimizeGas, 'Optimizing')
    );

    const aiCopilotCmd = vscode.commands.registerCommand(
        'mantleguard.aiCopilot',
        wrapCommandWithStatus(commands.aiCopilot, 'AI Processing')
    );

    const generateReportCmd = vscode.commands.registerCommand(
        'mantleguard.generateReport',
        wrapCommandWithStatus(commands.generateReport, 'Generating Report')
    );

    const openDashboardCmd = vscode.commands.registerCommand(
        'mantleguard.openDashboard',
        commands.openDashboard
    );

    // Register function-specific commands for CodeLens
    const analyzeFunctionCmd = vscode.commands.registerCommand(
        'mantleguard.analyzeFunction',
        wrapCommandWithStatus(commands.analyzeFunction, 'Analyzing Function')
    );

    const optimizeFunctionCmd = vscode.commands.registerCommand(
        'mantleguard.optimizeFunction',
        wrapCommandWithStatus(commands.optimizeFunction, 'Optimizing Function')
    );

    const askAIAboutFunctionCmd = vscode.commands.registerCommand(
        'mantleguard.askAIAboutFunction',
        wrapCommandWithStatus(commands.askAIAboutFunction, 'AI Analysis')
    );

    // Command to refresh CodeLens
    const refreshCodeLensCmd = vscode.commands.registerCommand(
        'mantleguard.refreshCodeLens',
        () => codeLensProvider.refresh()
    );

    // Command to clear diagnostics
    const clearDiagnosticsCmd = vscode.commands.registerCommand(
        'mantleguard.clearDiagnostics',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                diagnosticsProvider.clearDiagnostics(editor.document);
            }
        }
    );

    // Command to show sample diagnostics (for testing)
    const showSampleDiagnosticsCmd = vscode.commands.registerCommand(
        'mantleguard.showSampleDiagnostics',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'solidity') {
                diagnosticsProvider.createSampleDiagnostics(editor.document);
                vscode.window.showInformationMessage('Sample diagnostics added to Problems panel');
            } else {
                vscode.window.showWarningMessage('Please open a Solidity file');
            }
        }
    );

    // Command to clear hover cache
    const clearHoverCacheCmd = vscode.commands.registerCommand(
        'mantleguard.clearHoverCache',
        () => {
            hoverProvider.clearCache();
            vscode.window.showInformationMessage('Hover cache cleared');
        }
    );

    // Refresh commands for views
    const refreshDashboard = vscode.commands.registerCommand(
        'mantleguard.refreshDashboard',
        () => dashboardProvider.refresh()
    );

    const refreshGas = vscode.commands.registerCommand('mantleguard.refreshGas', () =>
        gasProvider.refresh()
    );

    const refreshAudit = vscode.commands.registerCommand('mantleguard.refreshAudit', () =>
        auditProvider.refresh()
    );

    const refreshCopilot = vscode.commands.registerCommand('mantleguard.refreshCopilot', () =>
        copilotProvider.refresh()
    );

    const refreshReports = vscode.commands.registerCommand('mantleguard.refreshReports', () =>
        reportsProvider.refresh()
    );

    const refreshSettings = vscode.commands.registerCommand('mantleguard.refreshSettings', () =>
        settingsProvider.refresh()
    );

    // Auto-analysis on save (if enabled)
    const onSaveDisposable = vscode.workspace.onDidSaveTextDocument(async (document) => {
        const config = vscode.workspace.getConfiguration('mantleguard');
        const autoAnalysis = config.get<boolean>('enableAutoAnalysis', true);

        if (autoAnalysis && document.languageId === 'solidity') {
            vscode.window.showInformationMessage('MantleGuard: Auto-analyzing contract...');
            statusBarManager.setAnalyzing('Auto-analyzing...');

            try {
                await commands.analyzeContract();
                statusBarManager.setReady();
            } catch (error) {
                statusBarManager.setError('Auto-analysis failed');
            }

            // Refresh CodeLens after analysis
            codeLensProvider.refresh();
        }
    });

    // Listen for document changes to refresh CodeLens
    const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === 'solidity') {
            codeLensProvider.refresh();
            hoverProvider.clearCache(); // Clear hover cache on edit
        }
    });

    // Clear diagnostics when document is closed
    const onDidCloseTextDocument = vscode.workspace.onDidCloseTextDocument((document) => {
        if (document.languageId === 'solidity') {
            diagnosticsProvider.clearDiagnostics(document);
        }
    });

    // Update status bar when active editor changes
    const onDidChangeActiveEditor = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && editor.document.languageId === 'solidity') {
            statusBarManager.setReady('Ready to analyze Solidity contract');
        } else {
            statusBarManager.setReady();
        }
    });

    context.subscriptions.push(
        analyzeContractCmd,
        auditContractCmd,
        optimizeGasCmd,
        aiCopilotCmd,
        generateReportCmd,
        openDashboardCmd,
        analyzeFunctionCmd,
        optimizeFunctionCmd,
        askAIAboutFunctionCmd,
        refreshCodeLensCmd,
        clearDiagnosticsCmd,
        showSampleDiagnosticsCmd,
        clearHoverCacheCmd,
        refreshDashboard,
        refreshGas,
        refreshAudit,
        refreshCopilot,
        refreshReports,
        refreshSettings,
        onSaveDisposable,
        onDidChangeTextDocument,
        onDidCloseTextDocument,
        onDidChangeActiveEditor,
        codeLensDisposable,
        hoverDisposable,
        quickFixDisposable
    );

    // Store providers in context for external access if needed
    context.subscriptions.push(diagnosticsProvider);

    vscode.window.showInformationMessage('MantleGuard extension activated! 🛡️');
}

export function deactivate() {
    const statusBarManager = StatusBarManager.getInstance();
    statusBarManager.dispose();
    console.log('MantleGuard extension is now deactivated');
}
