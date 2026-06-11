import * as vscode from 'vscode';

export class ReportsViewProvider implements vscode.TreeDataProvider<ReportItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ReportItem | undefined | null | void> =
        new vscode.EventEmitter<ReportItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ReportItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    constructor() { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ReportItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ReportItem): Thenable<ReportItem[]> {
        if (!element) {
            return Promise.resolve([
                new ReportItem(
                    'Generate New Report',
                    'Create comprehensive report',
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'mantleguard.generateReport',
                        title: 'Generate Report',
                    }
                ),
                new ReportItem(
                    'Recent Reports',
                    'View generated reports',
                    vscode.TreeItemCollapsibleState.None
                ),
                new ReportItem(
                    'Export Options',
                    'PDF, Markdown, JSON',
                    vscode.TreeItemCollapsibleState.None
                ),
            ]);
        }
        return Promise.resolve([]);
    }
}

class ReportItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tooltip: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.tooltip = tooltip;
    }

    iconPath = new vscode.ThemeIcon('file-pdf');
}
