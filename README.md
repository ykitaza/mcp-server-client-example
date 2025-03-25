# MCP サーバー/クライアント サンプル

🔍 Model Context Protocol（MCP）の実装サンプルプロジェクト

## 💡 プロジェクトの背景
このプロジェクトは以下の目的で作成されました：

- **MCPの基礎学習**: Model Context Protocolの基本概念を理解するための最小限の実装例を提供
- **シンプルな実装**: 必要最小限の機能に絞ったMCPサーバーの実装により、プロトコルの本質的な部分に焦点を当てる
- **独立した実装**: Claude Desktop Appなどの特定のクライアントに依存せず、MCPサーバーを自前で実装する方法を示す
- **コスト効率**: Google Gemini APIを採用することで、Anthropic Claude APIと比較してより低コストで試験的な実装が可能

このサンプルプロジェクトを通じて、MCPの基本的な仕組みとツール連携の実装方法を学ぶことができます。

##  機能概要
- MCPサーバー：数値比較ツールを提供
- MCPクライアント：MCPサーバーとの通信を実装
- GeminiチャットCLI：Google Gemini APIを使用したチャットインターフェース（MCPツール連携機能付き）

## 🏗️ アーキテクチャ
```
src/
├── index.ts                 # チャットCLIのエントリーポイント
├── llm-clients/            # LLMクライアント実装
│   └── gemini.ts           # Google Gemini APIクライアント
├── mcp-client/            # MCPクライアントモジュール
│   ├── client.ts          # MCPツールクライアント実装
│   └── config.ts          # クライアント設定ローダー
└── mcp-server/           # MCPサーバーモジュール
    ├── index.ts          # サーバーのエントリーポイント
    └── tools/            # MCPツール実装
        └── compare-numbers.ts  # 数値比較ツール
```

### 主要コンポーネント

#### MCPサーバー
- `src/mcp-server/`: Model Context Protocol準拠のサーバー実装
- ツールの登録と実行を管理
- 数値比較などのツールを提供

#### MCPクライアント
- `src/mcp-client/`: MCPサーバーとの通信を行うクライアントライブラリ
- サーバー設定の読み込みと接続管理
- ツールの呼び出しとレスポンス処理

#### LLMクライアント
- `src/llm-clients/`: 言語モデルとの対話を管理
- Google Gemini APIを使用した自然言語処理
- MCPツールとの連携機能を実装

### データフロー
1. ユーザーがチャットCLIに入力
2. Geminiクライアントが入力を処理
3. 必要に応じてMCPツールを呼び出し
4. ツールの実行結果をGeminiに渡して自然言語の応答を生成
5. 結果をユーザーに表示

## 📋 必要要件
- [Bun](https://bun.sh/) ランタイム（v1.0.0以上）
- MCP対応クライアント（例：Claude Desktop App、Cline、Cursor）
- [Google Cloud プロジェクト](https://console.cloud.google.com/)のGemini API キー（チャットCLI利用時）

## 🚀 セットアップと実行
1. 依存関係のインストール
   ```bash
   bun install
   ```

2. 環境変数の設定
   ```bash
   # .envファイルをコピーして編集
   cp .env.example .env
   
   # .envファイルにGemini APIキーを設定
   # Google Cloud ConsoleからAPIキーを取得して設定
   ```
   ```env
   GEMINI_API_KEY="your-api-key-here"
   ```

3. サーバー設定ファイルの作成
   ```bash
   # プロジェクトルートにserver-config.jsonを作成
   touch server-config.json
   ```
   
   ```json
   {
       "server": {
           "command": "bun",
           "args": [
               "run",
               "/absolute/path/to/mcp-server/index.ts"
           ]
       }
   }
   ```
   ※ パスは環境に合わせて適切な絶対パスに変更してください。

4. 実行方法
   ```bash
   チャットCLIの起動
   bun run chat
   ```

## 💬 使用例
   ```sh
   Starting MCP server...
   Server connected and ready to handle requests.
   対話型チャットを開始します。終了するには「exit」「quit」「終了」と入力してください。

   質問を入力してください（終了するには「exit」と入力）: 9.11と9.9はどちらが大きい？
   送信メッセージ: "9.11と9.9はどちらが大きい？"
   関数呼び出し: {
     name: "compare-numbers",
     args: {
       number2: 9.9,
       number1: 9.11,
     }
   }
   ツール結果: {
     content: [
       {
         type: "text",
         text: "The larger number is: 9.9",
       }
     ]
   }

   応答：
   9.9の方が9.11より大きいです。
   ```

3. チャットの終了
   以下のいずれかのコマンドでチャットを終了できます：
   - `exit`
   - `quit`
   - `終了`

### 📝 チャットCLIの特徴
- Google Gemini APIを使用した自然言語対話
- MCPツールとの連携（数値比較などのツールを自然な対話の中で利用可能）
- 日本語での対話に最適化
- ツールの実行結果を自然な日本語で説明

##  クライアント設定
### ファイル構成
プロジェクトルートの`server-config.json`でクライアントのサーバー接続設定を管理します。このファイルはサーバーとの通信に必要な基本設定を含みます。

### 設定項目
| 設定項目   | 必須 | 説明                                |
|------------|------|-------------------------------------|
| `command`  | ✓    | サーバーの実行コマンド（例：bun）   |
| `args`     | ✓    | コマンド引数（サーバーファイルパス等）|

### ⚠️ 注意点
- サーバーファイルのパスは必ず**絶対パス**を使用してください
- 設定ファイルの変更後はクライアントの再起動が必要です
- JSONの構文に従って正しく記述してください

## ⚙️ サーバー設定
### 設定ファイルの編集
```json
{
  "mcpServers": {
    "number-comparison": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/server/src/index.ts"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### 📌 重要設定項目
| 設定項目     | 必須 | デフォルト値 | 説明                          |
|--------------|------|--------------|-------------------------------|
| `command`    | ✓    | -            | サーバー実行コマンド          |
| `args`       | ✓    | -            | コマンド引数（絶対パス必須）  |
| `disabled`   | -    | false        | サーバーの無効化              |
| `autoApprove`| -    | []           | 自動承認ツールリスト          |

### ⚠️ 注意事項
- パス指定は必ず**絶対パス**を使用
- 設定変更後はクライアントの再起動が必要
- `autoApprove` の使用は最小限に

## 📸 使用イメージ

よくあるAIが間違えてしまう計算問題を例に、ツールの使用前後の比較を示します。

### ツール使用前
![通常のチャット画面](images/before.png)

### ツール使用後
![数値比較ツールの実行結果](images/after.png)


## 🛠️ ツール使用例
```xml
<use_mcp_tool>
  <server_name>number-comparison</server_name>
  <tool_name>compare-numbers</tool_name>
  <arguments>
    { "number1": 42, "number2": 24 }
  </arguments>
</use_mcp_tool>
```

✅ 実行結果：
```plaintext
The larger number is: 42
```

## 🧩 カスタムツール追加
1. ツール実装ファイル作成
   ```bash
   touch server/src/tools/new-tool.ts
   ```

2. ツール登録（server/src/index.ts）
   ```typescript
   // ... 既存コード ...
   server.tool(
     "new-tool",
     {
       param1: z.string().describe("パラメータ説明"),
       param2: z.number().min(0)
     },
     async ({ param1, param2 }) => {
       // 処理実装
       return {
         content: [{ type: 'text', text: '結果' }]
       };
     }
   );
   // ... 既存コード ...
   ```

