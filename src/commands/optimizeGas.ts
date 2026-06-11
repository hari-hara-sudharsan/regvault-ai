import * as vscode from 'vscode';
import { ApiService } from '../services/apiService';

export async function optimizeGas() {
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
            progress.report({ message: 'Analyzing gas optimization opportunities...' });

            try {
                const apiService = ApiService.getInstance();
                const result = await apiService.optimizeGas(contractCode, fileName);

                const savings = result.estimatedSavings || 0;
                vscode.window.showInformationMessage(
                    `Gas optimization complete! Potential savings: ${savings}%`
                );

                // Show optimization suggestions
                const outputChannel = vscode.window.createOutputChannel('MantleGuard Gas Optimization');
                outputChannel.appendLine('=== Gas Optimization Results ===');
                outputChannel.appendLine(JSON.stringify(result, null, 2));
                outputChannel.show();
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Gas optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        }
    );
}
