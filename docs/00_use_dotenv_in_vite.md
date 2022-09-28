# vite で.env による環境変数の読み込みを行う

- vite は、デフォルトで`vite.config.ts` と同じ階層にある`.env` ファイルのうち、`VITE_` から始まる環境変数を読み込みする
- 読み込みするファイルのディレクトリは、`vite.config.ts` の`envDir` プロパティで設定できる
- アプリケーション内からこの環境変数を利用する場合は、`import.meta.env.<env_name>` と記述する
- `process.env` は利用できないので注意！

## 参考

- 環境変数とモード | Vite ドキュメント:  
  https://ja.vitejs.dev/guide/env-and-mode.html#env-files

- Vite を使ってアプリケーションに環境変数を参照させる方法を考える:  
  https://blog.recruit.co.jp/rmp/front-end/post-21271/
