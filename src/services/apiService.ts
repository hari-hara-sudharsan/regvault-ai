import axios, { AxiosInstance } from 'axios';
import * as vscode from 'vscode';

export interface AnalysisResult {
    success: boolean;
    issues?: any[];
    gasScore?: number;
    securityScore?: number;
    estimatedSavings?: number;
    findings?: SecurityFinding[];
    suggestions?: GasSuggestion[];
}

export interface SecurityFinding {
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    message: string;
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
    code?: string;
    fix?: string;
}

export interface GasSuggestion {
    title: string;
    description: string;
    line: number;
    currentCost: number;
    optimizedCost: number;
    savings: number;
    fix?: string;
}

export class ApiService {
    private static instance: ApiService;
    private axiosInstance: AxiosInstance;
    private apiUrl: string;

    private constructor() {
        const config = vscode.workspace.getConfiguration('mantleguard');
        this.apiUrl = config.get<string>('apiUrl', 'http://localhost:3000');

        this.axiosInstance = axios.create({
            baseURL: this.apiUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    public updateApiUrl(url: string) {
        this.apiUrl = url;
        this.axiosInstance.defaults.baseURL = url;
    }

    // Health check
    async checkHealth(): Promise<boolean> {
        try {
            const response = await this.axiosInstance.get('/health');
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    // Analyze contract
    async analyzeContract(code: string, fileName: string): Promise<AnalysisResult> {
        try {
            const response = await this.axiosInstance.post('/api/analyze', {
                code,
                fileName,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Security audit
    async auditContract(code: string, fileName: string): Promise<AnalysisResult> {
        try {
            const response = await this.axiosInstance.post('/api/audit', {
                code,
                fileName,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Gas optimization
    async optimizeGas(code: string, fileName: string): Promise<AnalysisResult> {
        try {
            const response = await this.axiosInstance.post('/api/gas/optimize', {
                code,
                fileName,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Gas analysis
    async analyzeGas(code: string, fileName: string): Promise<AnalysisResult> {
        try {
            const response = await this.axiosInstance.post('/api/gas/analyze', {
                code,
                fileName,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // AI Copilot
    async askCopilot(code: string, query: string): Promise<{ response: string }> {
        try {
            const response = await this.axiosInstance.post('/api/copilot', {
                code,
                query,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Streaming AI response
    async askCopilotStream(
        code: string,
        query: string,
        onChunk: (chunk: string) => void
    ): Promise<void> {
        try {
            const response = await this.axiosInstance.post(
                '/api/copilot/stream',
                { code, query },
                { responseType: 'stream' }
            );

            // Handle streaming response
            if (response.data) {
                let buffer = '';
                response.data.on('data', (chunk: Buffer) => {
                    buffer += chunk.toString();
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') {
                                return;
                            }
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.content) {
                                    onChunk(parsed.content);
                                }
                            } catch (e) {
                                // Ignore parse errors
                            }
                        }
                    }
                });
            }
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Generate report
    async generateReport(code: string, fileName: string): Promise<AnalysisResult> {
        try {
            const response = await this.axiosInstance.post('/api/reports/generate', {
                code,
                fileName,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get reports
    async getReports(): Promise<any> {
        try {
            const response = await this.axiosInstance.get('/api/reports');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Quick fix
    async getQuickFix(code: string, line: number, issue: string): Promise<{ fix: string }> {
        try {
            const response = await this.axiosInstance.post('/api/quickfix', {
                code,
                line,
                issue,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message;
            return new Error(`API Error: ${message}`);
        }
        return error instanceof Error ? error : new Error('Unknown error occurred');
    }
}
