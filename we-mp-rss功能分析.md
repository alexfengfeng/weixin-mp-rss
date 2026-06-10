# we-mp-rss 功能分析

分析日期：2026-06-07  
源码目录：`/Users/alex/code/we-mp-rss`  
输出目录：`/Users/alex/code/weixin-mp-rss`

## 1. 项目概览

`we-mp-rss` 是一个微信公众号订阅与 RSS 生成系统。它通过微信公众号平台授权后的 token、cookie 或浏览器会话，搜索公众号、采集公众号文章列表与正文，将数据落库后提供管理界面、RSS/Atom/JSON Feed 输出、文章阅读视图、消息 WebHook 推送、导入导出、标签聚合、级联采集等功能。

项目采用前后端分离加部分服务端预览页的混合架构：

- 后端：Python + FastAPI + SQLAlchemy。
- 前端：Vue 3 + Vite，构建产物由 FastAPI 静态服务托管。
- 数据库：默认 SQLite，也支持 MySQL/PostgreSQL 风格的 SQLAlchemy 连接串。
- 缓存：文件缓存为主，可接入 Redis；Redis 也用于 token、登录状态、环境异常统计等。
- 定时任务：基于 `APScheduler`/自定义调度器执行公众号采集、正文补抓、级联任务分发、文章统计刷新等。
- 采集能力：支持 web、api、app 多种微信公众号采集模式，并包含 Playwright 浏览器登录、反爬配置、代理配置、文章正文修复与 HTML 清洗。

核心入口：

- `main.py`：启动初始化、授权服务、级联服务、定时任务和 Uvicorn。
- `web.py`：创建 FastAPI 应用，挂载 API、RSS、静态资源、Vue SPA 和旧版预览页。
- `web_ui/src`：Vue 管理后台源码。

## 2. 启动流程

`main.py` 是运行入口。典型启动命令为：

```bash
python main.py -job True -init True
```

启动过程如下：

1. 读取 `config.yaml`，支持 `${ENV:-default}` 形式的环境变量替换。
2. 如果 `redis.server.enabled=True`，启动内置 Redis 服务。
3. 如果 `-init True`，执行 `init_sys.init()`：
   - 创建/同步数据库表。
   - 初始化管理员用户，默认 `USERNAME=admin`、`PASSWORD=admin@123`。
4. 启动微信授权服务 `driver.auth.start_auth_service()`。
5. 根据 `cascade.enabled` 和 `cascade.node_type` 判断是否启动级联子节点同步、任务拉取，或父节点调度服务。
6. 如果 `-job True` 且 `server.enable_job=True`，启动定时采集任务。
7. 如果 `gather.content_auto_check=True`，启动未采集正文自动补抓任务。
8. 可选启动文章统计刷新任务。
9. 通过 Uvicorn 启动 `web:app`，默认端口 `8001`。

## 3. 后端 Web 与 API 架构

`web.py` 创建 FastAPI 应用，API 文档地址为：

- `/api/docs`
- `/api/redoc`
- `/api/openapi.json`

统一 API 前缀定义在 `core/base.py`：

```text
/api/v1/wx
```

主要路由挂载：

- `/api/v1/wx/auth`：登录、JWT、扫码授权、Access Key、密码重置。
- `/api/v1/wx/user`：用户管理、头像上传、密码修改。
- `/api/v1/wx/mps`：公众号搜索、添加、列表、更新、删除、精选文章。
- `/api/v1/wx/articles`：文章列表、详情、刷新、删除、清理、已读、收藏。
- `/api/v1/wx/rss`：RSS 源列表和单源 RSS 获取。
- `/feed/...`：对外订阅 Feed 输出。
- `/api/v1/wx/tags`：标签管理。
- `/api/v1/wx/message_tasks`：消息任务和 WebHook 推送任务。
- `/api/v1/wx/export`：公众号、标签导入导出，OPML 导出。
- `/api/v1/wx/tools`：文章导出、图片裁剪、远程图片代理。
- `/api/v1/wx/configs`：运行配置管理。
- `/api/v1/wx/filter-rules`：正文 HTML 过滤规则管理。
- `/api/v1/wx/cascade`：级联节点、任务分配、同步、回传。
- `/api/v1/wx/env-exception`：采集环境异常统计。
- `/api/v1/wx/task-queue`：任务队列状态、历史、WebSocket 推送。
- `/api/v1/wx/proxy`：代理转发。
- `/views/...`：旧版服务端文章/标签/公众号预览页。

