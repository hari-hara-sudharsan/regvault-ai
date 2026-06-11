import * as vscode from 'vscode';
import { ApiService } from '../services/apiService';

export class AIChatViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'mantleguard.aiChat';
    private _view?: vscode.WebviewView;
    private _conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [];

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'sendMessage':
                    await this.handleUserMessage(data.message);
                    break;
                case 'useExample':
                    await this.handleUserMessage(data.message);
                    break;
                case 'clearChat':
                    this._conversationHistory = [];
                    this.sendMessageToWebview({ type: 'clearChat' });
                    break;
            }
        });
    }

    private async handleUserMessage(message: string) {
        if (!message.trim()) {
            return;
        }

        // Add user message to conversation
        this._conversationHistory.push({ role: 'user', content: message });

        // Show user message in webview
        this.sendMessageToWebview({
            type: 'userMessage',
            message: message,
        });

        // Get active editor context
        const editor = vscode.window.activeTextEditor;
        let contextCode = '';

        if (editor && editor.document.languageId === 'solidity') {
            const selection = editor.selection;
            contextCode = editor.document.getText(selection.isEmpty ? undefined : selection);
        }

        try {
            // Show typing indicator
            this.sendMessageToWebview({ type: 'typing', isTyping: true });

            // Call API with streaming
            const apiService = ApiService.getInstance();
            const response = await apiService.askCopilot(contextCode, message);

            // Add assistant response to conversation
            this._conversationHistory.push({ role: 'assistant', content: response.response || '' });

            // Send response to webview (simulate streaming for now)
            this.streamResponse(response.response || 'No response from AI');
        } catch (error) {
            this.sendMessageToWebview({
                type: 'error',
                message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
        } finally {
            this.sendMessageToWebview({ type: 'typing', isTyping: false });
        }
    }

    private streamResponse(response: string) {
        // Simulate streaming by sending chunks
        const chunkSize = 20;
        let index = 0;

        const streamInterval = setInterval(() => {
            if (index >= response.length) {
                clearInterval(streamInterval);
                this.sendMessageToWebview({ type: 'streamComplete' });
                return;
            }

            const chunk = response.slice(index, index + chunkSize);
            this.sendMessageToWebview({
                type: 'streamChunk',
                chunk: chunk,
            });

            index += chunkSize;
        }, 50);
    }

    private sendMessageToWebview(message: any) {
        this._view?.webview.postMessage(message);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MantleGuard AI Chat</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 10px;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            padding: 10px;
            border-bottom: 1px solid var(--vscode-panel-border);
            margin-bottom: 10px;
        }
        .header h2 {
            font-size: 16px;
            margin-bottom: 10px;
        }
        .examples {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
        }
        .example-btn {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        }
        .example-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .message {
            padding: 10px;
            border-radius: 5px;
            max-width: 90%;
            word-wrap: break-word;
        }
        .user-message {
            background: var(--vscode-inputOption-activeBackground);
            align-self: flex-end;
            margin-left: auto;
        }
        .assistant-message {
            background: var(--vscode-editor-inactiveSelectionBackground);
            align-self: flex-start;
            white-space: pre-wrap;
        }
        .typing-indicator {
            padding: 10px;
            font-style: italic;
            opacity: 0.7;
        }
        .error-message {
            color: var(--vscode-errorForeground);
            padding: 10px;
            border: 1px solid var(--vscode-errorForeground);
            border-radius: 5px;
        }
        .input-container {
            display: flex;
            gap: 5px;
            padding: 10px;
            border-top: 1px solid var(--vscode-panel-border);
        }
        #messageInput {
            flex: 1;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            padding: 8px;
            border-radius: 3px;
            font-family: inherit;
            font-size: inherit;
        }
        .send-btn, .clear-btn {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 15px;
            border-radius: 3px;
            cursor: pointer;
        }
        .send-btn:hover, .clear-btn:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .clear-btn {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        code {
            background: var(--vscode-textCodeBlock-background);
            padding: 2px 4px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>🤖 Ask MantleGuard</h2>
        <div class="examples">
            <button class="example-btn" onclick="useExample('Explain this contract')">📖 Explain</button>
            <button class="example-btn" onclick="useExample('Fix security issues')">🔧 Fix</button>
            <button class="example-btn" onclick="useExample('Optimize gas usage')">⚡ Optimize</button>
            <button class="example-btn" onclick="useExample('Summarize this code')">📝 Summarize</button>
            <button class="example-btn" onclick="useExample('Generate tests')">🧪 Tests</button>
        </div>
    </div>
    
    <div id="chatContainer" class="chat-container"></div>
    
    <div class="input-container">
        <input 
            type="text" 
            id="messageInput" 
            placeholder="Ask about your Solidity code..."
            onkeypress="handleKeyPress(event)"
        />
        <button class="send-btn" onclick="sendMessage()">Send</button>
        <button class="clear-btn" onclick="clearChat()">Clear</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let currentAssistantMessage = null;

        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.type) {
                case 'userMessage':
                    addUserMessage(message.message);
                    break;
                case 'typing':
                    if (message.isTyping) {
                        showTypingIndicator();
                    } else {
                        hideTypingIndicator();
                    }
                    break;
                case 'streamChunk':
                    appendToAssistantMessage(message.chunk);
                    break;
                case 'streamComplete':
                    completeAssistantMessage();
                    break;
                case 'error':
                    showError(message.message);
                    break;
                case 'clearChat':
                    document.getElementById('chatContainer').innerHTML = '';
                    break;
            }
        });

        function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (message) {
                vscode.postMessage({
                    type: 'sendMessage',
                    message: message
                });
                input.value = '';
            }
        }

        function useExample(message) {
            vscode.postMessage({
                type: 'useExample',
                message: message
            });
        }

        function clearChat() {
            vscode.postMessage({ type: 'clearChat' });
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        function addUserMessage(text) {
            const container = document.getElementById('chatContainer');
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message user-message';
            msgDiv.textContent = text;
            container.appendChild(msgDiv);
            container.scrollTop = container.scrollHeight;
        }

        function showTypingIndicator() {
            const container = document.getElementById('chatContainer');
            const typing = document.createElement('div');
            typing.id = 'typing';
            typing.className = 'typing-indicator';
            typing.textContent = '🤖 Thinking...';
            container.appendChild(typing);
            container.scrollTop = container.scrollHeight;
        }

        function hideTypingIndicator() {
            const typing = document.getElementById('typing');
            if (typing) {
                typing.remove();
            }
        }

        function appendToAssistantMessage(chunk) {
            const container = document.getElementById('chatContainer');
            
            if (!currentAssistantMessage) {
                currentAssistantMessage = document.createElement('div');
                currentAssistantMessage.className = 'message assistant-message';
                currentAssistantMessage.id = 'currentMessage';
                container.appendChild(currentAssistantMessage);
            }
            
            currentAssistantMessage.textContent += chunk;
            container.scrollTop = container.scrollHeight;
        }

        function completeAssistantMessage() {
            currentAssistantMessage = null;
        }

        function showError(text) {
            const container = document.getElementById('chatContainer');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = text;
            container.appendChild(errorDiv);
            container.scrollTop = container.scrollHeight;
        }
    </script>
</body>
</html>`;
    }
}
