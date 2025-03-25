import { Client as MCPClient } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { ServerConfig } from "./config.js";

export class MCPToolClient {
    private mcpClient!: MCPClient;

    constructor(private config: ServerConfig) { }

    async initialize() {
        // サーバー接続の設定
        const transport = new StdioClientTransport(this.config.server);
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