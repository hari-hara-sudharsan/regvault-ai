import * as vscode from 'vscode';
import { ApiService, GasSuggestion } from '../services/apiService';
import { StatusBarManager } from '../utils/statusBarManager';

export class GasWorkflow {
    constructor(private statusBarManager: StatusBarManager) { }

    async execute(document: vscode.TextDocument): Promise<void> {
        const code = document.getText();
        const fileName = document.fileName;

        this.statusBarManager.setAnalyzing('Analyzing gas consumption...');

        try {
            // Call backend API
            const apiService = ApiService.getInstance();
            const result = await apiService.analyzeGas(code, fileName);

            // Create output channel
            const outputChannel = vscode.window.createOutputChannel('MantleGuard Gas Analysis');
            outputChannel.clear();
            outputChannel.appendLine('=== MantleGuard Gas Analysis Report ===');
            outputChannel.appendLine(`File: ${fileName}`);
            outputChannel.appendLine('');

            // Display gas score
            if (result.gasScore !== undefined) {
                outputChannel.appendLine(`⚡ Gas Score: ${result.gasScore}/100`);
                outputChannel.appendLine('');
            }

            // Display suggestions table
            if (result.suggestions && result.suggestions.length > 0) {
                outputChannel.appendLine('📊 Optimization Opportunities:');
                outputChannel.appendLine('');
                outputChannel.appendLine(
                    '┌────────────────────────────────┬────────┬────────┬─────────┐'
                );
                outputChannel.appendLine(
                    '│ Issue                          │ Line   │ Current│ Savings │'
                );
                outputChannel.appendLine(
                    '├────────────────────────────────┼────────┼────────┼─────────┤'
                );

                result.suggestions.forEach((suggestion) => {
                    const title = suggestion.title.padEnd(30).substring(0, 30);
                    const line = suggestion.line.toString().padStart(6);
                    const current = suggestion.currentCost.toString().padStart(6);
                    const savings = `${suggestion.savings}%`.padStart(7);

                    outputChannel.appendLine(
                        `│ ${title} │ ${line} │ ${current} │ ${savings} │`
                    );
                });

                outputChannel.appendLine(
                    '└────────────────────────────────┴────────┴────────┴─────────┘'
                );
                outputChannel.appendLine('');

                // Detailed suggestions
                outputChannel.appendLine('💡 Detailed Suggestions:');
                outputChannel.appendLine('');

                result.suggestions.forEach((suggestion, index) => {
                    outputChannel.appendLine(`${index + 1}. ${suggestion.title}`);
                    outputChannel.appendLine(`   Line ${suggestion.line}`);
                    outputChannel.appendLine(`   ${suggestion.description}`);
                    outputChannel.appendLine(
                        `   Current: ${suggestion.currentCost} gas | Optimized: ${suggestion.optimizedCost} gas`
                    );
                    outputChannel.appendLine(`   Potential savings: ${suggestion.savings}%`);
                    outputChannel.appendLine('');
                });

                // Calculate total savings
                const totalSavings = result.estimatedSavings || 0;
                outputChannel.appendLine(`💰 Total Estimated Savings: ${totalSavings}%`);

                outputChannel.show(true);

                vscode.window
                    .showInformationMessage(
                        `Gas analysis complete! Found ${result.suggestions.length} optimization opportunities (${totalSavings}% potential savings)`,
                        'View Details'
                    )
                    .then((selection) => {
                        if (selection === 'View Details') {
                            outputChannel.show(true);
                        }
                    });
            } else {
                outputChannel.appendLine('✅ No gas optimization opportunities found.');
                outputChannel.appendLine('Your contract is already well-optimized!');
                outputChannel.show(true);

                vscode.window.showInformationMessage('✅ Gas analysis complete: Already optimized!');
            }

            this.statusBarManager.setReady();
        } catch (error) {
            this.statusBarManager.setError('Gas analysis failed');
            vscode.window.showErrorMessage(
                `Gas analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async optimize(document: vscode.TextDocument): Promise<void> {
        const code = document.getText();
        const fileName = document.fileName;

        this.statusBarManager.setAnalyzing('Optimizing gas usage...');

        try {
            const apiService = ApiService.getInstance();
            const result = await apiService.optimizeGas(code, fileName);

            // Similar output to analyze but with optimized code suggestions
            const outputChannel = vscode.window.createOutputChannel('MantleGuard Gas Optimization');
            outputChannel.clear();
            outputChannel.appendLine('=== Gas Optimization Results ===');
            outputChannel.appendLine(JSON.stringify(result, null, 2));
            outputChannel.show(true);

            const savings = result.estimatedSavings || 0;
            vscode.window.showInformationMessage(
                `Optimization complete! Potential savings: ${savings}%`
            );

            this.statusBarManager.setReady();
        } catch (error) {
            this.statusBarManager.setError('Optimization failed');
            vscode.window.showErrorMessage(
                `Optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }
}
