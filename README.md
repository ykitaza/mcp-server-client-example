# MCP Server Sample

Model Context Protocol (MCP) サーバーの実装サンプルです。2つの数値を比較するシンプルなツールを提供しています。

## 必要要件

- [Bun](https://bun.sh/) ランタイム
- MCPクライアント（例：Claude Desktop App など）

## セットアップ

1. 依存関係のインストール：
```bash
bun install
```

2. ビルド：
```bash
bun build
```

## MCPサーバーの設定

MCPサーバーを設定するには、MCPクライアントの設定ファイルを編集する必要があります。設定ファイルの場所は使用するMCPクライアントによって異なります。

MCPクライアントの設定ファイルは、通常以下のような場所に配置されています：

- Windows: `%APPDATA%` 以下の各クライアントの設定ディレクトリ
- Mac: `~/Library/Application Support` 以下の各クライアントの設定ディレクトリ
- Linux: `~/.config` 以下の各クライアントの設定ディレクトリ

具体的な設定ファイルの場所は、使用するMCPクライアントのドキュメントを参照してください。

### 設定ファイルの内容

どちらのクライアントを使用する場合も、以下のような形式で設定を記述します：

```json
{
  "mcpServers": {
    "number-comparison": {
      "command": "bun",
      "args": ["run", "path/to/mcp-server-sample/server/src/index.ts"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### 設定オプション

- `command`: サーバーを実行するコマンド
- `args`: コマンドに渡す引数の配列。サーバーのエントリーポイントへの正しいパスを指定する必要があります
- `disabled`: サーバーを無効化するかどうか（`true`/`false`）
- `autoApprove`: 自動承認するツール名の配列（セキュリティ上の理由から、通常は空配列を推奨）
- `env`: （オプション）サーバーに渡す環境変数のオブジェクト

### 注意事項

- パスは必ずフルパスで指定してください（相対パスは動作しない可能性があります）
- 新しいMCPサーバーを追加した場合は、MCPクライアントの再起動が必要です
- `autoApprove` は慎重に設定してください。セキュリティ上のリスクを理解した上で使用してください

## 使用例

このサンプルサーバーは `compare-numbers` という1つのツールを提供します。

```typescript
// ツールの使用例
<use_mcp_tool>
<server_name>number-comparison</server_name>
<tool_name>compare-numbers</tool_name>
<arguments>
{
  "number1": 10,
  "number2": 20
}
</arguments>
</use_mcp_tool>
```

実行結果：
```
The larger number is: 20
```

## MCPサーバーの実装

新しいツールを追加する場合は、以下の手順で実装します：

1. `server/src/tools/` ディレクトリに新しいツールの実装ファイルを作成

2. `server/src/index.ts` でツールを登録：

```typescript
server.tool(
    "tool-name",
    {
        // zodスキーマでツールの入力パラメータを定義
        param1: z.string(),
        param2: z.number(),
    },
    async (args) => {
        // ツールの実装
        return {
            content: [{
                type: 'text',
                text: 'Result'
            }]
        };
    }
);
```
