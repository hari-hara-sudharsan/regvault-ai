import * as vscode from 'vscode';
import { ApiService } from '../services/apiService';

export async function aiCopilot() {
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

    const selection = editor.selection;
    const selectedText = document.getText(selection);
    const contextCode = selectedText || document.getText();

    const userQuery = await vscode.window.showInputBox({
        prompt: 'Ask AI Copilot about your smart contract',
        placeHolder: 'e.g., Explain this function, Find vulnerabilities, Suggest improvements',
    });

    if (!userQuery) {
        return;
    }

    vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: 'MantleGuard AI Copilot',
            cancellable: false,
        },
        async (progress) => {
            progress.report({ message: 'AI is analyzing your code...' });

            try {
                const apiService = ApiService.getInstance();
                const result = await apiService.askCopilot(contextCode, userQuery);

                // Show AI response in a new document or webview
                const doc = await vscode.workspace.openTextDocument({
                    content: `Query: ${userQuery}\n\n${result.response || 'No response'}`,
                    language: 'markdown',
                });
                await vscode.window.showTextDocument(doc);
            } catch (error) {
                vscode.window.showErrorMessage(
                    `AI Copilot error: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        }
    );
}
