import * as vscode from 'vscode';

export class SettingsViewProvider implements vscode.TreeDataProvider<SettingsItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<SettingsItem | undefined | null | void> =
        new vscode.EventEmitter<SettingsItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<SettingsItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    constructor() { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: SettingsItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: SettingsItem): Thenable<SettingsItem[]> {
        if (!element) {
            const config = vscode.workspace.getConfiguration('mantleguard');
            const apiUrl = config.get<string>('apiUrl', 'http://localhost:3000');
            const autoAnalysis = config.get<boolean>('enableAutoAnalysis', true);

            return Promise.resolve([
                new SettingsItem(
                    'API URL',
                    `Current: ${apiUrl}`,
                    vscode.TreeItemCollapsibleState.None
                ),
                new SettingsItem(
                    'Auto Analysis',
                    `Status: ${autoAnalysis ? 'Enabled' : 'Disabled'}`,
                    vscode.TreeItemCollapsibleState.None
                ),
                new SettingsItem(
                    'Open Settings',
                    'Configure extension',
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'workbench.action.openSettings',
                        title: 'Open Settings',
                        arguments: ['mantleguard'],
                    }
                ),
            ]);
        }
        return Promise.resolve([]);
    }
}

class SettingsItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tooltip: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.tooltip = tooltip;
        this.description = tooltip.startsWith('Current:') || tooltip.startsWith('Status:')
            ? tooltip.split(': ')[1]
            : '';
    }

    iconPath = new vscode.ThemeIcon('settings-gear');
}
