import * as vscode from 'vscode';

export function openDashboard() {
    const config = vscode.workspace.getConfiguration('mantleguard');
    const apiUrl = config.get<string>('apiUrl', 'http://localhost:3000');

    vscode.env.openExternal(vscode.Uri.parse(apiUrl));
    vscode.window.showInformationMessage('Opening MantleGuard Dashboard...');
}