`web.py` 还挂载：

- `/assets`：前端构建资源。
- `/static`：静态资源和反向代理资源。
- `/files`：上传文件或头像资源。
- `/{path:path}`：兜底返回 `static/index.html`，支持 Vue SPA 路由。

## 4. 核心数据模型

项目主要模型位于 `core/models`。

### 4.1 用户与认证

`User`：

- 用户名、密码哈希、角色、权限、头像、邮箱等。
- 初始化时默认创建管理员用户。

`AccessKey`：

- 用于程序化 API 调用。
- 包含 AK、SK 哈希、权限、状态、过期时间和最后使用时间。

### 4.2 公众号与文章

`Feed`：

- 公众号订阅源。
- 字段包括公众号 ID、名称、封面、简介、状态、同步时间、更新时间、`faker_id`。

`Article`：

- 公众号文章。
- 字段包括文章 ID、公众号 ID、标题、封面、链接、摘要、正文、HTML 正文、发布时间、状态、阅读/收藏状态、是否已有正文、导出状态等。
- 文章 ID 会按 `mp_id-article_id` 方式组合，降低不同公众号文章 ID 冲突风险。

### 4.3 标签与过滤

`Tags`：

- 标签名称、封面、简介、状态、关联公众号列表。
- 支持通过标签生成聚合 Feed。

`FilterRule`：

- 支持按公众号或全局配置 HTML 清理规则。
- 可移除指定 id、class、CSS selector、属性、正则匹配内容和常见 HTML 元素。
- 支持优先级和启停状态。

### 4.4 消息任务

`MessageTask`：

- 定义 WebHook 推送任务。
- 包含任务名称、消息类型、模板、WebHook URL、Headers、Cookies、关联公众号列表、cron 表达式、状态。

`MessageTaskLog`：

- 记录消息任务执行情况、更新数量、日志和状态。

### 4.5 级联系统

`CascadeNode`：

- 记录父/子节点信息、API 地址、回调地址、AK/SK、状态、同步配置、心跳时间。

`CascadeSyncLog`：

- 记录级联同步方向、操作类型、数据量、状态和错误。

`CascadeTaskAllocation`：

- 记录父节点下发给子节点的任务分配。
- 包含任务 ID、节点 ID、公众号列表、状态、调度批次、文章统计、开始/完成时间等。

## 5. 认证与权限

项目支持两类认证：

1. JWT 登录认证：
   - 登录接口：`POST /api/v1/wx/auth/login`
   - token 接口：`POST /api/v1/wx/auth/token`
   - token 默认有效期由 `token_expire_minutes` 配置。
   - 密码使用 bcrypt 哈希。
   - `SECRET_KEY` 优先来自环境变量，其次配置文件，再次读取 `data/.secret_key`，不存在时自动生成。

2. Access Key 认证：
   - 请求头格式：`Authorization: AK-SK {access_key}:{secret_key}`
   - `web.py` 中间件会识别 AK/SK 认证头并写入 `request.state.ak_auth`。
   - `core.auth.get_current_user_or_ak` 用于支持 JWT 或 AK 二选一访问。

安全相关能力：

- 登录失败次数限制。
- 密码重置验证码。
- 用户缓存和登录失败记录缓存。
- 配置隐藏字段：`safe.hide_config` 默认隐藏数据库、密钥、token 和通知 WebHook。

## 6. 微信授权与采集

微信侧能力主要分布在 `driver` 和 `core/wx`。

### 6.1 授权登录

`driver/wx.py` 提供基于 Playwright 的微信公众平台登录能力：

