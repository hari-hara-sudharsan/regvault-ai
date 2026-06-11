import * as vscode from 'vscode';

export class GasViewProvider implements vscode.TreeDataProvider<GasItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<GasItem | undefined | null | void> =
        new vscode.EventEmitter<GasItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<GasItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    constructor() { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: GasItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: GasItem): Thenable<GasItem[]> {
        if (!element) {
            return Promise.resolve([
                new GasItem(
                    'Optimize Current Contract',
                    'Run gas optimization analysis',
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'mantleguard.optimizeGas',
                        title: 'Optimize Gas',
                    }
                ),
                new GasItem(
                    'Gas Reports',
                    'View gas optimization reports',
                    vscode.TreeItemCollapsibleState.None
                ),
                new GasItem(
                    'Best Practices',
                    'Learn gas optimization techniques',
                    vscode.TreeItemCollapsibleState.None
                ),
            ]);
        }
        return Promise.resolve([]);
    }
}

class GasItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tooltip: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.tooltip = tooltip;
    }

    iconPath = new vscode.ThemeIcon('dashboard');
}
