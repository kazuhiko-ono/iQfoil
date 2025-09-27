# 須長由季選手アピールサイト - デプロイメント手順

## 概要
このドキュメントは、須長由季選手のプロフェッショナルアピールサイトをNetlifyにデプロイする手順を説明します。

## プロジェクト構成

```
public/
├── index.html              # メインHTMLファイル
├── css/
│   ├── styles.css         # メインCSSスタイル
│   └── responsive.css     # レスポンシブ対応CSS
├── js/
│   ├── main.js           # メイン機能JavaScript
│   └── animations.js     # アニメーション機能
├── images/
│   ├── IMG_*.jpeg        # 須長選手の写真（32枚）
│   ├── og-image.jpg      # OGP用画像
│   ├── favicon.ico       # ファビコン
│   ├── favicon.svg       # SVGファビコン
│   └── apple-touch-icon.png # Appleタッチアイコン
├── netlify.toml          # Netlify設定ファイル
├── _redirects           # リダイレクト設定
├── sitemap.xml          # サイトマップ
└── robots.txt           # 検索エンジン向け設定
```

## Netlifyデプロイ手順

### 方法1: Git連携デプロイ（推奨）

1. **GitHubリポジトリの作成**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 須長由季選手アピールサイト"
   git branch -M main
   git remote add origin [YOUR_GITHUB_REPO_URL]
   git push -u origin main
   ```

2. **Netlifyアカウントでの設定**
   - [Netlify](https://netlify.com)にログイン
   - "New site from Git"をクリック
   - GitHubを選択し、リポジトリを接続
   - Build settings:
     - Build command: `echo "No build needed"`
     - Publish directory: `public`
   - "Deploy site"をクリック

### 方法2: ドラッグ&ドロップデプロイ

1. **Netlifyダッシュボード**
   - [Netlify](https://netlify.com)にログイン
   - "Sites"ページで"Deploy manually"エリアを確認

2. **フォルダをドラッグ&ドロップ**
   - `public`フォルダをNetlifyのデプロイエリアにドラッグ
   - 自動的にデプロイが開始される

### 方法3: Netlify CLI使用

1. **CLI インストール**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **デプロイ実行**
   ```bash
   cd public
   netlify deploy --prod --dir .
   ```

## カスタムドメイン設定

1. **Netlifyダッシュボード**
   - Site settings > Domain management
   - "Add custom domain"をクリック

2. **推奨ドメイン名**
   - `sunaga-yuki.com`
   - `yuki-sunaga.jp`
   - `sunaga-windsurfing.com`

3. **DNS設定**
   - ドメインプロバイダーでDNS設定を変更
   - Netlifyの指示に従ってCNAMEレコードを設定

## SSL証明書

Netlifyは自動的にLet's Encrypt SSL証明書を発行します。
- 設定: Site settings > Domain management > HTTPS
- "Force HTTPS"を有効化

## 環境変数（将来の拡張用）

以下の環境変数を設定可能：
```
CONTACT_EMAIL=partnership@sunaga-yuki.com
ANALYTICS_ID=GA_TRACKING_ID
FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

## パフォーマンス最適化

### 設定済み項目
- ✅ 画像最適化
- ✅ CSS/JS minification（本番デプロイ時）
- ✅ Gzip圧縮
- ✅ ブラウザキャッシュ設定
- ✅ CDN配信

### 追加推奨設定
1. **Netlifyプラグイン追加**
   ```toml
   [[plugins]]
     package = "netlify-plugin-minify-html"

   [[plugins]]
     package = "netlify-plugin-sitemap"
   ```

2. **画像最適化プラグイン**
   ```toml
   [[plugins]]
     package = "netlify-plugin-image-optim"
   ```

## SEO設定

### 既に設定済み
- ✅ メタタグ（OGP、Twitter Card）
- ✅ 構造化データ（JSON-LD）
- ✅ サイトマップ（sitemap.xml）
- ✅ robots.txt
- ✅ レスポンシブデザイン

### Google Search Console設定
1. [Google Search Console](https://search.google.com/search-console/)でサイトを追加
2. `sitemap.xml`を送信: `https://yourdomain.com/sitemap.xml`

### Google Analytics設定（オプション）
HTMLの`<head>`内に追加：
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## フォーム機能設定（Netlify Forms）

現在のお問い合わせフォームをNetlify Formsに接続：

1. **HTMLフォーム更新**
   ```html
   <form name="contact" method="POST" data-netlify="true" class="contact-form">
     <input type="hidden" name="form-name" value="contact" />
     <!-- 既存のフォームフィールド -->
   </form>
   ```

2. **スパム対策**
   ```html
   <div data-netlify-recaptcha="true"></div>
   ```

## 監視とメンテナンス

### アクセス解析
- Netlify Analytics（有料）
- Google Analytics（無料）
- Google Search Console（無料）

### 定期更新項目
- 競技実績の更新
- 写真ギャラリーの追加
- パートナーシップ情報の更新

## トラブルシューティング

### よくある問題と解決法

1. **画像が表示されない**
   - パスの確認：`./images/filename.jpg`
   - ファイル名の大文字小文字確認

2. **CSSが適用されない**
   - キャッシュクリア
   - `netlify.toml`のキャッシュ設定確認

3. **モバイルでの表示崩れ**
   - `responsive.css`の読み込み確認
   - viewport metaタグの確認

4. **フォーム送信エラー**
   - Netlify Formsの設定確認
   - `data-netlify="true"`属性の確認

## サポート連絡先

技術的な問題や更新については：
- 開発者: Claude Code Assistant
- Netlifyサポート: https://www.netlify.com/support/
- 緊急時: partnership@sunaga-yuki.com

## バックアップ

- GitHubリポジトリが自動バックアップとして機能
- 定期的な手動バックアップも推奨
- 画像ファイルの元データ保管

---

このサイトは須長由季選手のプロフェッショナルなブランディングと、イエリスタホールディングス様向けのスポンサーシップ訴求を目的として作成されました。