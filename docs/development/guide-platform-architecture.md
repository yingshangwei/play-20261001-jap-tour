---
status: Active
owner: jap-tour
last_verified: 2026-09-05
sources:
  - app/guide-core/types.ts
  - app/guide-core/defineGuide.ts
  - guides/registry.ts
  - guides/kansai-2026/guide.ts
  - guides/kansai-2026/configurations/plan-2/guide.ts
---

# 配置驱动设计与配置位置

## 文档入口

- [仓库文档地图](../../MAP.md)
- [开发文档索引](index.md)
- [协作规则](../../AGENTS.md)
- [平台需求](../requirements/guide-platform/requirements.md)
- [旅行约束](../requirements/kansai-2026/constraints.md)
- [实现与验证记录](../exec_plan/guide-config-refactor.md)

## 一套界面，按配置生成内容

配置是有类型约束的 TypeScript 对象，可以通过代码组合，交给渲染层的结果须可序列化。它描述内容、资源与模板选择，不是另一套页面代码。2026-09-05 按当前注册表、配置入口和组件核对本文，未改应用行为。

读取顺序：页面中的攻略标识 → 注册表按需加载 → 配置校验与数据派生 → 共享首页、地图、动画和手账。

| 层次 | 实际代码 | 职责 |
| --- | --- | --- |
| 数据模型 | [types.ts](../../app/guide-core/types.ts) | `TravelGuideManifest` 汇总攻略；`Place`、`GuideDay`、`TransitLeg` 定义点位、顺序与交通；首页、动画、手账有各自的内容模型。 |
| 配置注册 | [registry.ts](../../guides/registry.ts) | 通过 `guideId` 动态加载；`configuration.group` 将同一次旅行的版本组成首页切换组。 |
| 校验与派生 | [defineGuide.ts](../../app/guide-core/defineGuide.ts)、[dayRoutes.ts](../../app/guide-core/dayRoutes.ts) | 检查标识、点位引用、交通和日期；生成地图模型、动画步骤、全天路线和手机分段。 |
| 共享首页 | [GuideHome.tsx](../../app/guide-ui/GuideHome.tsx) | 从选中配置读取首页内容，生成同组切换入口，装配地图与动画。 |
| 地图与动画 | [TripMap.tsx](../../app/TripMap.tsx)、[JourneyPlayer.tsx](../../app/JourneyPlayer.tsx) | 分别接收 `GuideRouteModel` 和 `JourneyModel`，不导入具体攻略包。 |
| 手账与模板 | [DayJournal.tsx](../../app/guide-ui/day-journal/DayJournal.tsx) | 按 `DayJournalConfig` 渲染，支持 `hand-journal` 和 `compact-journal` 两种模板；共用章节模型，样式可以不同。 |

## 两份关西配置在哪里

- 配置 1：`kansai-2026`，根目录为 [guides/kansai-2026](../../guides/kansai-2026/)。
- 配置 2：`kansai-2026-plan-2`，目录为 [configurations/plan-2](../../guides/kansai-2026/configurations/plan-2/)。
- 开发示例：[sample-weekend](../../guides/sample-weekend/guide.ts)，用于检查组件通用性，不加入关西切换组。

| 内容 | 配置 1 | 配置 2 |
| --- | --- | --- |
| 汇总入口 | [guide.ts](../../guides/kansai-2026/guide.ts) | [guide.ts](../../guides/kansai-2026/configurations/plan-2/guide.ts) |
| 首页、逐日摘要、餐厅和预订 | [home.ts](../../guides/kansai-2026/home.ts) | [home.ts](../../guides/kansai-2026/configurations/plan-2/home.ts) |
| 每日停靠顺序 | [days.ts](../../guides/kansai-2026/days.ts) | [days.ts](../../guides/kansai-2026/configurations/plan-2/days.ts) |
| 点位、坐标与说明 | [places.ts](../../guides/kansai-2026/places.ts) | [places.ts](../../guides/kansai-2026/configurations/plan-2/places.ts) |
| 交通、时刻与备选 | [transit.ts](../../guides/kansai-2026/transit.ts) | [transit.ts](../../guides/kansai-2026/configurations/plan-2/transit.ts) |
| 每日手账 | [journals/](../../guides/kansai-2026/journals/)，目前独立手账为第 1、2 天 | [journals.ts](../../guides/kansai-2026/configurations/plan-2/journals.ts)，覆盖九天 |
| 动画展示与航班占位 | [journey.ts](../../guides/kansai-2026/journey.ts) | 共用配置 1 |
| 目的地照片、说明与署名 | [journey-media.ts](../../guides/kansai-2026/journey-media.ts) | 共用配置 1 |

