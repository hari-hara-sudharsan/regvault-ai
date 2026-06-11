import * as vscode from 'vscode';
import { ApiService } from '../services/apiService';
import { StatusBarManager } from '../utils/statusBarManager';

export class CopilotWorkflow {
    constructor(private statusBarManager: StatusBarManager) { }

    async ask(code: string, query: string): Promise<string> {
        this.statusBarManager.setAnalyzing('AI processing...');

        try {
            const apiService = ApiService.getInstance();
            const result = await apiService.askCopilot(code, query);
            this.statusBarManager.setReady();
            return result.response;
        } catch (error) {
            this.statusBarManager.setError('AI request failed');
            throw error;
        }
    }

    async askStream(
        code: string,
        query: string,
        onChunk: (chunk: string) => void
    ): Promise<void> {
        this.statusBarManager.setAnalyzing('AI processing...');

        try {
            const apiService = ApiService.getInstance();
            await apiService.askCopilotStream(code, query, onChunk);
            this.statusBarManager.setReady();
        } catch (error) {
            this.statusBarManager.setError('AI streaming failed');
            throw error;
        }
    }

    async explainCode(document: vscode.TextDocument, selection?: vscode.Selection): Promise<void> {
        const code = selection && !selection.isEmpty
            ? document.getText(selection)
            : document.getText();

        const query = 'Explain what this Solidity code does and identify any potential issues.';

        try {
            const response = await this.ask(code, query);

            // Show in new document
            const doc = await vscode.workspace.openTextDocument({
                content: `# Code Explanation\n\n## Query\n${query}\n\n## Code\n\`\`\`solidity\n${code}\n\`\`\`\n\n## Explanation\n${response}`,
                language: 'markdown',
            });

            await vscode.window.showTextDocument(doc, {
                viewColumn: vscode.ViewColumn.Beside,
                preview: false,
            });
        } catch (error) {
            vscode.window.showErrorMessage(
                `Explain failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async fixIssues(document: vscode.TextDocument): Promise<void> {
        const code = document.getText();
        const query = 'Identify security issues and vulnerabilities in this code and suggest fixes.';

        try {
            const response = await this.ask(code, query);

            const doc = await vscode.workspace.openTextDocument({
                content: `# Security Fixes\n\n## Code Analyzed\n\`\`\`solidity\n${code}\n\`\`\`\n\n## Suggested Fixes\n${response}`,
                language: 'markdown',
            });

            await vscode.window.showTextDocument(doc, {
                viewColumn: vscode.ViewColumn.Beside,
                preview: false,
            });
        } catch (error) {
            vscode.window.showErrorMessage(
                `Fix analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async optimizeCode(document: vscode.TextDocument): Promise<void> {
        const code = document.getText();
        const query = 'Suggest gas optimization improvements for this Solidity code.';

        try {
            const response = await this.ask(code, query);

            const doc = await vscode.workspace.openTextDocument({
                content: `# Gas Optimization Suggestions\n\n## Code\n\`\`\`solidity\n${code}\n\`\`\`\n\n## Optimizations\n${response}`,
                language: 'markdown',
            });

            await vscode.window.showTextDocument(doc, {
                viewColumn: vscode.ViewColumn.Beside,
                preview: false,
            });
        } catch (error) {
            vscode.window.showErrorMessage(
                `Optimization suggestions failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async generateTests(document: vscode.TextDocument): Promise<void> {
        const code = document.getText();
        const query = 'Generate comprehensive unit tests for this Solidity contract using Hardhat/Foundry.';

        try {
            const response = await this.ask(code, query);

            const doc = await vscode.workspace.openTextDocument({
                content: `# Generated Tests\n\n## Contract\n\`\`\`solidity\n${code}\n\`\`\`\n\n## Test Code\n${response}`,
                language: 'markdown',
            });

            await vscode.window.showTextDocument(doc, {
                viewColumn: vscode.ViewColumn.Beside,
                preview: false,
            });
        } catch (error) {
            vscode.window.showErrorMessage(
                `Test generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async summarize(document: vscode.TextDocument): Promise<void> {
        const code = document.getText();
        const query = 'Provide a concise summary of what this smart contract does and its key features.';

        try {
            const response = await this.ask(code, query);

            vscode.window.showInformationMessage(response, { modal: true });
        } catch (error) {
            vscode.window.showErrorMessage(
                `Summarize failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }
}
