import { config } from "dotenv";
import * as readline from 'readline';
import { loadConfig } from "./mcp-client/config.js";
import { MCPToolClient } from "./mcp-client/client.js";
import { GeminiClient } from "./llm-clients/gemini.js";

config();

async function main() {
    // 初期メッセージの取得
    const args = process.argv.slice(2);
    const initialMessage = args.length > 0 ? args.join(" ") : "";

    try {
        // 設定ファイルの読み込み
        const serverConfig = await loadConfig();

        // MCPツールクライアントの初期化
        const mcpTools = new MCPToolClient(serverConfig);
        const geminiClient = new GeminiClient(process.env.GEMINI_API_KEY as string, mcpTools);
        const { tools } = await mcpTools.initialize();
        const chat = await geminiClient.startChat({ tools });

        // 標準入力の設定
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // プロンプトを表示する関数
        function showPrompt() {
            rl.question('\n質問を入力してください（終了するには「exit」と入力）: ', async (input) => {
                const shouldContinue = await geminiClient.processMessage(chat, input);
                if (shouldContinue) {
                    showPrompt(); // 再帰的にプロンプトを表示
                } else {
                    rl.close();
                }
            });
        }

        console.log('対話型チャットを開始します。終了するには「exit」「quit」「終了」と入力してください。');

        // 初期メッセージがあれば処理
        if (initialMessage) {
            await geminiClient.processMessage(chat, initialMessage);
        }

        // 対話の開始
        showPrompt();

    } catch (error) {
        console.error("エラー:", error);
    }
}

main();