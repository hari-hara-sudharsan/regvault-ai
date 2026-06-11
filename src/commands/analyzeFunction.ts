import * as vscode from 'vscode';
import { ApiService } from '../services/apiService';

export async function analyzeFunction(
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

    vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: `Analyzing ${functionName}()`,
            cancellable: false,
        },
        async (progress) => {
            try {
                const apiService = ApiService.getInstance();
                const result = await apiService.analyzeContract(functionCode, `${functionName}_analysis`);

                vscode.window.showInformationMessage(
                    `Analysis complete for ${functionName}()!`
                );

                // Show results
                const outputChannel = vscode.window.createOutputChannel(
                    `MantleGuard: ${functionName}()`
                );
                outputChannel.appendLine(`=== Analysis Results for ${functionName}() ===`);
                outputChannel.appendLine(JSON.stringify(result, null, 2));
                outputChannel.show();

                // Highlight the function
                const editor = vscode.window.activeTextEditor;
                if (editor && editor.document.uri.toString() === uri.toString()) {
                    const range = new vscode.Range(startLine, 0, endLine, lines[endLine].length);
                    editor.selection = new vscode.Selection(range.start, range.end);
                    editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
                }
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        }
    );
}
