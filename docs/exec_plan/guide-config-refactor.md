---
status: Active
owner: jap-tour
last_verified: 2026-09-04
sources:
  - MAP.md
  - docs/requirements/guide-platform/requirements.md
  - docs/development/guide-platform-architecture.md
  - user-request-2026-09-04
---

# 多攻略配置化重构执行计划

## 文档入口

- [仓库文档地图](../../MAP.md)
- [执行计划索引](index.md)
- [平台需求](../requirements/guide-platform/requirements.md)
- [架构设计](../development/guide-platform-architecture.md)

## 当前进度

已完成 **1/6 个阶段**。第一阶段形成了可运行的纵向切片；地图、动画和首页尚未迁移，不将当前状态表述为“整体配置化完成”。

## Phase 1：通用手账模型与攻略注册表

- [x] 建立 `TravelGuideManifest` 和 `DayJournalConfig`。
- [x] 用判别联合描述时间线、推荐、应变、链接和来源章节。
- [x] 建立按 `guideId` 动态加载的攻略注册表。
- [x] 将 Day 1 改为“路由装配 + 攻略配置 + 通用模板”。
- [x] 保留 `/day-1` URL、现有内容和手账视觉结构。
- [x] 完成聚焦 lint、3 项服务端渲染测试和桌面/移动端浏览器检查。

## Phase 2：地图与交通配置化

- [ ] 建立 `Place`、`GuideDay`、`RouteSegment` 和 `TransitLeg` 模型。
- [ ] 从 `TripMap.tsx` 提取点位、区域、日期和路线段到 `guides/kansai-2026/`。
- [ ] 从 `transitData.ts` 提取交通配置，改为稳定 ID 和点位引用。
- [ ] 校验所有相邻停靠点都有交通段。
- [ ] `TripMap` 只接收通用地图模型，不导入关西数据。
- [ ] 保持单日筛选、局部箭头和无 Key Google Maps 链接行为不变。

## Phase 3：旅程动画配置化

- [ ] 从 `GuideDay` 和 `TransitLeg` 派生地面动画步骤。
- [ ] 将上海航班占位和动画展示文案移入攻略配置。
- [ ] `JourneyPlayer` 只接收通用旅程模型。
- [ ] 移除固定 45/47 数量假设，测试按选中攻略动态计算。

## Phase 4：首页配置化

- [ ] 提取每日摘要、住宿节奏、行李、预订、餐厅、专题和官方链接。
- [ ] 首页组件只负责布局和通用章节渲染。
- [ ] 页面 metadata 由当前攻略生成。
- [ ] 核对首页、地图、动画和手账的日期及停靠顺序一致。

## Phase 5：多攻略路由与模板扩展

- [ ] 增加 `/guides/{guideId}` 和 `/guides/{guideId}/days/{dayId}`。
- [ ] 增加攻略选择入口，并按需加载选中的攻略包。
- [ ] 增加第二套最小示例攻略，验证通用组件没有关西硬编码。
- [ ] 增加第二种每日手账模板，验证同一领域模型可以采用不同样式。
- [ ] 保留 `/` 和 `/day-1` 兼容跳转或兼容渲染。

## Phase 6：校验、测试与迁移收尾

- [ ] 校验重复 ID、未知点位、缺失交通段、日期冲突和静态资源缺失。
- [ ] 遍历攻略注册表执行静态渲染 smoke。
- [ ] 为地图筛选、攻略切换、动画控制和手账模板增加浏览器测试。
- [ ] 将旧 `travel-plans` 数据归并到对应攻略包并清理旧路径。
- [ ] 更新开发命令和 CI，统一使用 pnpm。
- [ ] 完成全量类型检查、lint 和静态构建。

## 关联内容工作

- [Day 2–9 每日手账](../requirements/day-journals/requirements.md)：在 Phase 2 的点位、路线和交通模型稳定后开始，避免再维护一套重复数据。
- [酒店调研](../requirements/hotels/requirements.md)：可与框架重构并行，但必须在酒店坐标、步行时间和行李交通最终验收前完成。
- [页面文案去 AI 味](../requirements/copy-editing/requirements.md)：在 Phase 4 首页内容迁入配置后集中改写，避免先改硬编码、迁移时再改一次。

## 当前已知阻塞

- 全量 TypeScript 检查存在迁移前遗留问题：`TripMap.tsx` 的 Leaflet 空值收窄，以及 Cloudflare Worker 类型声明缺失。
- Windows 静态构建能够生成 `/` 和 `/day-1` 产物，但在 `Build complete` 后出现一次 libuv 退出断言，需要在收尾阶段定位。
- 全量 lint 仍包含 `.agents/skills` 下第三方脚本问题，以及 `JourneyPlayer.tsx` 的既有可访问性告警。

## 每阶段完成门槛

1. 新模型有运行时校验或自动化覆盖。
2. 关西行程事实与迁移前一致。
3. 聚焦 lint 与相关测试通过。
4. 涉及 UI 的阶段完成桌面、移动端和关键交互检查。
5. 在本计划中记录完成项、验证命令和遗留阻塞。

## 整体完成标准

新增一套攻略只需要新增攻略目录、提供符合 Schema 的配置并注册加载入口。通用组件无需修改；CI 能遍历所有攻略完成配置校验和页面验证；至少两套攻略及两种手账模板通过验收。