- 访问 `https://mp.weixin.qq.com/`。
- 获取并保存登录二维码 `static/wx_qrcode.png`。
- 监听登录成功后的跳转。
- 提取 token 和 cookies。
- 计算 cookie 过期时间。
- 保存 token/cookie 到 `data/wx.lic`，可选写入 Redis。
- 账号过期时可发送授权二维码通知。

前端和 API 可调用：

- `/auth/qr/code` 获取二维码。
- `/auth/qr/image` 判断二维码是否存在。
- `/auth/qr/status` 获取扫码状态。
- `/auth/qr/over` 关闭扫码流程。

### 6.2 采集方式

项目支持多采集模式，配置项为 `gather.model`：

- `web`：通过 Web 方式采集，可拿到较完整的发布链接。
- `api`：通过接口方式采集，可能拿到临时链接。
- `app`：偏向最新消息采集。

`core/wx/base.py` 中的 `WxGather.Model()` 会根据 `gather.model` 选择对应采集实现。

采集流程通常为：

1. 读取当前 token/cookie。
2. 搜索或获取公众号 `faker_id`。
3. 拉取公众号文章列表。
4. 标准化文章字段。
5. 写入 `articles` 表。
6. 更新公众号同步状态。
7. 清理对应 RSS 和页面缓存。

### 6.3 正文获取与修复

`core/article_content.py` 支持正文补抓：

- `build_article_url()` 生成文章 URL。
- `fetch_article_content()` 根据 `gather.content_mode` 使用 web 或 api 获取正文。
- `sync_article_content()` 更新文章正文、HTML 正文、摘要、状态和 `has_content`。

`driver/wxarticle.py`、`tools/fix.py`、`tools/htmltools.py` 等负责文章正文抓取、HTML 修复、摘要提取、内容清洗。

### 6.4 反爬与代理

`driver/playwright_driver.py` 封装浏览器控制：

- 支持 Firefox、Edge/WebKit 等浏览器类型配置。
- 设置 UA、viewport、反自动化脚本、行为脚本。
- 支持截图、PDF 导出、cookie 注入。

`driver/anti_crawler_config.py` 提供反爬配置：

- 生成更真实的 User-Agent。
- 注入隐藏 Playwright/Selenium 痕迹的脚本。
- 模拟浏览器环境和权限状态。

`proxy` 配置支持：

- Deno Deploy 代理。
- HTTP/SOCKS 代理。

## 7. 公众号管理功能

公众号接口在 `apis/mps.py`。

主要能力：

- 搜索公众号：`GET /mps/search/{kw}`。
- 获取公众号列表：`GET /mps`，支持分页、关键词、状态筛选。
- 获取公众号详情：`GET /mps/{mp_id}`。
- 通过文章链接识别公众号：`POST /mps/by_article`。
- 添加公众号订阅：`POST /mps`。
- 删除公众号：`DELETE /mps/{mp_id}`。
- 更新公众号状态：`PUT /mps/{mp_id}`。
- 手动更新公众号文章：`GET /mps/update/{mp_id}`。
- 添加精选文章：`POST /mps/featured/article`。

特色点：

- 内置“精选文章”系统公众号，用于把任意微信文章链接加入本地阅读与 Feed。
- 添加精选文章以后台线程执行，并提供任务状态查询。
- 更新公众号会触发文章抓取和缓存清理。

## 8. 文章管理功能

文章接口在 `apis/article.py`。

主要能力：

- 获取文章列表：`GET/POST /articles`。
- 获取文章详情：`GET /articles/{article_id}`。
- 删除文章：`DELETE /articles/{article_id}`。
- 清理孤儿文章：`DELETE /articles/clean`。
- 清理旧文章：`DELETE /articles/clean-old`，支持 dry run。
- 清理重复文章：`DELETE /articles/clean_duplicate_articles`。
- 标记已读/未读：`PUT /articles/{article_id}/read`。
- 标记收藏/取消收藏：`PUT /articles/{article_id}/favorite`。
- 刷新单篇文章正文：`POST /articles/{article_id}/refresh`。
- 查询刷新任务状态：`GET /articles/refresh/tasks/{task_id}`。
- 获取上一篇/下一篇：`GET /articles/{article_id}/prev|next`。

