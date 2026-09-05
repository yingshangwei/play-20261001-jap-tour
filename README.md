# Kansai 2026 Travel Guide

面向 2026 年关西九日行程的可交互旅行攻略站。项目已完成“通用框架 + 可注入攻略配置”重构，并保留地图、交通卡、旅程动画和每日详细手账能力。

## 当前状态

- 通用攻略注册表、首页、地图、交通、旅程动画和每日手账均由攻略配置驱动。
- Day 1/2 保留现有 URL、视觉样式与交互行为；通用多攻略路由可按注册表加载新攻略。
- 第二套最小攻略和第二种手账模板已通过渲染、类型、lint、构建与浏览器回归验证。
- 行程事实与不可移动锚点以 [AGENTS.md](AGENTS.md) 为准。
- 主页页首可切换“配置 1 · 原行程”和“配置 2 · 从容版”。配置 2 保留固定日期，缩短大阪恢复日晚段，提前烟火日与奈良日午餐；[逐日取舍与来源](docs/research/plan-2-review.md)。
- 配置 2 地址为 `/guides/kansai-2026-plan-2`，九天手账与地图、动画使用同一套路线与交通数据。

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

完整检查：

```powershell
pnpm run check
```

未经明确要求，不发布或部署站点。
