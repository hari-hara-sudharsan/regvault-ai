import * as vscode from 'vscode';

export class AuditViewProvider implements vscode.TreeDataProvider<AuditItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<AuditItem | undefined | null | void> =
        new vscode.EventEmitter<AuditItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<AuditItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    constructor() { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: AuditItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: AuditItem): Thenable<AuditItem[]> {
        if (!element) {
            return Promise.resolve([
                new AuditItem(
                    'Audit Current Contract',
                    'Run security audit',
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'mantleguard.auditContract',
                        title: 'Audit Contract',
                    }
                ),
                new AuditItem(
                    'View Issues',
                    'See detected vulnerabilities',
                    vscode.TreeItemCollapsibleState.None
                ),
                new AuditItem(
                    'Security Score',
                    'Overall security rating',
                    vscode.TreeItemCollapsibleState.None
                ),
            ]);
        }
        return Promise.resolve([]);
    }
}

class AuditItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tooltip: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.tooltip = tooltip;
    }

    iconPath = new vscode.ThemeIcon('shield');
}