### 配置 2 是差量覆盖，不是完全独立的副本

配置 2 的每日路线、点位、交通和首页从配置 1 导入，再替换有差异的字段；地图沿用区域配置并覆盖核查说明。第 1、2 天手账复用原版并调整归属与返回文案，第 3–9 天从自己的路线、交通和首页摘要生成。

因此，修改配置 2 的覆盖文件通常只影响配置 2；修改配置 1 的共享源可能影响两套。不能只根据目录判断范围。新增版本复用稳定内容；单版本修改必须保证另一个版本的解析结果不变，必要时提取中立的共享数据或显式保留继承值，不能原地修改导入的数组或对象。

## 页面入口与切换

- 主路由为 `/guides/{guideId}` 和 `/guides/{guideId}/days/{dayId}`；[首页路由](../../app/guides/[guideId]/page.tsx) 与 [手账路由](../../app/guides/[guideId]/days/[dayId]/page.tsx) 根据注册表和已配置手账生成静态参数。
- 配置 1 首页：`/guides/kansai-2026`；`/`、`/day-1`、`/day-2` 是它的兼容入口。
- 配置 2 首页：`/guides/kansai-2026-plan-2`；`/day-3` 对应它的 2026-10-01 大阪恢复日，并非配置 1 的第三天手账。
- 首页切换显示同组配置；地图和动画以攻略标识为组件键，切换后重置状态。详情、返回链接与页面元信息跟随所选版本。
- 静态资源路径在渲染时附加部署前缀；GitHub Pages 模式的页面链接带仓库前缀和 `.html`，逻辑路径不在配置中写死部署地址。

## 三个派生视图的边界

- **动画**：地面步骤由 `GuideDay` 和 `TransitLeg` 生成，数量从选中配置计算；上海往返的两个航班占位属于关西配置。地图始终显示当前目的地，有照片时显示署名和来源；酒店或餐厅区域图不能冒充已订店面，烟火氛围图不能冒充城阳现场。
- **照片**：`mediaByPlaceId` 保存图片、替代文字、说明、作者、许可和来源，由服务端生成带前缀的 `JourneyStep.media`。缺图不回退到其他地点或其他攻略的照片。
- **路线地图**：按日期筛选；只有选中单日并放大到局部区域才显示游览箭头，不绘制跨区域长线。保留无需密钥的 Google Maps 链接，片区步行与跨区域交通分开说明。全天顺序只合并相邻接点，保留中途回店和最终返回；当前链接生成器按手机最多 3 个途经点拆成首尾衔接的分段，单链接最多 9 个途经点、2048 字符，不能静默删点。全天链接不是混合交通导航，逐段交通卡仍是执行依据。限制说明见 [地图链接文档](https://developers.google.com/maps/documentation/urls/get-started)。

## 修改落点与验证

内容改对应配置；统一界面改上表中的共享组件、模板及对应样式。配置仅选择模板或有类型约束的展示选项，不携带组件函数、任意标记或样式。路由装配层可引用攻略标识，通用渲染器不得按具体攻略、日期或地名特化。

新增配置提供符合模型的入口并注册加载器和分组，通用路由会生成已声明页面的静态参数；无需复制首页或手账页面。新增展示能力才扩展通用模型、渲染器与校验。

[回归测试](../../tests/rendered-html.test.mjs)直接加载配置，检查交通覆盖、动态阶段数、配置隔离、页面渲染和资源路径；代码检查使用 `pnpm run check`。架构状态、实际测试结果和未执行的浏览器验证分别记录，不把构建通过表述为交互已验证。
