---
status: Complete
owner: jap-tour
last_verified: 2026-09-05
sources:
  - MAP.md
  - docs/requirements/guide-platform/requirements.md
  - app/guide-core/types.ts
  - guides/registry.ts
---

# 多攻略配置化架构

## 文档入口

- [仓库文档地图](../../MAP.md)
- [开发文档索引](index.md)
- [平台需求](../requirements/guide-platform/requirements.md)
- [重构执行计划](../exec_plan/guide-config-refactor.md)

## 架构原则

- 通用框架只认识领域模型，不导入关西攻略数据。
- 攻略包保持可序列化，并通过注册表按 `guideId` 动态加载。
- 点位、每日顺序和交通段分别只有一个权威定义。
- 地图、交通卡和动画是配置的派生视图，不维护平行副本。
- 手账内容与视觉模板分离，配置只保存模板标识和主题资源。
- 迁移采用可运行的小阶段，每阶段保留现有 URL 和内容一致性。

## 目标目录

```text
app/
  guide-core/                 # Schema、校验、选择器、链接工具
  guide-ui/                   # 首页、地图、动画、手账通用组件
guides/
  registry.ts                 # 攻略目录和动态加载入口
  <guide-id>/
    guide.ts                  # 攻略清单
    places.ts                 # 点位
    days.ts                   # 每日路线
    transit.ts                # 交通段
    journey.ts                # 动画文案、附加点位与附加步骤
    home.ts                   # 首页章节、逐日摘要与 metadata
    journals/                 # 每日详细手账配置
    assets.ts                 # 可选的集中静态资源声明
```

## 核心模型

| 模型 | 职责 | 当前状态 |
| --- | --- | --- |
| `TravelGuideManifest` | 攻略身份、语言、时区和各配置入口 | 已建立 |
| `DayJournalConfig` | 每日手账内容、章节、模板和资源 | 已建立 |
| `Place` | 唯一点位、坐标、区域和分类 | 已建立 |
| `GuideDay` | 日期、住宿基点和有序路线段 | 已建立 |
| `RouteSegment` | 当天片区、交通方式和有序停靠点 | 已建立 |
| `TransitLeg` | 两点间交通、时刻、末班和备选 | 已建立 |
| `JourneyConfig` | 动画展示、附加点位、附加步骤和交通图标 | 已建立 |
| `JourneyModel` | 由攻略配置派生、供播放器直接消费的通用视图模型 | 已建立 |
| `HomePageConfig` | 首页 metadata、章节文案、逐日摘要与外链 | 已建立 |

## 数据流

```text
guides/<guide-id> 配置
          |
          v
      guide registry
          |
          v
  Schema 校验与选择器
          |
    +-----+------+---------+----------+
    |            |         |          |
    v            v         v          v
  首页          地图      动画      每日手账模板
```

## 已确认的技术决策

1. 注册表使用动态 `import()`，避免所有攻略默认进入同一加载路径。
2. 手账章节使用判别联合，模板通过穷尽分支渲染章节。
3. `presentation.template` 只保存模板标识；React 组件由通用模板注册表管理。
4. 旧 `travel-plans` 数据可在迁移期由攻略配置适配，但最终应归入对应攻略包。
5. 静态资源使用以 `/` 开头的逻辑路径，渲染时统一附加部署前缀。
6. 动画步骤在服务端选择器中派生；客户端不再接收整份路线配置，也不维护具体攻略的点位或文案。
7. 攻略与手账动态 URL 由注册表生成静态参数；新增攻略只注册加载器，不修改通用首页、地图或播放器。
8. 手账模板通过 `DayJournalTemplateId` 注册；`hand-journal` 与 `compact-journal` 共用同一章节领域模型。
9. 同一旅行的版本用注册表 `configuration.group` 分组，页首只显示同组版本；每个版本有独立 URL 和动态加载器，开发示例不混入旅行配置切换。
10. 关西配置 2 位于 `guides/kansai-2026/configurations/plan-2/`，以不可变差量覆盖共享配置。Day 3–9 紧凑手账由同一 `GuideDay`、`TransitLeg` 和首页摘要派生；地图和动画以 guide ID 为 key，切换后重置播放和筛选状态。
11. `JourneyConfig.mediaByPlaceId` 提供可选的目的地照片、说明、作者、许可和来源；关西两套配置共用 `journey-media.ts`，服务端生成带静态部署前缀的 `JourneyStep.media`。播放器不导入具体图库，缺图时不回退到另一地点照片；酒店、餐厅区域图和烟火氛围图必须明确标注。
12. 全天路线由 `dayRoutes.ts` 从当前 `GuideDay.segments` 派生，只合并相邻接点，保留中途回酒店和最终返回。超过手机容量时分成首尾相接的小段，不静默删点；全天链接仅展示停靠顺序，交通方式仍以逐段卡片为准。[Google Maps URLs 文档](https://developers.google.com/maps/documentation/urls/get-started)规定手机浏览器最多 3 个途经点、其他受支持平台最多 9 个，URL 不超过 2048 字符。

## 迁移边界

- 当前 `/day-1` 是兼容路由，只做配置加载和渲染装配。
- `/guides/:guideId` 与 `/guides/:guideId/days/:dayId` 是通用主路由；`/`、`/day-1` 和 `/day-2` 保留为关西攻略兼容入口。
- `TripMap.tsx` 已只接收通用路线模型；关西点位、日期、路线段和交通配置位于 `guides/kansai-2026/`。
- `JourneyPlayer.tsx` 只接收 `JourneyModel`；地面步骤由 `GuideDay` 和 `TransitLeg` 派生，航班占位与展示文案位于攻略包的 `journey.ts`。
- 首页只从当前攻略的 `HomePageConfig` 渲染；配置初始化会把逐日摘要与权威 `GuideDay` 对齐校验。
- 已跟踪的旧行程计划已归并到攻略包；静态资源路径由注册表测试遍历验证。
- 不在配置化重构中顺带改变行程内容；内容调整必须遵守 `AGENTS.md`。
- 通用代码不得出现 `kansai-2026`、大阪、京都等具体攻略判断。
