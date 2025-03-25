import { readFile } from 'fs/promises';
import { join } from 'path';

export interface ServerConfig {
    [key: string]: {
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
        const servers = Object.keys(config);
        if (servers.length === 0) {
            throw new Error('設定ファイルにサーバー設定が見つかりません');
        }

        for (const serverKey of servers) {
            if (!(serverKey in config)) {
                throw new Error(`設定ファイルに"${serverKey}"が見つかりません`);
            }
            const serverConfig = config[serverKey];
            if (typeof serverConfig !== 'object' || serverConfig === null) {
                throw new Error(`設定ファイルの"${serverKey}"が正しい形式ではありません`);
            }
            if (!('command' in serverConfig) || typeof serverConfig.command !== 'string') {
                throw new Error(`設定ファイルの"${serverKey}"に"command"が指定されていません`);
            }
            if (!('args' in serverConfig) || !Array.isArray(serverConfig.args) || serverConfig.args.length === 0) {
                throw new Error(`設定ファイルの"${serverKey}"に有効な"args"が指定されていません`);
            }
        }

        return config;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`設定ファイルの読み込みに失敗しました: ${error.message}`);
        }
        throw error;
    }
}