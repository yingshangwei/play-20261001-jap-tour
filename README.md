# Kansai 2026 Travel Guide

面向 2026 年关西九日行程的可交互旅行攻略站。项目正在从单套关西攻略重构为“通用框架 + 可注入攻略配置”，并保留地图、交通卡、旅程动画和每日详细手账能力。

## 当前状态

- 已完成通用攻略注册表和每日手账抽象模型。
- Day 1 已迁移为配置驱动，并保留现有 `/day-1` 页面与视觉样式。
- 地图、交通、动画和首页仍在迁移计划中。
- 行程事实与不可移动锚点以 [AGENTS.md](AGENTS.md) 为准。

## 文档入口

- [文档地图与协作规范](MAP.md)
- [攻略平台需求](docs/requirements/guide-platform/requirements.md)
- [配置化架构设计](docs/development/guide-platform-architecture.md)
- [配置化重构执行计划](docs/exec_plan/guide-config-refactor.md)

## 本地开发

要求 Node.js `>=22.13.0`，仓库统一使用 pnpm。

```powershell
pnpm install --frozen-lockfile
pnpm run dev
```

常用检查：

```powershell
pnpm run build
node --test tests/rendered-html.test.mjs
pnpm run lint
```

未经明确要求，不发布或部署站点。
