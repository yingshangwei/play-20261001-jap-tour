# 仓库文档地图

`MAP.md` 是本仓库的文档总入口。任何当前有效的需求、设计、执行计划和研究材料，都应当从这里最多两次点击到达。

## 当前直达文档

| 主题 | 权威文档 | 状态 |
| --- | --- | --- |
| 行程固定事实与编辑约束 | [AGENTS.md](AGENTS.md) | Active |
| 攻略平台业务需求 | [docs/requirements/guide-platform/requirements.md](docs/requirements/guide-platform/requirements.md) | Active |
| 酒吧搜索功能需求 | [docs/requirements/bar-search/requirements.md](docs/requirements/bar-search/requirements.md) | Draft |
| 每日手账天气子模块 | [docs/requirements/day-journals/weather-module.md](docs/requirements/day-journals/weather-module.md) | Draft |
| 配置化架构与数据边界 | [docs/development/guide-platform-architecture.md](docs/development/guide-platform-architecture.md) | Active |
| 配置化重构阶段计划 | [docs/exec_plan/guide-config-refactor.md](docs/exec_plan/guide-config-refactor.md) | Active |
| 完整文档索引 | [docs/index.md](docs/index.md) | Active |

## 分区索引

- [需求文档](docs/requirements/index.md)
- [开发文档](docs/development/index.md)
- [执行计划](docs/exec_plan/index.md)
- [研究材料](docs/research/index.md)

## 目录职责

| 位置 | 职责 |
| --- | --- |
| `README.md` | 项目简介、当前状态和最短启动路径 |
| `AGENTS.md` | 行程不可变事实、编辑约束和禁止事项 |
| `docs/requirements/` | 目标、范围、功能要求、约束和验收标准 |
| `docs/development/` | 架构、数据模型、代码边界和技术决策 |
| `docs/exec_plan/` | 阶段计划、已完成事实、验证结果和阻塞项 |
| `docs/research/` | 外部资料、方案比较和待转化的研究结论 |

## 文档协作规范

1. 一个事实只设一个权威来源，其他文档使用链接，不复制整段内容。
2. `docs/` 下的协作文档必须包含 YAML 元数据、一级标题和“文档入口”。
3. 文档状态只使用 `Active`、`Draft`、`Superseded`、`Archived`。
4. 新增权威文档时，同步对应分区索引；若它是当前工作入口，同时更新本文件。
5. 需求变更写入 `requirements`，技术方案写入 `development`，执行进度写入 `exec_plan`，外部证据写入 `research`。
6. 已完成事实必须附日期和验证方式；未验证的判断不得写成当前事实。
7. 文档移动后清理旧路径，保证所有本地 Markdown 链接可解析。

## 两跳规则

- `MAP.md` 直接链接所有当前核心文档。
- 非核心专题至少出现在其分区 `index.md` 中。
- 分区索引必须同时链接 [docs/index.md](docs/index.md) 和本文件。

## 维护检查

```powershell
rg --files -g '*.md'
rg -n "docs/design|docs/README|待补|占位|FIXME" README.md MAP.md docs
```
