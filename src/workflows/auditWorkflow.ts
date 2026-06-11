import * as vscode from 'vscode';
import { ApiService, SecurityFinding } from '../services/apiService';
import { MantleGuardDiagnosticsProvider, SecurityIssue } from '../providers/mantleGuardDiagnosticsProvider';
import { StatusBarManager } from '../utils/statusBarManager';

export class AuditWorkflow {
    constructor(
        private diagnosticsProvider: MantleGuardDiagnosticsProvider,
        private statusBarManager: StatusBarManager
    ) { }

    async execute(document: vscode.TextDocument): Promise<void> {
        const code = document.getText();
        const fileName = document.fileName;

        // Update status bar
        this.statusBarManager.setAnalyzing('Running security audit...');

        try {
            // Call backend API
            const apiService = ApiService.getInstance();
            const result = await apiService.auditContract(code, fileName);

            // Process findings
            if (result.findings && result.findings.length > 0) {
                // Convert findings to diagnostics
                const issues: SecurityIssue[] = result.findings.map((finding) => ({
                    severity: finding.severity,
                    title: finding.title,
                    message: finding.message,
                    line: finding.line,
                    column: finding.column || 0,
                    endLine: finding.endLine,
                    endColumn: finding.endColumn,
                    code: finding.code,
                    source: 'MantleGuard Security Audit',
                }));

                // Update Problems Panel
                this.diagnosticsProvider.updateDiagnostics(document, issues);

                // Show summary
                const criticalCount = issues.filter((i) => i.severity === 'critical').length;
                const highCount = issues.filter((i) => i.severity === 'high').length;

                if (criticalCount > 0 || highCount > 0) {
                    const message = `Audit complete: ${criticalCount} critical, ${highCount} high severity issues found`;
                    vscode.window.showWarningMessage(message, 'View Problems').then((selection) => {
                        if (selection === 'View Problems') {
                            vscode.commands.executeCommand('workbench.action.problems.focus');
                        }
                    });
                } else {
                    vscode.window.showInformationMessage(
                        `Audit complete: ${issues.length} issues found. Check Problems panel for details.`
                    );
                }

                // Show output channel with details
                const outputChannel = vscode.window.createOutputChannel('MantleGuard Audit');
                outputChannel.clear();
                outputChannel.appendLine('=== MantleGuard Security Audit Report ===');
                outputChannel.appendLine(`File: ${fileName}`);
                outputChannel.appendLine(`Total Issues: ${issues.length}`);
                outputChannel.appendLine('');

                issues.forEach((issue, index) => {
                    outputChannel.appendLine(`${index + 1}. [${issue.severity.toUpperCase()}] ${issue.title}`);
                    outputChannel.appendLine(`   Line ${issue.line}: ${issue.message}`);
                    if (issue.code) {
                        outputChannel.appendLine(`   Code: ${issue.code}`);
                    }
                    outputChannel.appendLine('');
                });

                outputChannel.show(true);
            } else {
                vscode.window.showInformationMessage('✅ Audit complete: No security issues found!');
                this.diagnosticsProvider.clearDiagnostics(document);
            }

            this.statusBarManager.setReady();
        } catch (error) {
            this.statusBarManager.setError('Audit failed');
            vscode.window.showErrorMessage(
                `Audit failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async getQuickFix(document: vscode.TextDocument, line: number, issue: string): Promise<string | null> {
        try {
            const code = document.getText();
            const apiService = ApiService.getInstance();
            const result = await apiService.getQuickFix(code, line, issue);
            return result.fix;
        } catch (error) {
            console.error('Quick fix failed:', error);
            return null;
        }
    }
}
