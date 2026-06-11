import * as vscode from 'vscode';
import { ApiService } from '../services/apiService';

export class QuickFixProvider implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix,
    ];

    async provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.CodeAction[]> {
        const actions: vscode.CodeAction[] = [];

        // Only provide fixes for diagnostics from MantleGuard
        const mantleGuardDiagnostics = context.diagnostics.filter(
            (diagnostic) => diagnostic.source === 'MantleGuard' ||
                diagnostic.source === 'MantleGuard Security Audit'
        );

        for (const diagnostic of mantleGuardDiagnostics) {
            // AI-powered fix
            const aiFix = this.createAIFix(document, diagnostic);
            actions.push(aiFix);

            // Specific quick fixes based on issue type
            const specificFixes = this.createSpecificFixes(document, diagnostic);
            actions.push(...specificFixes);
        }

        return actions;
    }

    private createAIFix(
        document: vscode.TextDocument,
        diagnostic: vscode.Diagnostic
    ): vscode.CodeAction {
        const action = new vscode.CodeAction(
            '🤖 Apply AI Fix (with preview)',
            vscode.CodeActionKind.QuickFix
        );
        action.diagnostics = [diagnostic];
        action.isPreferred = true;

        action.command = {
            command: 'mantleguard.applyAIFix',
            title: 'Apply AI Fix',
            arguments: [document, diagnostic],
        };

        return action;
    }

    private createSpecificFixes(
        document: vscode.TextDocument,
        diagnostic: vscode.Diagnostic
    ): vscode.CodeAction[] {
        const actions: vscode.CodeAction[] = [];
        const message = diagnostic.message.toLowerCase();

        // Reentrancy fix
        if (message.includes('reentrancy')) {
            const action = new vscode.CodeAction(
                '🔒 Add ReentrancyGuard',
                vscode.CodeActionKind.QuickFix
            );
            action.diagnostics = [diagnostic];
            action.command = {
                command: 'mantleguard.addReentrancyGuard',
                title: 'Add ReentrancyGuard',
                arguments: [document, diagnostic.range],
            };
            actions.push(action);
        }

        // Gas optimization
        if (message.includes('constant') || message.includes('immutable')) {
            const action = new vscode.CodeAction(
                '⚡ Make constant/immutable',
                vscode.CodeActionKind.QuickFix
            );
            action.diagnostics = [diagnostic];
            action.edit = this.createConstantEdit(document, diagnostic.range);
            actions.push(action);
        }

        // Unchecked call
        if (message.includes('unchecked') && message.includes('call')) {
            const action = new vscode.CodeAction(
                '✅ Add call result check',
                vscode.CodeActionKind.QuickFix
            );
            action.diagnostics = [diagnostic];
            action.command = {
                command: 'mantleguard.addCallCheck',
                title: 'Add call check',
                arguments: [document, diagnostic.range],
            };
            actions.push(action);
        }

        return actions;
    }

    private createConstantEdit(
        document: vscode.TextDocument,
        range: vscode.Range
    ): vscode.WorkspaceEdit {
        const edit = new vscode.WorkspaceEdit();
        const line = document.lineAt(range.start.line);
        const text = line.text;

        // Simple replacement: add 'constant' or 'immutable'
        if (text.includes('uint') || text.includes('address')) {
            const newText = text.replace(/(\s+)(uint|address)/, '$1$2 constant');
            edit.replace(document.uri, line.range, newText);
        }

        return edit;
    }
}

export async function applyAIFix(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic
) {
    const code = document.getText();
    const line = diagnostic.range.start.line + 1; // 1-indexed
    const issue = diagnostic.message;

    try {
        // Get AI-generated fix
        const apiService = ApiService.getInstance();
        const fixResult = await apiService.getQuickFix(code, line, issue);

        if (!fixResult.fix) {
            vscode.window.showErrorMessage('No fix available from AI');
            return;
        }

        // Show diff preview
        await showFixPreview(document, diagnostic.range, fixResult.fix, issue);
    } catch (error) {
        vscode.window.showErrorMessage(
            `Quick fix failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}

async function showFixPreview(
    document: vscode.TextDocument,
    range: vscode.Range,
    fixedCode: string,
    issue: string
) {
    // Get the affected range (expand to include context)
    const startLine = Math.max(0, range.start.line - 2);
    const endLine = Math.min(document.lineCount - 1, range.end.line + 2);
    const affectedRange = new vscode.Range(startLine, 0, endLine, Number.MAX_VALUE);

    const originalCode = document.getText(affectedRange);

    // Create temporary documents for diff
    const originalDoc = await vscode.workspace.openTextDocument({
        content: originalCode,
        language: 'solidity',
    });

    const fixedDoc = await vscode.workspace.openTextDocument({
        content: fixedCode,
        language: 'solidity',
    });

    // Show diff
    await vscode.commands.executeCommand(
        'vscode.diff',
        originalDoc.uri,
        fixedDoc.uri,
        `Fix Preview: ${issue} (Before ↔ After)`,
        { preview: true }
    );

    // Ask user to accept or reject
    const choice = await vscode.window.showInformationMessage(
        'Apply this fix?',
        { modal: true },
        'Accept',
        'Reject'
    );

    if (choice === 'Accept') {
        // Apply the fix
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, affectedRange, fixedCode);
        const success = await vscode.workspace.applyEdit(edit);

        if (success) {
            vscode.window.showInformationMessage('✅ Fix applied successfully!');
        } else {
            vscode.window.showErrorMessage('Failed to apply fix');
        }
    } else {
        vscode.window.showInformationMessage('Fix rejected');
    }

    // Close temporary documents
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
}

export async function addReentrancyGuard(
    document: vscode.TextDocument,
    range: vscode.Range
) {
    // Find the function and add nonReentrant modifier
    const line = document.lineAt(range.start.line);
    const text = line.text;

    if (text.includes('function')) {
        const edit = new vscode.WorkspaceEdit();

        // Add nonReentrant modifier
        const modifiedText = text.replace(
            /(function\s+\w+\s*\([^)]*\)\s*)(public|external|internal|private)/,
            '$1$2 nonReentrant'
        );

        edit.replace(document.uri, line.range, modifiedText);

        const success = await vscode.workspace.applyEdit(edit);

        if (success) {
            vscode.window.showInformationMessage(
                '✅ Added nonReentrant modifier. Remember to import ReentrancyGuard!'
            );
        }
    }
}

export async function addCallCheck(
    document: vscode.TextDocument,
    range: vscode.Range
) {
    // Find the call and add require check
    const line = document.lineAt(range.start.line);
    const text = line.text;

    if (text.includes('.call')) {
        const edit = new vscode.WorkspaceEdit();

        // Wrap call in require
        const indent = text.match(/^\s*/)?.[0] || '';
        const callMatch = text.match(/\(bool\s+(\w+),/);
        const successVar = callMatch?.[1] || 'success';

        // Add require check after the call
        const newLine = `${indent}require(${successVar}, "Call failed");\n`;

        edit.insert(
            document.uri,
            new vscode.Position(range.end.line + 1, 0),
            newLine
        );

        const success = await vscode.workspace.applyEdit(edit);

        if (success) {
            vscode.window.showInformationMessage('✅ Added call result check!');
        }
    }
}
