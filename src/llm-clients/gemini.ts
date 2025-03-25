import { GenerativeModel, GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { MCPToolClient } from "../mcp-client/client.js";

// ツール型の定義を追加
interface ToolDefinition {
    name: string;
    description?: string;
    inputSchema: {
        type: string;
        properties?: Record<string, any>;
        required?: string[];
    };
}

export class GeminiClient {
    private genAI: GoogleGenerativeAI;
    private model!: GenerativeModel;
    private mcpTools: MCPToolClient;

    constructor(apiKey: string, mcpTools: MCPToolClient) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.mcpTools = mcpTools;
    }

    async startChat(tools: { tools: ToolDefinition[] }) {
        // Geminiモデルの設定
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-2.0-pro-exp-02-05",
        });

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseModalities: [],
            responseMimeType: "text/plain",
        };

        // チャットセッションの開始
        const chat = this.model.startChat({
            generationConfig,
            tools: [{
                functionDeclarations: tools.tools.map((tool: ToolDefinition) => ({
                    name: tool.name,
                    description: tool.description || "",
                    parameters: {
                        type: tool.inputSchema.type.toUpperCase() as SchemaType,
                        properties: tool.inputSchema.properties || {},
                        required: tool.inputSchema.required || []
                    }
                }))
            }]
        });

        return chat;
    }

    async processMessage(chat: any, message: string) {
        try {
            if (!message.trim()) {
                return true; // 空のメッセージは無視
            }

            // 終了コマンドのチェック
            if (message.toLowerCase() === 'exit' ||
                message.toLowerCase() === 'quit' ||
                message.toLowerCase() === '終了') {
                console.log('チャットを終了します。');
                return false;
            }

            console.log(`送信メッセージ: "${message}"`);
            const result = await chat.sendMessage(message);

            // 応答の処理
            const candidates = result.response.candidates;

            if (candidates && candidates.length > 0) {
                for (const candidate of candidates) {
                    if (candidate.content?.parts[0]?.functionCall) {
                        const functionCall = candidate.content.parts[0].functionCall;
                        console.log("関数呼び出し:", functionCall);

                        // MCPクライアントで関数を実行
                        const toolResult = await this.mcpTools.callTool({
                            name: functionCall.name,
                            arguments: functionCall.args as Record<string, unknown>
                        });
                        console.log("ツール結果:", toolResult);

                        // ツールの結果を使用して自然言語の回答を生成
                        let toolResponseText = "";
                        if (toolResult.content && Array.isArray(toolResult.content)) {
                            for (const item of toolResult.content) {
                                if (item.type === "text") {
                                    toolResponseText += item.text + "\n";
                                }
                            }
                        }

                        // ツールの結果をGeminiに渡して回答を生成
                        const followUpPrompt = `以下のツールの実行結果を自然な日本語で説明してください：\n${toolResponseText}`;
                        const followUpResult = await chat.sendMessage(followUpPrompt);
                        console.log("\n応答：");
                        console.log(await followUpResult.response.text());
                        return true;
                    }
                }
            }

            // ツール呼び出しがない場合は通常の応答を表示
            console.log("応答:", await result.response.text());
            return true;

        } catch (error) {
            console.error("メッセージ処理エラー:", error);
            return true;
        }
    }
}