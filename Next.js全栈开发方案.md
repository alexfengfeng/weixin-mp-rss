# Next.js 全栈开发方案

本项目已改造为“多订阅号草稿箱发布台”：管理多个微信公众号订阅号，撰写 Markdown 文章，并通过微信公众号官方 API 推送到目标订阅号草稿箱。

## 技术栈

- Next.js App Router + TypeScript
- SQLite + Prisma
- 微信公众号官方 API：`access_token`、素材上传、草稿箱新增
- PM2 管理 `web` 和 `worker`
- 宝塔 Nginx 反向代理

## V1 范围

- 后台登录、退出、会话校验
- 多订阅号管理：名称、AppID、加密 AppSecret、头像、简介、状态、凭证测试
- 本地文章库：Markdown 正文、HTML 预览、封面图、本地图片上传、摘要、作者、原文链接
- 草稿批次：支持单图文和多图文，最多 8 篇文章
- worker 推送任务：上传封面素材、上传正文图片、替换图片 URL、调用微信草稿箱新增接口
- 任务列表和任务详情：查看推送状态、进度、日志、错误并支持失败重试
- SQLite jobs 轻量任务队列

## 已移除能力

- 微信网页扫码授权
- Playwright 浏览器采集
- 公众号文章抓取
- RSS/Atom Feed 输出
- 公开文章页 `/articles/:id`
- 旧 SQLite 抓取文章迁移

## 进程

- `web`：`npm run start`
- `worker`：`npm run worker`

## 初始化

```bash
cp .env.example .env.production
mkdir -p data data/uploads
touch data/app.db
npm install
npx prisma generate
npx prisma db push
npm run init:admin
npm run build
pm2 start ecosystem.config.cjs
```

`.env.production` 中 `DATABASE_URL=file:../data/app.db`，对应项目根目录 `data/app.db`。

## 使用流程

1. 登录后台。
2. 在“订阅号”中新增账号，填写 AppID/AppSecret。
3. 点击“测试凭证”，确认能获取 `access_token`。
4. 在“文章”中新建 Markdown 文章，上传封面图和正文图片。
5. 在“草稿”中创建单图文或多图文批次。
6. 点击“推送草稿箱”，worker 会创建 `push_wechat_draft` 任务。
7. 到微信公众号后台草稿箱查看生成的草稿。

## 后续升级

- 更完整的富文本编辑器
- 微信素材复用和素材库管理
- 草稿预览图和移动端预览
- 原创声明、留言设置、作者库等高级图文参数
- 定时推送草稿箱或定时群发
- SQLite 迁移 MySQL，SQLite jobs 升级 Redis/BullMQ
