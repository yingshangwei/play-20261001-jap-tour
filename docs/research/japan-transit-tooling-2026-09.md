---
status: Active
owner: jap-tour
last_verified: 2026-09-06
---

# 日本交通查询：本机工具与核时边界

用户已授权安装免费交通查询工具，并要求后续规划按参考优先级主动使用。这里记录本机实现；执行规则在 [AGENTS.md](../../AGENTS.md)，其他旅行工具见[工具状态总表](travel-tooling-2026-09.md)。本轮不改行程或网站，不申请商业 Key、不付费、不发布。

## 选用方案

- 上游：[groundcobra009/yahoo-transit-mcp](https://github.com/groundcobra009/yahoo-transit-mcp)，MIT，版本 `0.1.0`。
- 固定 commit：`45370a3eb6b72948f0bf5b81c7e7e84870dae1fe`。不是每次启动执行 `npx …@latest`。
- 本机目录：`/Users/yswdra/.codex/tools/yahoo-transit-mcp`；不加入网站依赖或公开前端。
- 运行时：现有 Node `24.19.0`。上游虽然写 Node 18+，锁定依赖实际需要至少 Node 20.18.1。
- 先依上游 `package-lock.json` 执行 `npm ci --ignore-scripts`，不运行安装钩子；依赖审计发现六个可修复的旧依赖后，用 `npm audit fix --ignore-scripts` 更新锁定版本，最终审计零已知漏洞（不等于完整安全保证），再显式编译。最终 lock SHA-256 为 `a4872b92195d83e16619c28fd13a00a1a7de5c11b5066e1103655f9f591540e5`。仅从 npm 官方 registry 安装，没有关闭 TLS、浏览器沙箱或 macOS 安全机制。
- 运行时只读取 Yahoo 公开页面，无需 Key、账号或 Cookie，不启动浏览器，不监听网络端口。需要验证/遇访问限制就停止，改正常浏览器查询。
- MCP 名称：`yahoo_transit_readonly`，已注册到本机 Codex 配置并启用，白名单仅含下列四个工具。原生会话是否重新加载必须单独确认，不能将 CLI 成功说成原生会话已热加载；同时提供可立即使用的本地 CLI，走相同 STDIO MCP 协议。

## 四个只读工具

| 工具 | 适用任务 | 必须保留的限制 |
| --- | --- | --- |
| `search_route` | 按旅行日期、出发或到达时刻查换乘；查询首班/末班 | 必须显式传日本当地日期；出发/到达模式必须带时间，首末班不传时间。聚合结果仍需运营商确认；不是酒店门到门路径，也不是已预订车票 |
| `search_station` | 消除同名站歧义，确认站码、线路和方向 | 难波、JR 难波、大阪难波等不能混用；不凭中文别名默认猜一个 |
| `get_timetable` | 看当前公开的平日、周六或日祝车站时刻表 | 只有 `dayType`，没有指定未来日期功能；不能据此声称旅行日、调图后或活动加班车已核实 |
| `get_train_status` | 查看线路当前已发布的延误/停运公告 | “页面未报告异常”不是正常运行保证；无实时预测，不做后台自动轮询 |

时刻表与聚合结果只能支持当次研究；不整站抓取或把大份数据固化进公开攻略。没有消息写入、账号设置、下单或支付工具。

## 本机调用

原生 MCP 加载后，直接使用上述四个工具。若当前任务尚未发现工具，可立即通过 CLI 调用。无需重复添加连接或索要 Key。

```sh
/Users/yswdra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  /Users/yswdra/.codex/tools/yahoo-transit-mcp/scripts/query.mjs --list

/Users/yswdra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  /Users/yswdra/.codex/tools/yahoo-transit-mcp/scripts/query.mjs search_route \
  '{"from":"大阪難波","to":"ユニバーサルシティ","date":"2026-09-30","time":"06:40","mode":"departure"}'

/Users/yswdra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  /Users/yswdra/.codex/tools/yahoo-transit-mcp/scripts/query.mjs search_route \
  '{"from":"長池","to":"京都","date":"2026-10-04","mode":"last_train"}'
```

CLI 仅允许四个工具或 `--list`；输入必须为 JSON 对象。stdout 是 MCP JSON，`isError` 或协议失败会非零退出。原生连接与 CLI 均以干净环境启动，时间区为 `Asia/Tokyo`。不注入其他工具密钥，不接受自定义 endpoint。

这些命令是查询示例，不是已经确认的推荐班次。首末班结果只到查询终点站；还需计算从车站走回具体酒店和延误余量。

## 本地加固与验证

上游静态审查未发现密钥读取、命令执行、文件写入或登录行为。但日期/缺失字段校验和运行信息措辞不足，因此在固定版本上保留小范围本地修补；升级不能直接覆盖这些修补。

### 本地修补

- 固定 HTTPS Yahoo 域名、无认证或 Cookie；拒绝跨域、登录及其他非预期重定向。唯一允许的重定向是公开车站搜索到同域数字站码页面的规范化跳转，不能继续链式跳转。
- 响应最多 4 MiB、缓存最多 16 项、请求串行且间隔 1.5 秒；普通查询缓存 15 分钟、运情 60 秒，返回实际抓取时间，不能当实时保证。
- 校验真实日历日期和时间；核对 Yahoo `queryState` 实际采用的日期/模式。首末班内部补齐页面要求的时钟字段，修复上游“不带时间就把未来日期悄悄改为今天”的问题，但对用户仍是日期查询。
- 只有页面明确提供的 `calendarData` 才输出带日期、`+09:00` 的出发/到达时间；跨午夜不靠 HH:MM 大小猜日期。修复终点节点单条 `type=3` 到达时间遗漏。
- 拒绝被强制降级的平均时间搜索，关键字段缺失时报错。日型时刻表和未报告异常的运情均带限制说明；四个工具标注只读。
- 新增 `scripts/query.mjs` CLI、显式触发的 `scripts/live-check.mjs` 小样本验收与 `tests/` 离线回归；它们不定时运行，也不保存原始页面或评论数据。

### 2026-09-06 验证结果

| 检查 | 结果与边界 |
| --- | --- |
| TypeScript 与离线测试 | 编译通过；14 项离线测试通过；工具目录 `git diff --check` 通过 |
| MCP 协议 | STDIO 初始化、工具列表通过；恰好四个只读工具，CLI 与实际连接使用相同协议 |
| 指定日期路线（4 项） | 9/30 大阪难波→Universal City、10/4 长池→京都、10/5 出町柳→贵船口、10/7 南海难波→关西机场车站全部返回对应旅行日期的候选；包含出发和到达时间模式 |
| 首末班（2 项） | 9/30 USJ 首班、10/4 长池→京都末班通过；后者明确返回 10/5 的跨午夜到达日期，不误记为同日 |
| 车站/日型表/运情（3 项） | 长池站解析、奈良线京都方向日祝晚间表、近畿叡山运行信息全部通过 |
| 实际客户端配置 | `codex mcp get yahoo_transit_readonly` 确认已启用 STDIO；四工具白名单、15 秒启动与45秒调用超时。未声称当前对话原生工具已热加载 |

联网验收 **9 项全部通过**，另有协议初始化/列表验证。只证明查询工具当前可用，不是一次全面行程核验：没有核查贵船巴士 33 路、活动加班车、运营商调图公告、酒店接驳或座位库存；未据此改动现有行程。机场查询区分南海难波站与大阪难波、机场车站与航站楼，不能拿区域名称默认替代精确站点。

## 后续每段交通的采信流程

1. 从选中行程配置读旅行日期、上下车站、时间窗口；查询一两个合理方案，不批量遍历全线路。
2. 用 Yahoo 工具取得候选。核对返回的实际查询日期/模式，保存来源链接、抓取日期及聚合查询标记；日型表不能提升为旅行日期验证。
3. 关键早班、晚归、低频公交和换乘衔接对照运营商官网。特别关注 USJ 早出、城阳烟火后的长池返程、叡山电车＋京都巴士 33 路，以及南海机场线。
4. 算全段：酒店步行、车站入口、候车、换乘、活动散场、最后步行回店。不能只取某一条线的终电，必须保留能完成整段的实际截止与下一方案。
5. 分开标注“官方核实”“聚合查询”“估算”。遇来源冲突、日期范围不支持、运行中断、缺失数据时标待确认，不沿用看似精确的旧分钟数。

## 未接入的候选

- [駅すぱあと官方 MCP](https://github.com/ValLaboratory/ekispert-api-mcp-server-docs)确有指定日期/首末班能力，但要 Key；[评估版条款](https://api-info.ekispert.com/form/trial/)限制用途和查询结果对外公开。本次不注册、不接通。
- [NAVITIME API](https://api-sdk.navitime.co.jp/api/specs/api_guide/route_transit.html)基础方案的平均时间不是实际班次，真实铁路/公交时刻表及首末班需要商业附加选项。本次不购买或安装相应包装器。
- [Transit CLI](https://github.com/atani/transit)和 [Japan Transit MCP](https://github.com/Anchovy-s3/japan-transit-mcp)使用同一第三方公开 API。9/6 检查其 [feed 清单](https://api.transit.ls8h.com/api/v1/feeds)未见京都巴士、京都市巴士和奈良交通，相关铁路也存在更新与适用期不确定性；本轮不作为重复备份安装。
- [京都巴士官方 ODPT 数据](https://ckan.odpt.org/ja/dataset/kyoto_bus_all_lines)可作进一步研究来源，但需开发者注册且 GTFS 本身不是完整换乘引擎。本次未注册/下载，不能声称已覆盖贵船 33 路。

## 协作者与更新

Git 只共享这些操作规则，不共享本机安装、个人配置或认证。其他电脑需独立安装相同固定版本、审查本地修补并运行回归；工具未安装时先按公开网页工作并披露限制。升级时重新核对接口结构、日期处理、只读白名单与许可证。不要为了让安装流程“成功”而关闭安全机制或把失败结果当可用数据。
