import * as vscode from 'vscode';

export class DashboardViewProvider implements vscode.TreeDataProvider<DashboardItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<DashboardItem | undefined | null | void> =
        new vscode.EventEmitter<DashboardItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<DashboardItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    constructor() { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: DashboardItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: DashboardItem): Thenable<DashboardItem[]> {
        if (!element) {
            return Promise.resolve([
                new DashboardItem(
                    'Open Web Dashboard',
                    'Launch MantleGuard web interface',
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'mantleguard.openDashboard',
                        title: 'Open Dashboard',
                    }
                ),
                new DashboardItem(
                    'Quick Stats',
                    'View project statistics',
                    vscode.TreeItemCollapsibleState.None
                ),
                new DashboardItem(
                    'Recent Activity',
                    'View recent scans and audits',
                    vscode.TreeItemCollapsibleState.None
                ),
            ]);
        }
        return Promise.resolve([]);
    }
}

class DashboardItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tooltip: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.tooltip = tooltip;
        this.description = '';
    }

    iconPath = new vscode.ThemeIcon('home');
}