文章列表支持按公众号、关键词、状态、已读、收藏等维度过滤。正文刷新使用后台线程和异步抓取器，刷新成功后清理文章列表、详情页、首页、标签页缓存。

## 9. RSS / Feed 输出

RSS 能力由 `apis/rss.py` 和 `core/rss.py` 实现。

输出入口：

- `/api/v1/wx/rss`：获取全部订阅源列表 RSS。
- `/api/v1/wx/rss/fresh`：刷新并获取订阅源列表 RSS。
- `/api/v1/wx/rss/{feed_id}`：获取指定公众号文章 RSS。
- `/feed/{feed_id}.{ext}`：对外 Feed 输出。
- `/feed/search/{kw}/{feed_id}.{ext}`：关键词搜索 Feed。
- `/feed/tag/{tag_id}.{ext}`：标签聚合 Feed。

支持格式：

- RSS XML。
- Atom。
- JSON Feed。
- 自定义模板输出，依赖 `core/lax/TemplateParser`。

重要配置：

- `rss.base_url`：Feed 链接域名。
- `rss.local`：是否使用本地文章详情页链接。
- `rss.title`、`rss.description`、`rss.cover`：全局 Feed 元信息。
- `rss.full_context`：是否输出全文。
- `rss.add_cover`：是否添加封面。
- `rss.cdata`：是否使用 CDATA。
- `rss.page_size`、`rss.max_items`：分页和最大输出数量。

缓存：

- RSS 文件缓存目录：`data/cache/rss`。
- 文章内容缓存目录：`data/cache/content`。
- 更新文章或公众号后会按公众号清理相关缓存。

## 10. 消息任务与通知

消息任务接口在 `apis/message_task.py`，执行逻辑在 `jobs/mps.py`、`jobs/webhook.py`。

主要能力：

- 创建、更新、删除消息任务。
- 查询消息任务列表和详情。
- 手动执行单个任务。
- 测试消息发送。
- 重载定时任务。
- 支持自定义 Headers 和 Cookies，适合需要认证的 WebHook。

任务字段：

- `message_type`：消息类型。
- `message_template`：消息模板，支持模板语法。
- `web_hook_url`：推送地址。
- `headers`、`cookies`：可选认证参数。
- `mps_id`：关联公众号列表。
- `cron_exp`：cron 表达式。

通知渠道：

- 企业微信机器人。
- 钉钉机器人。
- 飞书机器人。
- Bark。
- 自定义 WebHook。

模板解析：

- `core/webhook/parse.py` 使用 `TemplateParser` 渲染 feed 和 articles 数据。
- 默认模板会列出订阅源、描述和最新文章。

## 11. 标签、导入导出与文章导出

### 11.1 标签管理

标签接口在 `apis/tags.py`：

- 标签列表、创建、详情、更新、删除。
- 标签可绑定多个公众号。
- 标签 Feed 可通过 `/feed/tag/{tag_id}.{ext}` 输出。

### 11.2 公众号和标签导入导出

导入导出接口在 `apis/export.py`：

- 导出公众号 CSV：`GET /export/mps/export`。
- 导入公众号 CSV：`POST /export/mps/import`。
- 导出公众号 OPML：`GET /export/mps/opml`。
- 导出标签 CSV：`GET /export/tags`。
- 导入标签 CSV：`POST /export/tags/import`。

OPML 导出会生成每个公众号对应的 `feed/{mp.id}.atom` 地址，便于一次性导入 RSS 阅读器。

### 11.3 文章导出

工具接口在 `apis/tools.py`：

- `POST /tools/export/articles`：导出文章。
- `GET /tools/export/download`：下载导出文件。
- `GET /tools/export/list`：查看导出记录。
- `DELETE /tools/export/delete`：删除导出文件。

支持格式来自前端和工具链：

- Markdown。
- DOCX。
- PDF。
- JSON。
- CSV。
- ZIP 打包。

相关工具位于 `tools/mdtools`、`doc2pdf` 和 `tools/pdf_compressor.py`。

## 12. 过滤规则与内容清洗

过滤规则面向公众号文章正文 HTML。

