import * as vscode from 'vscode';
import { ApiService } from '../services/apiService';

export async function analyzeContract() {
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
            progress.report({ message: 'Analyzing contract...' });

            try {
                const apiService = ApiService.getInstance();
                const result = await apiService.analyzeContract(contractCode, fileName);

                vscode.window.showInformationMessage(
                    `Analysis complete! Found ${result.issues || 0} issues`
                );

                // Optionally show results in a webview or output channel
                const outputChannel = vscode.window.createOutputChannel('MantleGuard Analysis');
                outputChannel.appendLine('=== Contract Analysis Results ===');
                outputChannel.appendLine(JSON.stringify(result, null, 2));
                outputChannel.show();
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        }
    );
}
