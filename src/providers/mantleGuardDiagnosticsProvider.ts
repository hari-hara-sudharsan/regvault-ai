import * as vscode from 'vscode';

export interface SecurityIssue {
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    title: string;
    message: string;
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
    code?: string;
    source?: string;
}

export class MantleGuardDiagnosticsProvider {
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('mantleguard');
    }

    public updateDiagnostics(document: vscode.TextDocument, issues: SecurityIssue[]): void {
        const diagnostics: vscode.Diagnostic[] = [];

        for (const issue of issues) {
            const line = Math.max(0, issue.line - 1); // Convert to 0-based
            const startColumn = Math.max(0, issue.column);
            const endLine = issue.endLine ? Math.max(0, issue.endLine - 1) : line;
            const endColumn = issue.endColumn || startColumn + 50;

            const range = new vscode.Range(
                new vscode.Position(line, startColumn),
                new vscode.Position(endLine, endColumn)
            );

            const severity = this.mapSeverity(issue.severity);

            const diagnostic = new vscode.Diagnostic(
                range,
                issue.message,
                severity
            );

            diagnostic.source = issue.source || 'MantleGuard';
            diagnostic.code = issue.code || issue.title;

            // Add related information if available
            if (issue.title) {
                diagnostic.relatedInformation = [
                    new vscode.DiagnosticRelatedInformation(
                        new vscode.Location(document.uri, range),
                        issue.title
                    ),
                ];
            }

            diagnostics.push(diagnostic);
        }

        this.diagnosticCollection.set(document.uri, diagnostics);
    }

    public clearDiagnostics(document?: vscode.TextDocument): void {
        if (document) {
            this.diagnosticCollection.delete(document.uri);
        } else {
            this.diagnosticCollection.clear();
        }
    }

    public addDiagnostic(
        document: vscode.TextDocument,
        issue: SecurityIssue
    ): void {
        const existingDiagnostics = this.diagnosticCollection.get(document.uri) || [];
        const line = Math.max(0, issue.line - 1);
        const startColumn = Math.max(0, issue.column);

        const range = new vscode.Range(
            new vscode.Position(line, startColumn),
            new vscode.Position(line, startColumn + 50)
        );

        const diagnostic = new vscode.Diagnostic(
            range,
            issue.message,
            this.mapSeverity(issue.severity)
        );

        diagnostic.source = 'MantleGuard';
        diagnostic.code = issue.code || issue.title;

        this.diagnosticCollection.set(document.uri, [...existingDiagnostics, diagnostic]);
    }

    private mapSeverity(severity: string): vscode.DiagnosticSeverity {
        switch (severity.toLowerCase()) {
            case 'critical':
            case 'high':
                return vscode.DiagnosticSeverity.Error;
            case 'medium':
                return vscode.DiagnosticSeverity.Warning;
            case 'low':
                return vscode.DiagnosticSeverity.Information;
            case 'info':
                return vscode.DiagnosticSeverity.Hint;
            default:
                return vscode.DiagnosticSeverity.Warning;
        }
    }

    public dispose(): void {
        this.diagnosticCollection.dispose();
    }

    // Helper method to create sample diagnostics for testing
    public createSampleDiagnostics(document: vscode.TextDocument): void {
        const sampleIssues: SecurityIssue[] = [
            {
                severity: 'critical',
                title: 'Reentrancy Vulnerability',
                message: 'Possible reentrancy attack in withdraw() function. Use ReentrancyGuard or checks-effects-interactions pattern.',
                line: 15,
                column: 4,
                code: 'REENTRANCY-001',
            },
            {
                severity: 'high',
                title: 'Unchecked External Call',
                message: 'External call result not checked. Transaction may fail silently.',
                line: 23,
                column: 8,
                code: 'UNCHECKED-CALL-002',
            },
            {
                severity: 'medium',
                title: 'Gas Optimization',
                message: 'State variable could be declared as constant to save gas.',
                line: 8,
                column: 4,
                code: 'GAS-OPT-003',
            },
            {
                severity: 'low',
                title: 'Floating Pragma',
                message: 'Pragma version not locked. Use specific version for production.',
                line: 1,
                column: 0,
                code: 'PRAGMA-004',
            },
        ];

        this.updateDiagnostics(document, sampleIssues);
    }
}
