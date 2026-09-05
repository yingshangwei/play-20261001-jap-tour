---
status: Active
owner: jap-tour
last_verified: 2026-09-06
---

# 旅行信息工具：安装结果与接入边界

本记录涵盖 9 月 5 日初始安装与 9 月 6 日接通、验证和交通工具安装。以下状态均带时间边界，不保证后续会话登录、余额或供应商接口一直有效。没有订房订餐、推送或部署；原有播放器和其他工作区改动保留。后续研究按 [AGENTS.md 的分领域参考优先级](../../AGENTS.md)执行。

## 已安装

个人级 skills 位于本机 `~/.codex/skills/`，工具及只读适配层位于 `~/.codex/tools/`。它们不在网站依赖中，也不会随 Git 同步给协作者。没有改全局 shell PATH 或注册常驻后台服务；MCP 由客户端按需启动。新装交通工具的固定版本、验证记录见 [日本交通工具安装](japan-transit-tooling-2026-09.md)。

| Skill | 能力与来源 | 当前验证状态 |
| --- | --- | --- |
| `michelin-guide-search` | 从 [SearchOS 的 guide_michelin_com](https://github.com/antins-labs/SearchOS/tree/31d9e4248f0256347f208a67346a0e7931553e81/searchos/skills/library/access/guide_michelin_com) 隔离适配；JSON CLI 查询星级、菜系、城市、坐标附近餐厅 | 已联网查到料理屋まえかわ的 2026 一星记录；京都 + JP + 一星查询返回京都记录。无需个人密钥，但这是网站使用的 Algolia 后端，不是官方开发者 API |
| `google-places-cli` | [goplaces v0.4.9](https://github.com/openclaw/goplaces/releases/tag/v0.4.9)，地点、评分/评论样本、营业信息、路线 | 9/6 经 Keychain 包装器实测地点搜索、详情五条评论、WALK 路线通过。调用前须确认 Free Trial 有余额/有效期；没有设置云端免费 SKU 硬上限；日本 TRANSIT 不受 Routes API 支持 |
| `xiaohongshu-travel-research` | 用户授权的浏览器只读查询；另有未启用的 [xiaohongshu-mcp v2.5.0](https://github.com/xpzouying/xiaohongshu-mcp/releases/tag/v2.5.0) 二进制 | 9/6 Codex 内置浏览器已登录，搜索与笔记正文读取通过。Chrome 的另一会话未登录；优先复用内置浏览器。MCP 有浏览器沙箱/隔离属性安全阻断，禁止直接启动 |
| `hotel-stay-screening` + `dida_readonly` | 三人入住、床型、全程含税价、退改、回店交通、前台和行李；通过 [Dida 酒店接口](https://github.com/DIDA-AI/Dida-hotel-MCP-CN)只读适配 | 9/6 实测元数据、大阪酒店搜索、房型/退改详情通过；STDIO 初始化/列表/写操作拒绝测试通过。当前会话原生 MCP 是否重载需单独确认，本地 CLI 可直接使用 |
| `yahoo_transit_readonly` | 固定版本 Yahoo Transit 社区 MCP 与本地 CLI；指定日期换乘、车站及日型时刻表、运行公告 | 本轮安装与测试记录见[专页](japan-transit-tooling-2026-09.md)；这是聚合查询，不代替运营商核时 |
| `lark-cli` | 用户先前安装的飞书 CLI，用于授权文档读取 | 9/6 本地版本检查为 `1.0.92`；须使用可找到 Node 的运行环境。本轮未重新读取飞书文档，认证时效和目标文档权限应在使用时检查，不等于已经永久授权 |

已有 `trip-planner`、`japan-recs`、`jap-tour-sync` 和 `rollinggo-hotel-booking` 保留，不重复安装。酒店研究优先 `hotel-stay-screening` + Dida 三个只读查询工具，不因 RollingGo skill 包含订购流程就扩大到订单、锁房或支付。

**PriceWin 暂不可用作报价判断。** 9/6 已补齐依赖并保持浏览器沙箱，但三人大阪实测出现错误的 USD 金额；Google 查询未传成人数，币种、每晚/全程及同房型口径也不可靠。其 skill 已加入阻断说明。在修复并与源报价页核对前，不重跑它生成“最低价推荐”。

## 中国平台的开放能力

| 平台 | 官方事实 | 对个人旅行研究的实际意义 |
| --- | --- | --- |
| 小红书 | [账号开放平台](https://openaccount.xiaohongshu.com/docs/quick-start)当前公开的首期权限以 `basic_info` 账号资料为主；[电商开放平台](https://xiaohongshu.apifox.cn/doc-2811119)主要面向企业/商家 | 本次未找到可核实的个人通用笔记搜索 API/MCP；已装的是非官方本地浏览器工具，不是官方数据许可 |
| 携程 | [官方企业商旅 AI 开放平台公告](https://ct.ctrip.com/thinktanks/235566117077549)明确提供标准/高级/定制 MCP，酒店、机票、火车和差旅信息等能力；[开发者入口](https://openapi.ctripbiz.com/) | 不能说“携程没有官方 MCP”；但目前核实的是企业客户/生态伙伴接入，未核实普通游客直接自助获取公开 endpoint/Key 的流程 |
| 去哪儿 | [国际酒店 Open 文档](https://open.hotel.qunar.com/doc/api-cn.htm)要求商务联系、账号、联调，部分订单接口有签名/IP 约束 | 酒店和报价接口主要是供应商提供给去哪儿调用，不等于可读取全站房价的个人公共 API；未找到可靠个人官方 CLI/MCP |

携程门票玩乐还有[供应链开放接口](https://ttdopen.ctrip.com/apiplatform/help-detail.do?no=88)，与攻略检索不是一回事。没有为了“多安装几个”接入随机同名采集服务。

## 使用边界与当前接入方式

1. **小红书**：先检查当前内置浏览器标签和登录状态，再小量搜索、打开近期实访笔记。到登录或验证码时交给用户在同一浏览器完成。不要要求已登录的用户去另一浏览器重复登录，不导出或导入 Cookie。禁止启用当前有安全阻断的 MCP；禁止发帖、点赞、收藏、评论等写操作。
2. **Google**：凭据已通过本机 Keychain 配置，不需再次在聊天提交。使用 `/Users/yswdra/.codex/tools/google-places-readonly/google-places-keychain run …`，先读对应 skill。用户接受消耗仍有效的 Free Trial 赠金，但没有授权实际付费或升级；余额/试用状态不明或已升级/耗尽时停用 API，改公开网页。预算提醒与本地包装器均不是免费额度硬上限。评论最多五条样本；遵守 [Places 政策](https://developers.google.com/maps/documentation/places/web-service/policies)，不将评论/图片/Google 路线自动固化进 Leaflet 攻略。日本公交/铁路改用消费者网页和运营商时刻表，不能反复调用不支持日本的 Routes TRANSIT。[Google 官方 FAQ](https://developers.google.com/maps/faq#transit_directions_countries)
3. **Dida 酒店**：`dida_readonly` 已配置为本机 Python STDIO 只读桥接。只允许 `searchHotels`、`getHotelDetail`、`getHotelSearchTags`，Keychain 凭据不输出。供应商宣称 Key 版免费、不限调用，需在后续使用时复核；不代表全网最低。搜索最低价在实测中是全程总额而非每晚，最终需查房型价目、床数、税费和退改。已有初始化、查询和只读限制验证，无需重复注册。不要开启 OAuth 订单、锁价、支付能力。

本轮已注册指定交通 MCP 的客户端配置，没有改其他连接、创建自动监控、关闭安全机制、购买 API 套餐或发布网站。2026-09-06 的原生插件目录搜索能力未暴露可调用工具，因此接入核查使用官方网页与上游代码，没有把推荐插件列表当成完整市场目录。

## 本机调用入口（不含凭据）

| 能力 | 入口 |
| --- | --- |
| 日本交通 | MCP 名称 `yahoo_transit_readonly`；本地 CLI 与示例见[交通安装专页](japan-transit-tooling-2026-09.md) |
| Dida | `~/.codex/tools/dida-readonly/verify_mcp.py schema` 获取只读查询参数；`call --name searchHotels --arguments '<非敏感 JSON>'`。使用已配置 Python；调用前读 hotel skill 的 `references/dida.md`。不要运行包装器的凭据输出子命令 |
| Google | `~/.codex/tools/google-places-readonly/google-places-keychain run search …`／`run details …`。查询前核试用状态；仅在确有必要时取评论 |
| Michelin | 在 `~/.codex/skills/michelin-guide-search` 用 `.venv/bin/python scripts/query.py`，支持 `search`、`nearby`、`slug`；不批量抓取 |
| 小红书/官方网页 | 当前浏览器控制与 Web 工具；先观察状态，绝不写死旧标签 ID，不读取或迁移登录存储 |
| 飞书参考文档 | `/Users/yswdra/.local/bin/lark-cli`；先看 `--help`，使用本机已配置的 Node 环境。仅在用户指定范围内读取，不发送消息或修改文档 |

这些路径只描述本机安装。协作者应按对应 skill/上游说明独立安装并验证，不拷贝密钥、个人登录状态或整个 Codex 配置。

## 为什么未安装其他候选

- [nomnom-trip / restaurant-finder](https://github.com/wirtsi/nomnom-trip)：偏欧洲指南与自然酒，需先批量同步本地 SQLite；对本次关西范围不如定向米其林查询直接。没有启动全库抓取或定时更新。
- [traveloptimizer](https://github.com/nkittur/traveloptimizer/tree/b33a01ca0a0cb05bec89f89fbb5e7ccbba2832f0/.claude/skills)：餐厅流程绑定它自己的 Supabase、根目录脚本和网页；酒店在目的地 skill 中，含作者家庭偏好与出发地。相关 skill 未找到清晰适用许可证，不原样复制。
- [Rakuten MCP](https://github.com/mrslbt/rakuten-mcp)：日本酒店很相关，但仍需开发者凭据，且部分 API 版本兼容性待真实查询确认；先不与 Dida 重复接入。
- [駅すぱあと官方 MCP](https://github.com/ValLaboratory/ekispert-api-mcp-server-docs)：日本换乘有价值，但公开试用面向法人；个人准入待确认，保留运营商官网核时。
- 小红书远程浏览器扩展路线会让请求和结果经过额外第三方服务；当前用已授权的本地浏览器读取，不转交 Cookie 或接入额外远程浏览器服务。

## 安装核验与可复现记录

- SearchOS 固定 commit `31d9e4248f0256347f208a67346a0e7931553e81`，保留 MIT 许可证。源目录是小写 `skill.md` 而非标准 `SKILL.md`，所以没有直接用标准安装器或执行其根目录安装脚本。适配增加 CLI、严格地域筛选、国家码、超时、TLS 和小页数限制，修正零坐标判断；依赖锁在 skill 的 `requirements.txt`，单独 Python venv，不改网站依赖。
- goplaces 固定 `v0.4.9` macOS arm64；压缩包 SHA-256 `8c133880df665101777cfb6e395f1336521870980c1866584076e9db2978250a`。`codesign --verify --strict` 通过，签名为 OpenClaw Foundation。未运行 Homebrew Cask 的清除 quarantine 操作。
- 小红书固定 `v2.5.0` macOS arm64；MCP SHA-256 `3e32e08c3403d22a5efef2f06aa52630b458819fc54474cba23e896c7092c38e`；登录程序 SHA-256 `db5d07c03933b8192dab726d896a028721b096ea452f6e9967ef63a30618ba99`，与 [GitHub 发布资产摘要](https://github.com/xpzouying/xiaohongshu-mcp/releases/expanded_assets/v2.5.0)一致，保留 Apache-2.0 许可证。哈希一致不等于完整安全审计。
- 4 个 skill 的格式验证通过；米其林适配 5 项单元测试通过。实测分别验证名称查询与严格地域/一星查询；不把返回预订链接解释成 3 人有位。
- 没有触碰网页实现或运行静态站点发布。其他电脑需单独安装，不能从 GitHub Pages 获取本机工具或凭据。
