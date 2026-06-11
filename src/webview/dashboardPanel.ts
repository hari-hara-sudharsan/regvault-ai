import * as vscode from 'vscode';
import * as path from 'path';

export class DashboardPanel {
    public static currentPanel: DashboardPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it
        if (DashboardPanel.currentPanel) {
            DashboardPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(
            'mantleguardDashboard',
            'MantleGuard Dashboard',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'out'),
                    vscode.Uri.joinPath(extensionUri, 'webview'),
                    vscode.Uri.joinPath(extensionUri, 'media'),
                ],
            }
        );

        DashboardPanel.currentPanel = new DashboardPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.command) {
                    case 'analyze':
                        vscode.commands.executeCommand('mantleguard.analyzeContract');
                        break;
                    case 'audit':
                        vscode.commands.executeCommand('mantleguard.auditContract');
                        break;
                    case 'optimize':
                        vscode.commands.executeCommand('mantleguard.optimizeGas');
                        break;
                    case 'alert':
                        vscode.window.showInformationMessage(message.text);
                        break;
                }
            },
            null,
            this._disposables
        );
    }

    public dispose() {
        DashboardPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the config to determine API URL
        const config = vscode.workspace.getConfiguration('mantleguard');
        const apiUrl = config.get<string>('apiUrl', 'http://localhost:3000');

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; 
          style-src ${webview.cspSource} 'unsafe-inline'; 
          script-src ${webview.cspSource} 'unsafe-inline'; 
          connect-src ${apiUrl} http://localhost:3000 https://localhost:3000;
          img-src ${webview.cspSource} https: data:;
          font-src ${webview.cspSource};">
    <title>MantleGuard Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            height: 100vh;
            overflow: hidden;
        }
        #root {
            width: 100%;
            height: 100%;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            flex-direction: column;
            gap: 20px;
        }
        .spinner {
            border: 4px solid var(--vscode-progressBar-background);
            border-top: 4px solid var(--vscode-button-background);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .error {
            padding: 20px;
            color: var(--vscode-errorForeground);
        }
        .fallback {
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        .fallback h1 {
            margin-bottom: 20px;
        }
        .fallback .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .card {
            background: var(--vscode-editor-inactiveSelectionBackground);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid var(--vscode-panel-border);
        }
        .card h3 {
            margin-bottom: 10px;
            color: var(--vscode-textLink-foreground);
        }
        .card button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }
        .card button:hover {
            background: var(--vscode-button-hoverBackground);
        }
    </style>
</head>
<body>
    <div id="root">
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading MantleGuard Dashboard...</p>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const apiUrl = '${apiUrl}';
        
        // Try to load the React dashboard in iframe
        function loadDashboard() {
            const root = document.getElementById('root');
            
            // Check if backend is running
            fetch(apiUrl + '/health')
                .then(response => {
                    if (response.ok) {
                        // Backend is running, load full dashboard
                        root.innerHTML = '<iframe src="' + apiUrl + '"></iframe>';
                    } else {
                        throw new Error('Backend not responding');
                    }
                })
                .catch(error => {
                    console.error('Failed to connect to backend:', error);
                    // Show fallback UI
                    showFallbackUI();
                });
        }

        function showFallbackUI() {
            const root = document.getElementById('root');
            root.innerHTML = \`
                <div class="fallback">
                    <h1>🛡️ MantleGuard Dashboard</h1>
                    <p>Unable to connect to backend at <code>\${apiUrl}</code></p>
                    <p>Start your backend server to access the full dashboard, or use quick actions below:</p>
                    
                    <div class="cards">
                        <div class="card">
                            <h3>⚡ Gas Analysis</h3>
                            <p>Analyze gas consumption and get optimization suggestions.</p>
                            <button onclick="analyze()">Analyze Contract</button>
                        </div>
                        
                        <div class="card">
                            <h3>🛡️ Security Audit</h3>
                            <p>Run comprehensive security vulnerability scan.</p>
                            <button onclick="audit()">Run Audit</button>
                        </div>
                        
                        <div class="card">
                            <h3>🔧 Optimize</h3>
                            <p>Get gas optimization recommendations.</p>
                            <button onclick="optimize()">Optimize Gas</button>
                        </div>
                        
                        <div class="card">
                            <h3>📊 Reports</h3>
                            <p>Generate comprehensive audit reports.</p>
                            <button onclick="generateReport()">Generate Report</button>
                        </div>
                    </div>
                </div>
            \`;
        }

        function analyze() {
            vscode.postMessage({ command: 'analyze' });
        }

        function audit() {
            vscode.postMessage({ command: 'audit' });
        }

        function optimize() {
            vscode.postMessage({ command: 'optimize' });
        }

        function generateReport() {
            vscode.postMessage({ command: 'alert', text: 'Report generation coming soon!' });
        }

        // Load dashboard on startup
        setTimeout(loadDashboard, 1000);
    </script>
</body>
</html>`;
    }
}
