import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ApiService } from '../services/apiService';
import { StatusBarManager } from '../utils/statusBarManager';

export interface ReportData {
    fileName: string;
    timestamp: string;
    securityScore: number;
    gasScore: number;
    summary: {
        totalIssues: number;
        criticalIssues: number;
        highIssues: number;
        mediumIssues: number;
        lowIssues: number;
    };
    findings: any[];
    gasSuggestions: any[];
    recommendations: string[];
}

export class ReportWorkflow {
    constructor(private statusBarManager: StatusBarManager) { }

    async generate(document: vscode.TextDocument): Promise<ReportData | null> {
        const code = document.getText();
        const fileName = path.basename(document.fileName);

        this.statusBarManager.setAnalyzing('Generating comprehensive report...');

        try {
            const apiService = ApiService.getInstance();

            // Gather all data
            const [auditResult, gasResult] = await Promise.all([
                apiService.auditContract(code, fileName),
                apiService.analyzeGas(code, fileName),
            ]);

            // Build report data
            const reportData: ReportData = {
                fileName,
                timestamp: new Date().toISOString(),
                securityScore: auditResult.securityScore || 0,
                gasScore: gasResult.gasScore || 0,
                summary: {
                    totalIssues: auditResult.findings?.length || 0,
                    criticalIssues: auditResult.findings?.filter((f) => f.severity === 'critical').length || 0,
                    highIssues: auditResult.findings?.filter((f) => f.severity === 'high').length || 0,
                    mediumIssues: auditResult.findings?.filter((f) => f.severity === 'medium').length || 0,
                    lowIssues: auditResult.findings?.filter((f) => f.severity === 'low').length || 0,
                },
                findings: auditResult.findings || [],
                gasSuggestions: gasResult.suggestions || [],
                recommendations: this.generateRecommendations(auditResult, gasResult),
            };

            this.statusBarManager.setReady();
            return reportData;
        } catch (error) {
            this.statusBarManager.setError('Report generation failed');
            vscode.window.showErrorMessage(
                `Report generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
            return null;
        }
    }

    private generateRecommendations(auditResult: any, gasResult: any): string[] {
        const recommendations: string[] = [];

        // Security recommendations
        if (auditResult.securityScore < 70) {
            recommendations.push('🔴 Critical: Address all critical and high severity security issues immediately');
        } else if (auditResult.securityScore < 85) {
            recommendations.push('🟡 Important: Review and fix medium severity security issues');
        } else {
            recommendations.push('🟢 Good: Security posture is strong, maintain current practices');
        }

        // Gas recommendations
        if (gasResult.gasScore < 60) {
            recommendations.push('⚡ Optimize: Significant gas savings possible (20%+ potential reduction)');
        } else if (gasResult.gasScore < 80) {
            recommendations.push('⚡ Consider: Moderate gas optimizations available');
        } else {
            recommendations.push('✅ Efficient: Gas usage is well-optimized');
        }

        // Specific recommendations
        if (auditResult.findings?.some((f: any) => f.title?.includes('Reentrancy'))) {
            recommendations.push('🔒 Add ReentrancyGuard from OpenZeppelin to all state-changing functions');
        }

        if (gasResult.suggestions?.some((s: any) => s.title?.includes('constant'))) {
            recommendations.push('💡 Mark immutable variables as constant or immutable to save gas');
        }

        if (gasResult.suggestions?.some((s: any) => s.title?.includes('unchecked'))) {
            recommendations.push('💡 Use unchecked blocks for arithmetic that cannot overflow');
        }

        return recommendations;
    }

    async exportMarkdown(reportData: ReportData): Promise<void> {
        const markdown = this.generateMarkdown(reportData);

        const saveUri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(`${reportData.fileName}_report.md`),
            filters: { 'Markdown': ['md'] },
        });

        if (saveUri) {
            await fs.promises.writeFile(saveUri.fsPath, markdown, 'utf-8');
            vscode.window.showInformationMessage('✅ Report exported as Markdown!', 'Open').then((choice) => {
                if (choice === 'Open') {
                    vscode.commands.executeCommand('vscode.open', saveUri);
                }
            });
        }
    }

    async exportJSON(reportData: ReportData): Promise<void> {
        const json = JSON.stringify(reportData, null, 2);

        const saveUri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(`${reportData.fileName}_report.json`),
            filters: { 'JSON': ['json'] },
        });

        if (saveUri) {
            await fs.promises.writeFile(saveUri.fsPath, json, 'utf-8');
            vscode.window.showInformationMessage('✅ Report exported as JSON!', 'Open').then((choice) => {
                if (choice === 'Open') {
                    vscode.commands.executeCommand('vscode.open', saveUri);
                }
            });
        }
    }

    async exportPDF(reportData: ReportData): Promise<void> {
        // Call backend to generate PDF
        try {
            const apiService = ApiService.getInstance();
            const result = await apiService.generateReport(reportData.fileName, JSON.stringify(reportData));

            if ((result as any).pdfUrl) {
                vscode.window.showInformationMessage(
                    '✅ PDF report generated!',
                    'Download'
                ).then((choice) => {
                    if (choice === 'Download') {
                        vscode.env.openExternal(vscode.Uri.parse((result as any).pdfUrl));
                    }
                });
            } else {
                vscode.window.showWarningMessage('PDF generation not available. Use Markdown or JSON export.');
            }
        } catch (error) {
            vscode.window.showErrorMessage('PDF export failed. Try Markdown or JSON export instead.');
        }
    }

    private generateMarkdown(reportData: ReportData): string {
        const date = new Date(reportData.timestamp).toLocaleString();

        return `# 🛡️ MantleGuard Security & Gas Analysis Report

## Contract Information
- **File:** ${reportData.fileName}
- **Generated:** ${date}

---

## 📊 Overall Scores

| Metric | Score | Status |
|--------|-------|--------|
| 🛡️ Security Score | **${reportData.securityScore}/100** | ${this.getScoreEmoji(reportData.securityScore)} |
| ⚡ Gas Efficiency | **${reportData.gasScore}/100** | ${this.getScoreEmoji(reportData.gasScore)} |

---

## 📋 Executive Summary

### Security Issues Found: ${reportData.summary.totalIssues}
- 🔴 **Critical:** ${reportData.summary.criticalIssues}
- 🟠 **High:** ${reportData.summary.highIssues}
- 🟡 **Medium:** ${reportData.summary.mediumIssues}
- 🔵 **Low:** ${reportData.summary.lowIssues}

### Gas Optimization Opportunities: ${reportData.gasSuggestions.length}

---

## 🔍 Security Findings

${reportData.findings.length > 0 ? reportData.findings.map((finding, i) => `
### ${i + 1}. ${this.getSeverityEmoji(finding.severity)} ${finding.title}

**Severity:** ${finding.severity.toUpperCase()}  
**Line:** ${finding.line}  
**Description:** ${finding.message}

${finding.fix ? `**Suggested Fix:**\n\`\`\`solidity\n${finding.fix}\n\`\`\`\n` : ''}
`).join('\n') : '_No security issues found! ✅_'}

---

## ⚡ Gas Optimization Suggestions

${reportData.gasSuggestions.length > 0 ? reportData.gasSuggestions.map((suggestion, i) => `
### ${i + 1}. ${suggestion.title}

**Line:** ${suggestion.line}  
**Current Cost:** ${suggestion.currentCost} gas  
**Optimized Cost:** ${suggestion.optimizedCost} gas  
**Savings:** ${suggestion.savings}%

**Description:** ${suggestion.description}

${suggestion.fix ? `**Implementation:**\n\`\`\`solidity\n${suggestion.fix}\n\`\`\`\n` : ''}
`).join('\n') : '_Contract is already well-optimized! ✅_'}

---

## 💡 Recommendations

${reportData.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

---

## 📈 Next Steps

1. **Address Critical Issues:** Fix all critical and high severity vulnerabilities immediately
2. **Apply Gas Optimizations:** Implement suggested optimizations for cost savings
3. **Follow Best Practices:** Adopt recommended security patterns
4. **Re-audit:** Run analysis again after making changes
5. **Consider Professional Audit:** For production contracts, get a professional security audit

---

*Report generated by MantleGuard Security Suite*
`;
    }

    private getScoreEmoji(score: number): string {
        if (score >= 90) return '🟢 Excellent';
        if (score >= 75) return '🟡 Good';
        if (score >= 60) return '🟠 Fair';
        return '🔴 Needs Improvement';
    }

    private getSeverityEmoji(severity: string): string {
        switch (severity.toLowerCase()) {
            case 'critical': return '🔴';
            case 'high': return '🟠';
            case 'medium': return '🟡';
            case 'low': return '🔵';
            default: return '⚪';
        }
    }

    async showReportMenu(reportData: ReportData): Promise<void> {
        const choice = await vscode.window.showQuickPick(
            [
                {
                    label: '$(markdown) Export as Markdown',
                    description: 'Human-readable format with syntax highlighting',
                    action: 'markdown',
                },
                {
                    label: '$(json) Export as JSON',
                    description: 'Machine-readable format for further processing',
                    action: 'json',
                },
                {
                    label: '$(file-pdf) Export as PDF',
                    description: 'Professional report format (requires backend)',
                    action: 'pdf',
                },
                {
                    label: '$(eye) Preview Report',
                    description: 'View report in editor before exporting',
                    action: 'preview',
                },
            ],
            {
                placeHolder: 'Choose export format',
                title: '📊 Export Report',
            }
        );

        if (!choice) return;

        switch (choice.action) {
            case 'markdown':
                await this.exportMarkdown(reportData);
                break;
            case 'json':
                await this.exportJSON(reportData);
                break;
            case 'pdf':
                await this.exportPDF(reportData);
                break;
            case 'preview':
                await this.previewReport(reportData);
                break;
        }
    }

    private async previewReport(reportData: ReportData): Promise<void> {
        const markdown = this.generateMarkdown(reportData);
        const doc = await vscode.workspace.openTextDocument({
            content: markdown,
            language: 'markdown',
        });
        await vscode.window.showTextDocument(doc, { preview: false });
    }
}
