import { readFile } from 'fs/promises';
import { join } from 'path';

export interface ServerConfig {
    server: {
        command: string;
        args: string[];
    };
}

export async function loadConfig(): Promise<ServerConfig> {
    try {
        const configPath = join(process.cwd(), 'server-config.json');
        const configContent = await readFile(configPath, 'utf-8');
        const config = JSON.parse(configContent) as ServerConfig;

        // 基本的なバリデーション
        if (!config.server) {
            throw new Error('設定ファイルに"server"セクションがありません');
        }
        if (!config.server.command) {
            throw new Error('設定ファイルに"command"が指定されていません');
        }
        if (!Array.isArray(config.server.args) || config.server.args.length === 0) {
            throw new Error('設定ファイルに有効な"args"が指定されていません');
        }

        return config;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`設定ファイルの読み込みに失敗しました: ${error.message}`);
        }
        throw error;
    }
}