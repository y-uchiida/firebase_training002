# Vite で作成した React-TypeScript プロジェクトで MUI を使う

1. npm install  
   `material-ui` から リポジトリ名が変わっているので、インストール時に注意

```
npm install @mui/material
npm install @emotion/react
npm install @emotion/styled
npm install @mui/icons-material
```

2. tsconfig の設定  
   emotion を使うので、Pragma の設定が必要  
   `tsconfig.json` に以下を追加する

```json
"compilerOptions": {
    "jsxImportSource": "@emotion/react",
}
```

vite はそのままだと`jsxImportSource` の設定を反映してくれないので、  
`vite.config.ts` に以下を追加する

```ts
plugins: [
  react({
    jsxImportSource: "@emotion/react",
  }),
];
```

3. font と icon の読み込み
   `index.html` に、以下のタグを追加する

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
```

4. リセット CSS
   mui が用意しているものがあるので、それを`App.tsx` など、ルートになっているコンポーネントで読み込む

```tsx
import CssBaseline from "@mui/material/CssBaseline";

export function App() {
  return <CssBaseline />;
}
```

ここまで、ほぼ参考ページの内容をそのまま実行しただけ。

## 参考

- mui/material-ui | GitHub:  
  https://github.com/mui/material-ui
- Vite+React+TypeScript で、UI フレームワークに MUI(v5)を導入する。:  
  https://zenn.dev/longbridge/articles/bba17785710c1a
- Install & Setup Vite + React + Typescript + MUI 5:  
  https://frontendshape.com/post/install-setup-vite-react-typescript-mui-5
