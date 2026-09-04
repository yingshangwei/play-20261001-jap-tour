---
status: Active
owner: jap-tour
last_verified: 2026-09-04
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
    journals/                 # 每日详细手账配置
    assets.ts                 # 静态资源声明
```

## 核心模型

| 模型 | 职责 | 当前状态 |
| --- | --- | --- |
| `TravelGuideManifest` | 攻略身份、语言、时区和各配置入口 | 已建立 |
| `DayJournalConfig` | 每日手账内容、章节、模板和资源 | 已建立 |
| `Place` | 唯一点位、坐标、区域和分类 | 待建立 |
| `GuideDay` | 日期、住宿基点和有序停靠点 | 待建立 |
| `TransitLeg` | 两点间交通、时刻、末班和备选 | 待建立 |
| `JourneyPresentation` | 航班占位、动画标签和播放展示 | 待建立 |

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

## 迁移边界

- 当前 `/day-1` 是兼容路由，只做配置加载和渲染装配。
- `TripMap.tsx`、`JourneyPlayer.tsx` 和首页在各自迁移完成前仍属于旧实现。
- 不在配置化重构中顺带改变行程内容；内容调整必须遵守 `AGENTS.md`。
- 通用代码不得出现 `kansai-2026`、大阪、京都等具体攻略判断。