功能包括：

- 全局规则：`mp_id` 为空数组时对所有公众号生效。
- 指定公众号规则：`mp_id` 存储公众号 ID 或 ID 数组。
- 多种删除条件：
  - HTML id。
  - class。
  - CSS selector。
  - 属性名/属性值。
  - 正则表达式。
  - 常见 HTML 元素。
- 按优先级倒序执行。

适用场景：

- 删除公众号底部广告。
- 删除二维码、推荐阅读、版权块。
- 清理干扰 RSS 阅读体验的 HTML 元素。

## 13. 级联系统

级联系统是该项目较重的扩展能力，主要用于扩大采集能力或分布式部署。

相关文件：

- `apis/cascade.py`
- `jobs/cascade_sync.py`
- `jobs/cascade_task_dispatcher.py`
- `core/models/cascade_node.py`
- `core/models/cascade_task_allocation.py`

### 13.1 节点角色

- 父节点/网关：维护公众号、消息任务、节点列表，按 cron 分发任务。
- 子节点：从父节点同步公众号和任务，认领待处理任务，执行采集后上传文章和完成状态。

配置项：

```yaml
cascade:
  enabled: false
  node_type: child
  parent_api_url: http://localhost:8001
  api_key: ""
  api_secret: ""
  sync_interval: 300
  heartbeat_interval: 60
  task_poll_interval: 30
```

### 13.2 父节点能力

父节点提供：

- 节点创建、更新、删除、列表、详情。
- 节点凭证生成。
- 连接测试。
- 子节点心跳接收。
- 任务分发。
- 任务分配状态查看。
- 公众号更新状态查看。
- 待认领任务统计。
- 定时调度服务启动、停止、重载。

任务分发逻辑：

1. 读取启用的 `MessageTask`。
2. 根据 cron 表达式触发。
3. 将任务中的公众号拆分给可用子节点，或生成待认领分配。
4. 通知子节点有新任务。
5. 接收子节点文章上传和完成报告。

### 13.3 子节点能力

子节点启动后会：

1. 周期性向父节点同步公众号和消息任务。
2. 定期发送心跳。
3. 按 `task_poll_interval` 拉取或认领任务。
4. 本地执行采集。
5. 上传文章到父节点。
6. 回传任务完成状态、文章数、新文章数和错误信息。

## 14. 缓存与 Redis

项目有两类缓存：

### 14.1 文件缓存

`core/cache.py`：

- `ViewCache` 用于旧版视图或数据缓存。
- 默认视图缓存目录：`data/cache/views`。
- 数据缓存目录：`data/cache/data`。
- 支持按前缀清理缓存。

`core/rss.py`：

- RSS 内容缓存：`data/cache/rss`。
- 文章详情缓存：`data/cache/content`。

### 14.2 Redis

`core/redis_client.py`：

- 可通过 `redis.url` 连接 Redis。
- 可选启动内置 Redis 服务。
- 用于：
  - token/cookie 存储。
  - 登录状态。
  - 环境异常统计。
  - 文章统计缓存。

环境异常统计记录：

- 按日期记录总数。
- 按 URL 记录异常。
- 按公众号统计异常次数。
- 保存最近日志。

## 15. 前端功能

前端位于 `web_ui/src`，使用 Vue 3、Vue Router、Ant Design Vue、Arco Design、Axios。

主要页面：

- `Login.vue`：登录。
- `ForgotPassword.vue`：忘记密码。
- `ArticleList.vue`：文章列表。
- `article/ArticleListDesktop.vue`、`ArticleListMobile.vue`：响应式文章列表。
- `AddSubscription.vue`：添加公众号。
- `WeChatMpManagement.vue`：公众号管理。
- `WechatStatus.vue`：微信授权状态。
- `MessageTaskList.vue`、`MessageTaskForm.vue`：消息任务管理。
- `TagList.vue`、`TagForm.vue`：标签管理。
- `AccessKeyManagement.vue`：Access Key 管理。
- `ConfigList.vue`、`ConfigDetail.vue`：配置管理。
- `SysInfo.vue`：系统信息。
- `TaskQueueView.vue`：任务队列状态，包含 WebSocket。
- `CascadeManagement.vue`、`CascadeFeedStatus.vue`：级联管理。
- `EnvExceptionStats.vue`：环境异常统计。
- `FilterRuleList.vue`、`FilterRuleForm.vue`：过滤规则。
- `ExportRecords.vue`：导出记录。

