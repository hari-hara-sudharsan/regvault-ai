import * as vscode from 'vscode';
import { ApiService } from '../services/apiService';

export async function auditContract() {
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

    const contractCode = document.getText();
    const fileName = document.fileName;

    vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: 'MantleGuard',
            cancellable: false,
        },
        async (progress) => {
            progress.report({ message: 'Auditing contract for security vulnerabilities...' });

            try {
                const apiService = ApiService.getInstance();
                const result = await apiService.auditContract(contractCode, fileName);

                const severity = (result as any).severity || 'info';
                const message = `Audit complete! Severity: ${severity}`;

                if (severity === 'critical' || severity === 'high') {
                    vscode.window.showWarningMessage(message);
                } else {
                    vscode.window.showInformationMessage(message);
                }

                // Show detailed results
                const outputChannel = vscode.window.createOutputChannel('MantleGuard Audit');
                outputChannel.appendLine('=== Security Audit Results ===');
                outputChannel.appendLine(JSON.stringify(result, null, 2));
                outputChannel.show();
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Audit failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        }
    );
}
