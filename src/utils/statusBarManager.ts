import * as vscode from 'vscode';

export class StatusBarManager {
    private static instance: StatusBarManager;
    private statusBarItem: vscode.StatusBarItem;
    private intervalId?: NodeJS.Timeout;
    private currentState: 'ready' | 'analyzing' | 'error' = 'ready';

    private constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'mantleguard.openDashboard';
        this.updateStatus('ready');
        this.statusBarItem.show();
    }

    public static getInstance(): StatusBarManager {
        if (!StatusBarManager.instance) {
            StatusBarManager.instance = new StatusBarManager();
        }
        return StatusBarManager.instance;
    }

    public updateStatus(
        state: 'ready' | 'analyzing' | 'error',
        message?: string
    ): void {
        this.currentState = state;
        this.stopAnimation();

        switch (state) {
            case 'ready':
                this.statusBarItem.text = '$(shield) MantleGuard Ready';
                this.statusBarItem.tooltip = 'MantleGuard Security Suite - Click to open dashboard';
                this.statusBarItem.backgroundColor = undefined;
                this.statusBarItem.color = undefined;
                break;

            case 'analyzing':
                this.startAnalyzingAnimation();
                this.statusBarItem.tooltip = message || 'Analyzing contract...';
                this.statusBarItem.backgroundColor = undefined;
                break;

            case 'error':
                this.statusBarItem.text = '$(alert) MantleGuard Error';
                this.statusBarItem.tooltip = message || 'An error occurred';
                this.statusBarItem.backgroundColor = new vscode.ThemeColor(
                    'statusBarItem.errorBackground'
                );
                this.statusBarItem.color = new vscode.ThemeColor(
                    'statusBarItem.errorForeground'
                );
                // Auto-reset after 5 seconds
                setTimeout(() => {
                    if (this.currentState === 'error') {
                        this.updateStatus('ready');
                    }
                }, 5000);
                break;
        }
    }

    private startAnalyzingAnimation(): void {
        const frames = [
            '$(sync~spin) Analyzing',
            '$(sync~spin) Analyzing.',
            '$(sync~spin) Analyzing..',
            '$(sync~spin) Analyzing...',
        ];
        let frameIndex = 0;

        this.intervalId = setInterval(() => {
            this.statusBarItem.text = frames[frameIndex];
            frameIndex = (frameIndex + 1) % frames.length;
        }, 300);
    }

    private stopAnimation(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    public setAnalyzing(message?: string): void {
        this.updateStatus('analyzing', message);
    }

    public setReady(message?: string): void {
        this.updateStatus('ready', message);
    }

    public setError(message?: string): void {
        this.updateStatus('error', message);
    }

    public setProgress(current: number, total: number, operation: string): void {
        const percentage = Math.round((current / total) * 100);
        this.statusBarItem.text = `$(sync~spin) ${operation} ${percentage}%`;
        this.statusBarItem.tooltip = `${operation}: ${current}/${total} completed`;
    }

    public dispose(): void {
        this.stopAnimation();
        this.statusBarItem.dispose();
    }

    public getStatusBarItem(): vscode.StatusBarItem {
        return this.statusBarItem;
    }
}
