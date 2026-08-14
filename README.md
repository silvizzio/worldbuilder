这是一个用于构建「3D 数字孪生编辑平台」操作文档与说明系统的站点。

技术栈：

- Next.js（App Router）
- Fumadocs + MDX（文档内容与导航）
- TailwindCSS（样式）
- 静态导出（`output: export`），可用于静态部署

## 快速开始

进入项目目录并启动开发服务器：

```bash
cd D:\AILAB\SpaceGS\TwinScapeHub\twinscapehub-docs
npm run dev
```

浏览器访问：

- 中文：`http://localhost:3000/zh/`
- English：`http://localhost:3000/en/`

如果提示端口被占用，可指定端口：

```bash
npm run dev -- --port 3006
```

## 如何编辑文档内容（最常用）

### 1）内容目录

所有文档内容都在 `content/docs` 下，并按中英文分目录：

- 中文：`content/docs/zh/...`
- English：`content/docs/en/...`

例如：

- 项目管理：`content/docs/zh/project-center/*` 与 `content/docs/en/project-center/*`
- 编辑器页面：`content/docs/zh/editor/*` 与 `content/docs/en/editor/*`

### 2）编辑现有功能页

直接修改对应的 `.mdx` 文件即可，保存后页面会自动热更新。

示例（创建新项目）：

- 中文：`content/docs/zh/project-center/create-project.mdx`
- English：`content/docs/en/project-center/create-project.mdx`

### 3）新增一个功能页

项目管理： `foo.mdx` 为例（建议中英各一份）：

1. 新建中文：`content/docs/zh/project-center/foo.mdx`
2. 新建英文：`content/docs/en/project-center/foo.mdx`
3. 把页面加入导航（否则侧边栏不会显示）：
   - 中文导航：`content/docs/zh/project-center/meta.json`
   - 英文导航：`content/docs/en/project-center/meta.json`

在对应 `meta.json` 的 `pages` 数组里加入 `"foo"`（不带 `.mdx`）。

### 4）放入视频/封面素材

MDX 里继续写站点根路径即可（`VideoDemo` / `ShotGrid` 会自动拼接 CDN 基址）：

```yaml
media:
  type: video
  src: /demos/project-center/create-project.mp4
  poster: /demos/project-center/create-project.poster.jpg
```

```mdx
<VideoDemo src="/demos/project-center/1.1创建新项目.mp4" poster="/demos/project-center/1.1创建新项目.poster.jpg" />
```

**本地开发（默认）**：不配置环境变量，从 `public/demos/...` 加载。

**生产 / AWS S3**：复制 `.env.example` 为 `.env.local`，设置：

```bash
NEXT_PUBLIC_ASSETS_URL=https://YOUR_BUCKET.s3.REGION.amazonaws.com
```

S3 上的对象路径需与 `public` 下一致，例如桶内 `demos/project-center/1.1创建新项目.mp4` 对应 MDX 路径 `/demos/project-center/1.1创建新项目.mp4`。

部署到 Vercel 时，在 Project → Settings → Environment Variables 添加同名变量 `NEXT_PUBLIC_ASSETS_URL`，然后重新部署。

## 构建静态站点

```bash
npm run build
```

构建后可用于静态部署。

## 参考

- Next.js：<https://nextjs.org/docs>
- Fumadocs：<https://www.fumadocs.dev/docs>
