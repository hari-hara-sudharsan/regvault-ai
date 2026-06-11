import * as vscode from 'vscode';
import { ApiService } from '../services/apiService';

interface HoverData {
    gasScore?: number;
    securityScore?: number;
    optimizations?: string[];
    aiSuggestions?: string[];
}

export class MantleGuardHoverProvider implements vscode.HoverProvider {
    private hoverCache: Map<string, HoverData> = new Map();

    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | null> {
        if (document.languageId !== 'solidity') {
            return null;
        }

        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }

        const word = document.getText(wordRange);
        const line = document.lineAt(position.line).text;

        // Check if hovering over a function
        const functionMatch = line.match(/function\s+(\w+)\s*\(/);
        if (!functionMatch || functionMatch[1] !== word) {
            return null;
        }

        const functionName = word;
        const cacheKey = `${document.uri.toString()}:${functionName}`;

        // Check cache first
        if (this.hoverCache.has(cacheKey)) {
            return this.createHoverContent(functionName, this.hoverCache.get(cacheKey)!);
        }

        // Show loading hover
        const loadingMarkdown = new vscode.MarkdownString();
        loadingMarkdown.appendMarkdown(`### 🛡️ ${functionName}()\n\n`);
        loadingMarkdown.appendMarkdown('⏳ Loading analysis...\n');

        // Fetch data asynchronously (don't await, return loading immediately)
        this.fetchHoverData(document, functionName, cacheKey);

        return new vscode.Hover(loadingMarkdown, wordRange);
    }

    private async fetchHoverData(
        document: vscode.TextDocument,
        functionName: string,
        cacheKey: string
    ): Promise<void> {
        try {
            // Extract function code
            const text = document.getText();
            const lines = text.split('\n');

            let functionLine = -1;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes(`function ${functionName}`)) {
                    functionLine = i;
                    break;
                }
            }

            if (functionLine === -1) {
                return;
            }

            // For now, generate mock data
            // In production, call API: await apiService.analyzeFunction(...)
            const mockData: HoverData = {
                gasScore: Math.floor(Math.random() * 40) + 60, // 60-100
                securityScore: Math.floor(Math.random() * 30) + 70, // 70-100
                optimizations: [
                    'Use `unchecked` for gas savings',
                    'Cache storage variable in memory',
                    'Use custom errors instead of require strings',
                ],
                aiSuggestions: [
                    'Consider adding input validation',
                    'Emit an event after state changes',
                    'Add reentrancy guard',
                ],
            };

            this.hoverCache.set(cacheKey, mockData);
        } catch (error) {
            console.error('Hover data fetch failed:', error);
        }
    }

    private createHoverContent(functionName: string, data: HoverData): vscode.Hover {
        const markdown = new vscode.MarkdownString();
        markdown.isTrusted = true;
        markdown.supportHtml = true;

        markdown.appendMarkdown(`### 🛡️ ${functionName}()\n\n`);

        // Scores
        if (data.gasScore !== undefined) {
            const gasEmoji = data.gasScore >= 80 ? '🟢' : data.gasScore >= 60 ? '🟡' : '🔴';
            markdown.appendMarkdown(`**⚡ Gas Score:** ${gasEmoji} ${data.gasScore}/100\n\n`);
        }

        if (data.securityScore !== undefined) {
            const secEmoji = data.securityScore >= 90 ? '🟢' : data.securityScore >= 70 ? '🟡' : '🔴';
            markdown.appendMarkdown(`**🛡️ Security Score:** ${secEmoji} ${data.securityScore}/100\n\n`);
        }

        // Optimizations
        if (data.optimizations && data.optimizations.length > 0) {
            markdown.appendMarkdown(`**💡 Optimizations:**\n`);
            data.optimizations.slice(0, 3).forEach((opt) => {
                markdown.appendMarkdown(`- ${opt}\n`);
            });
            markdown.appendMarkdown('\n');
        }

        // AI Suggestions
        if (data.aiSuggestions && data.aiSuggestions.length > 0) {
            markdown.appendMarkdown(`**🤖 AI Suggestions:**\n`);
            data.aiSuggestions.slice(0, 3).forEach((suggestion) => {
                markdown.appendMarkdown(`- ${suggestion}\n`);
            });
            markdown.appendMarkdown('\n');
        }

        // Actions
        markdown.appendMarkdown('---\n\n');
        markdown.appendMarkdown(
            `[$(shield) Analyze](command:mantleguard.analyzeFunction?${encodeURIComponent(JSON.stringify([functionName]))}) | `
        );
        markdown.appendMarkdown(
            `[$(dashboard) Optimize](command:mantleguard.optimizeFunction?${encodeURIComponent(JSON.stringify([functionName]))}) | `
        );
        markdown.appendMarkdown(
            `[$(robot) Ask AI](command:mantleguard.askAIAboutFunction?${encodeURIComponent(JSON.stringify([functionName]))})`
        );

        return new vscode.Hover(markdown);
    }

    public clearCache(): void {
        this.hoverCache.clear();
    }
}
