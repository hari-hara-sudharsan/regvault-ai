import * as vscode from 'vscode';
import { ReportWorkflow } from '../workflows/reportWorkflow';
import { StatusBarManager } from '../utils/statusBarManager';

export async function generateReport() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const document = editor.document;

    if (document.languageId !== 'solidity') {
        vscode.window.showWarningMessage('Please open a Solidity file');
        return;
    }

    const statusBarManager = StatusBarManager.getInstance();
    const reportWorkflow = new ReportWorkflow(statusBarManager);

    // Generate report
    const reportData = await reportWorkflow.generate(document);

    if (reportData) {
        // Show export menu
        await reportWorkflow.showReportMenu(reportData);
    }
}
