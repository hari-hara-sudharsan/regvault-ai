import * as vscode from 'vscode';
import { ApiService } from '../services/apiService';

export async function askAIAboutFunction(
    uri: vscode.Uri,
    functionName: string,
    lineNumber: number
) {
    const document = await vscode.workspace.openTextDocument(uri);

    // Extract function code
    const text = document.getText();
    const lines = text.split('\n');

    // Find function boundaries
    let startLine = lineNumber;
    let endLine = lineNumber;
    let braceCount = 0;
    let started = false;

    for (let i = lineNumber; i < lines.length; i++) {
        const line = lines[i];

        for (const char of line) {
            if (char === '{') {
                braceCount++;
                started = true;
            } else if (char === '}') {
                braceCount--;
            }
        }

        if (started && braceCount === 0) {
            endLine = i;
            break;
        }
    }

    const functionCode = lines.slice(startLine, endLine + 1).join('\n');

    // Ask user what they want to know
    const query = await vscode.window.showInputBox({
        prompt: `Ask AI about ${functionName}()`,
        placeHolder: 'e.g., Is this function secure? Can it be optimized? What does it do?',
        value: `Explain what ${functionName}() does and identify any security issues or optimization opportunities.`,
    });

    if (!query) {
        return;
    }

    vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: `AI analyzing ${functionName}()...`,
            cancellable: false,
        },
        async (progress) => {
            try {
                const apiService = ApiService.getInstance();
                const result = await apiService.askCopilot(functionCode, query);

                // Show AI response in a new document
                const doc = await vscode.workspace.openTextDocument({
                    content: `# AI Analysis: ${functionName}()\n\n## Question\n${query}\n\n## Function Code\n\`\`\`solidity\n${functionCode}\n\`\`\`\n\n## AI Response\n${result.response || 'No response'}`,
                    language: 'markdown',
                });

                const editor = await vscode.window.showTextDocument(doc, {
                    viewColumn: vscode.ViewColumn.Beside,
                    preview: false,
                });

                // Highlight the function in the original editor
                const originalEditor = vscode.window.visibleTextEditors.find(
                    (e) => e.document.uri.toString() === uri.toString()
                );

                if (originalEditor) {
                    const range = new vscode.Range(startLine, 0, endLine, lines[endLine].length);
                    originalEditor.selection = new vscode.Selection(range.start, range.end);
                    originalEditor.revealRange(range, vscode.TextEditorRevealType.InCenter);
                }
            } catch (error) {
                vscode.window.showErrorMessage(
                    `AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        }
    );
}
