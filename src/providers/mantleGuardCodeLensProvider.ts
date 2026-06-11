import * as vscode from 'vscode';

export class MantleGuardCodeLensProvider implements vscode.CodeLensProvider {
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor() { }

    public refresh(): void {
        this._onDidChangeCodeLenses.fire();
    }

    public provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        if (document.languageId !== 'solidity') {
            return [];
        }

        const codeLenses: vscode.CodeLens[] = [];
        const text = document.getText();
        const lines = text.split('\n');

        // Find function declarations
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const functionMatch = line.match(/function\s+(\w+)\s*\(/);

            if (functionMatch) {
                const functionName = functionMatch[1];
                const range = new vscode.Range(i, 0, i, line.length);

                // Add CodeLens for Analyze
                codeLenses.push(
                    new vscode.CodeLens(range, {
                        title: '$(shield) Analyze',
                        tooltip: `Analyze ${functionName} function`,
                        command: 'mantleguard.analyzeFunction',
                        arguments: [document.uri, functionName, i],
                    })
                );

                // Add CodeLens for Optimize
                codeLenses.push(
                    new vscode.CodeLens(range, {
                        title: '$(dashboard) Optimize',
                        tooltip: `Optimize gas for ${functionName}`,
                        command: 'mantleguard.optimizeFunction',
                        arguments: [document.uri, functionName, i],
                    })
                );

                // Add CodeLens for Ask AI
                codeLenses.push(
                    new vscode.CodeLens(range, {
                        title: '$(robot) Ask AI',
                        tooltip: `Ask AI about ${functionName}`,
                        command: 'mantleguard.askAIAboutFunction',
                        arguments: [document.uri, functionName, i],
                    })
                );
            }

            // Find contract declarations
            const contractMatch = line.match(/contract\s+(\w+)/);
            if (contractMatch) {
                const contractName = contractMatch[1];
                const range = new vscode.Range(i, 0, i, line.length);

                codeLenses.push(
                    new vscode.CodeLens(range, {
                        title: '$(file-code) Analyze Contract',
                        tooltip: `Full analysis of ${contractName}`,
                        command: 'mantleguard.analyzeContract',
                        arguments: [document.uri],
                    })
                );

                codeLenses.push(
                    new vscode.CodeLens(range, {
                        title: '$(shield) Security Audit',
                        tooltip: `Run security audit on ${contractName}`,
                        command: 'mantleguard.auditContract',
                        arguments: [document.uri],
                    })
                );
            }
        }

        return codeLenses;
    }

    public resolveCodeLens(
        codeLens: vscode.CodeLens,
        token: vscode.CancellationToken
    ): vscode.CodeLens {
        return codeLens;
    }
}