前端路由以 `/` 为主布局入口，登录页为 `/login`。路由守卫会调用 `verifyToken` 检查登录状态。

API 封装位于 `web_ui/src/api`：

- `auth.ts`
- `article.ts`
- `subscription.ts`
- `messageTask.ts`
- `tagManagement.ts`
- `accessKey.ts`
- `cascade.ts`
- `filterRule.ts`
- `taskQueue.ts`
- `tools.ts`
- `export.ts`
- `sysInfo.ts`
- `configManagement.ts`

## 16. 配置能力

配置源文件为 `config.example.yaml`，运行时通常复制为 `config.yaml`。

重点配置：

- `app_name`：应用名称。
- `server.enable_job`：是否启用定时任务。
- `server.auth_web`：是否通过 Web 方式授权。
- `db`：数据库连接字符串。
- `redis.url`：Redis 连接。
- `notice.*`：通知 WebHook。
- `secret`：JWT 密钥。
- `interval`：采集文章间隔。
- `webhook.content_format`：WebHook 正文格式。
- `port`：服务端口。
- `max_page`：首次采集最大页数。
- `rss.*`：RSS 输出配置。
- `token_expire_minutes`：登录 token 有效期。
- `cache.*`：缓存配置。
- `article.true_delete`：删除文章时是否真实删除。
- `gather.*`：采集内容、采集模式、正文补抓、浏览器类型、HTML 清洗。
- `proxy.*`：代理配置。
- `safe.*`：敏感配置隐藏。
- `wechat.allowed_accounts`：允许切换的微信账号。
- `log.*`：日志输出。
- `export.*`：PDF/Markdown 导出配置。
- `cascade.*`：级联配置。

配置类 `core/config.py` 支持：

- 命令行参数 `-config`、`-job`、`-init`。
- YAML 加载。
- 环境变量替换。
- 嵌套 key 读取，如 `cfg.get("rss.base_url")`。
- 可选配置文件加密能力。

## 17. 部署与运行方式

### 17.1 Docker 快速运行

README 中提供：

```bash
docker run -d --name we-mp-rss -p 8001:8001 -v ./data:/app/data ghcr.io/rachelos/we-mp-rss:latest
```

访问：

```text
http://<服务器IP>:8001/
```

### 17.2 本地二开

后端：

```bash
pip install -r requirements.txt
cp config.example.yaml config.yaml
python main.py -job True -init True
```

前端：

```bash
cd web_ui
npm install
npm run dev
```

前端生产构建：

```bash
cd web_ui
npm run build
```

### 17.3 Docker Compose

项目包含：

- `compose/docker-compose.yaml`
- `compose/docker-compose.dev.yaml`
- `compose/docker-compose-sqlite.yaml`
- `Dockerfiles/`

其中开发 compose 适合本地联调，生产运行应通过 `.env` 和 `config.yaml` 管理敏感配置。

## 18. 主要功能清单

| 模块 | 功能 |
| --- | --- |
| 微信授权 | 扫码登录、token/cookie 保存、过期检查、授权二维码通知 |
| 公众号管理 | 搜索、添加、更新、启停、删除、通过文章链接识别公众号 |
| 文章管理 | 列表、详情、刷新正文、删除、清理旧文、已读、收藏、上下篇 |
| RSS 输出 | 全部订阅源、单公众号、搜索 Feed、标签 Feed、RSS/Atom/JSON/模板 |
| 标签 | 标签 CRUD、绑定多个公众号、生成聚合 Feed |
| 消息任务 | cron 定时、模板渲染、WebHook 推送、测试、Headers/Cookies |
| 通知 | 企业微信、钉钉、飞书、Bark、自定义 WebHook |
| 导入导出 | 公众号 CSV/OPML、标签 CSV、文章 MD/DOCX/PDF/JSON/CSV |
| HTML 过滤 | 全局/公众号级规则、selector/id/class/regex/属性过滤 |
| 级联系统 | 父子节点、任务分发、子节点认领、文章上传、心跳、同步日志 |
| 任务队列 | 主队列、正文补抓队列、历史、调度器状态、WebSocket |
| 系统监控 | 系统信息、资源占用、文章统计刷新 |
| 缓存 | RSS 缓存、内容缓存、视图缓存、Redis 统计 |
| 代理 | Deno 代理、HTTP/SOCKS 代理、图片代理 |
| 前端后台 | 文章、公众号、任务、标签、AK、配置、级联、异常统计等页面 |

