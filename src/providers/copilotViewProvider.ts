import * as vscode from 'vscode';

export class CopilotViewProvider implements vscode.TreeDataProvider<CopilotItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CopilotItem | undefined | null | void> =
        new vscode.EventEmitter<CopilotItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<CopilotItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    constructor() { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: CopilotItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CopilotItem): Thenable<CopilotItem[]> {
        if (!element) {
            return Promise.resolve([
                new CopilotItem(
                    'Ask AI Copilot',
                    'Get AI assistance',
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'mantleguard.aiCopilot',
                        title: 'AI Copilot',
                    }
                ),
                new CopilotItem(
                    'Explain Code',
                    'Get code explanation',
                    vscode.TreeItemCollapsibleState.None
                ),
                new CopilotItem(
                    'Suggest Improvements',
                    'AI-powered suggestions',
                    vscode.TreeItemCollapsibleState.None
                ),
            ]);
        }
        return Promise.resolve([]);
    }
}

class CopilotItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tooltip: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.tooltip = tooltip;
    }

    iconPath = new vscode.ThemeIcon('robot');
}
