import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { compareNumbers } from "./tools/compare-numbers.js";
import { z } from "zod";

const config = {
    server: {
        name: "simple-mcp-server",
        version: "0.1.0",
    },
};

const server = new McpServer(config.server);
server.tool(
    "compare-numbers",
    {
        number1: z.number(),
        number2: z.number(),
    },
    async ({ number1, number2 }) => {
        return await compareNumbers({ number1, number2 });
    }
);

const transport = new StdioServerTransport();
console.error("Starting MCP server...");
await server.connect(transport);
console.error("Server connected and ready to handle requests.");