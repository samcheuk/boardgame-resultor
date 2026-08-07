# Boardgame Tracker

私人用嘅桌遊追蹤 Web App，部署目標係 GitHub Pages（`github.io`）。

用 Google 登入，再以 Firestore `whitelist` 限制只有允許嘅 email 可以入去。支援多款遊戲模組：

- **Result Record**（例如 Catan）：記錄對局結果
- **Status Saving**（例如 Gloomhaven）：儲存戰役／進度狀態

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Firebase Authentication（Google）
- Cloud Firestore

## Project Structure

```
src/
  components/       # 共用 UI（ProtectedRoute、generic forms）
  contexts/         # AuthContext
  firebase/         # Firebase 初始化
  games/            # 各遊戲模組（config、可選 views）
    catan/
    gloomhaven/
    index.ts
    loadGameView.ts
  pages/            # Login、Home、GameView
  types/            # GameConfig 等型別
```

遊戲專屬邏輯／UI／assets 應放喺 `src/games/[gameId]/`。

## Local Setup

### 1. Install

```bash
npm install
```

### 2. Environment variables

複製範本並填入 Firebase Web App config（**唔好 commit** `.env.local`）：

```bash
cp .env.example .env.local
```

`.env.local` 需要：

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 3. Run

```bash
npm run dev
```

因為設定咗 GitHub Pages 的 `base`，本地請開：

`http://localhost:5173/boardgame-tracker/`

（如果 5173 被佔用，Vite 會改用 5174 等，以 terminal 顯示嘅 URL 為準。）

### 其他指令

| Command | Description |
| --- | --- |
| `npm run dev` | 開發伺服器 |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | 預覽 build 結果 |
| `npm run lint` | Oxlint |

## Firebase Console Setup

### 1. Create project & Web app

1. 去 [Firebase Console](https://console.firebase.google.com/)
2. 建立（或選擇）project
3. **Project settings** → **Your apps** → 新增 **Web** app（`</>`）
4. 複製 `firebaseConfig`，填入本地 `.env.local`

### 2. Authentication（Google）

1. **Build** → **Authentication** → **Get started**
2. **Sign-in method** → 啟用 **Google**
3. 儲存（可設定 project support email）

### 3. Cloud Firestore + whitelist

1. **Build** → **Firestore Database** → 建立 database（建議先用 production mode，再自己設 rules）
2. 建立集合 **`whitelist`**
3. 新增文件：
   - **Document ID** = 允許登入嘅 email（例如 `you@gmail.com`）
   - 欄位可留空，或加任意備註欄位
4. 每個允許嘅用戶加一份文件（document ID = 該用戶 email）

### 4. Security Rules

喺 **Firestore** → **Rules** 建議用：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /whitelist/{email} {
      allow read: if request.auth != null
                  && request.auth.token.email == email;
      allow write: if false;
    }
  }
}
```

然後 **Publish**。

說明：

- 已登入用戶只可以讀**自己**嗰份 whitelist 文件
- 禁止前端寫入；whitelist 只喺 Console 管理
- 若見到 `Missing or insufficient permissions`，多數係 rules 未 publish 或 document ID 同 Google email 唔一致

### 5. Auth 流程（app 行為）

1. 用戶按 **Sign in with Google**
2. 登入成功後，app 讀 `whitelist/{email}`
3. 文件存在 → 進入 Home
4. 文件不存在 → 立即登出，顯示 `Not authorized`

## Deploy to GitHub Pages

推去 `main` 會自動跑 `.github/workflows/deploy.yml`。

1. Repo → **Settings** → **Pages** → Source 揀 **GitHub Actions**
2. Repo → **Settings** → **Secrets and variables** → **Actions**，新增：
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. Firebase Console → **Authentication** → **Settings** → **Authorized domains** 加 `samcheuk.github.io`
4. `git push origin main`，喺 **Actions** 睇 deploy 結果

網址：`https://samcheuk.github.io/boardgame-tracker/`

## Adding a Game

1. 新增 `src/games/<gameId>/config.ts`，匯出符合 `GameConfig` 的 config
2. 喺 `src/games/index.ts` 登記到 `games` 陣列
3. （可選）新增 `src/games/<gameId>/views/GameForm.tsx` 作為專屬表單；冇嘅話會用通用 Result / Status placeholder

## Notes

- Firebase Web config 會入 frontend bundle，唔算真正秘密；真正安全靠 Auth + Firestore Rules + whitelist
- 本地用 `.env.local`；上 GitHub Pages 可用 GitHub Actions Secrets 注入同一批 `VITE_*` 變數
