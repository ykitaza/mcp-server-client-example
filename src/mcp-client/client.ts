import { Client as MCPClient } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { ServerConfig } from "./config.js";

export class MCPToolClient {
    private mcpClient!: MCPClient;

    constructor(private config: ServerConfig) { }

    async initialize() {
        // 最初のサーバー設定を使用
        const serverKey = Object.keys(this.config)[0];
        if (!serverKey) {
            throw new Error('サーバー設定が見つかりません');
        }

        const serverConfig = this.config[serverKey];
        if (!serverConfig) {
            throw new Error(`サーバー設定"${serverKey}"が見つかりません`);
        }

        // サーバー接続の設定
        const transport = new StdioClientTransport(serverConfig);
        this.mcpClient = new MCPClient({ name: "gemini-mcp-client", version: "1.0.0" });
        await this.mcpClient.connect(transport);

        // 利用可能なツールの取得
        return await this.mcpClient.listTools();
    }

    async listTools() {
        return await this.mcpClient.listTools();
    }

    async callTool(params: { name: string; arguments: Record<string, unknown> }) {
        return await this.mcpClient.callTool(params);
    }
}