## 19. 典型数据流

### 19.1 新增公众号并采集文章

1. 用户登录管理后台。
2. 通过微信扫码授权获取 token/cookie。
3. 在“添加订阅”中搜索公众号。
4. 后端调用微信接口获取公众号信息。
5. 写入 `feeds` 表。
6. 根据 `max_page`、`gather.model` 抓取文章列表。
7. 文章写入 `articles` 表。
8. 清理 RSS 和页面缓存。
9. 用户可通过文章列表查看，也可通过 `/feed/{mp_id}.atom` 订阅。

### 19.2 定时消息任务

1. 用户创建消息任务，选择公众号和 cron。
2. `jobs.mps.start_job()` 将任务加入调度器。
3. 到点后执行公众号文章采集。
4. 新文章写入数据库。
5. `jobs.webhook` 根据模板渲染消息内容。
6. 调用企业微信/钉钉/飞书/Bark/自定义 WebHook。
7. 写入任务日志。

### 19.3 级联采集

1. 父节点配置多个子节点。
2. 父节点根据消息任务 cron 创建分配记录。
3. 子节点周期性认领任务。
4. 子节点采集对应公众号文章。
5. 子节点上传文章到父节点。
6. 父节点合并数据、更新分配状态和公众号更新时间。

## 20. 二开关注点

1. 采集逻辑高度依赖微信公众号平台页面和接口，接口变更时优先检查 `driver/wx.py`、`driver/wx_api.py`、`driver/wxarticle.py` 和 `core/wx/model/*`。
2. 文章正文修复和 HTML 清洗分散在 `core/article_content.py`、`tools/fix.py`、`tools/htmltools.py`、过滤规则接口中，新增清洗能力时要注意 RSS 输出和阅读页是否一致。
3. `DB` 在 `core/db.py` 中作为全局连接实例使用，接口和任务都直接取 session；二开时需注意 session 关闭和后台线程并发。
4. RSS 缓存按文件保存，文章更新后要清理相关缓存，否则订阅端可能读到旧数据。
5. Access Key 与 JWT 共存，新增 API 时应优先使用 `get_current_user_or_ak`，除非明确只允许登录用户。
6. 级联功能链路长，涉及父节点、子节点、消息任务、分配记录、文章上传；改动前建议先用单节点手动任务验证，再验证父子节点同步。
7. `config.yaml`、`data/`、`.env`、token、cookie、数据库文件都属于敏感/运行数据，不应提交。
8. 前端同时使用 Ant Design Vue 和 Arco Design，新增页面应尽量沿用已有组件和 API 封装方式。

## 21. 结论

`we-mp-rss` 不只是一个简单的 RSS 生成器，而是一个围绕微信公众号内容采集构建的完整订阅管理系统。它的核心价值在于：

- 将公众号文章转为标准 Feed。
- 提供后台管理、文章阅读、标签聚合和导入导出。
- 通过定时任务和 WebHook 实现自动化通知。
- 通过多采集模式、代理、反爬和正文补抓提升采集成功率。
- 通过级联系统扩展到多节点分布式采集。

从架构上看，项目功能已经覆盖个人订阅、自托管 RSS、团队消息推送和分布式采集几类场景。后续如果继续二开，建议优先围绕“采集稳定性、任务可观测性、缓存一致性、权限边界、级联任务可靠性”五个方向推进。
