import type { GuideDay } from "@/app/guide-core/types";

export const kansaiDays: GuideDay[] = [
  {
    id: "09.29", date: "2026-09-29", dayNumber: 1, shortLabel: "09.29", filterLabel: "9月29日", weekday: "周二", areaLabel: "大阪抵达", title: "抵达大阪 · 只走难波夜线",
    segments: [
      { id: "airport-to-osaka", label: "机场进城", note: "抵达日从关西机场前往大阪住宿；这是跨区域交通，不在地图上画箭头。", pointIds: ["kix", "osaka-stay"], mode: "transit" },
      { id: "namba-evening-loop", label: "难波夜行 · 回到住宿", note: "住宿点目前是难波／心斋桥区域中心，实际酒店确定后再校准首尾步行距离。", pointIds: ["osaka-stay", "shinsaibashi", "dotonbori", "hozenji", "osaka-stay"], mode: "walking", drawOnMap: true },
    ],
  },
  {
    id: "09.30", date: "2026-09-30", dayNumber: 2, shortLabel: "09.30", filterLabel: "9月30日", weekday: "周三", areaLabel: "USJ", title: "USJ 全天",
    segments: [
      { id: "usj-round-trip", label: "住宿往返 USJ", note: "从大阪住宿出发，闭园后回到同一住宿；园内项目顺序随排队时间调整，以 USJ App 为准。", pointIds: ["osaka-stay", "usj", "osaka-stay"], mode: "transit" },
    ],
  },
  {
    id: "10.01", date: "2026-10-01", dayNumber: 3, shortLabel: "10.01", filterLabel: "10月1日", weekday: "周四", areaLabel: "大阪慢行", title: "USJ 后的轻松大阪",
    segments: [
      { id: "south-osaka-loop", label: "大阪南区慢行 · 住宿闭环", note: "10:30 后再开始；わなか作为回难波途中的顺路小吃，任何一站觉得累都可以提前回住宿。", pointIds: ["osaka-stay", "kuromon", "shitennoji", "tennoji-park", "shinsekai", "den-den-town", "wanaka", "osaka-stay"], mode: "walking", drawOnMap: true },
    ],
  },
  {
    id: "10.02", date: "2026-10-02", dayNumber: 4, shortLabel: "10.02", filterLabel: "10月2日", weekday: "周五", areaLabel: "神户往返", title: "神户山海一日",
    segments: [
      { id: "osaka-to-kobe", label: "大阪前往神户", note: "从大阪住宿出发前往布引；跨城段只提供公共交通导航，不画地图箭头。", pointIds: ["osaka-stay", "nunobiki"], mode: "transit" },
      { id: "kobe-mountain-to-sea", label: "神户山海顺行", note: "缆车上山后一路向下，经北野与 Mouriya 午餐走向港区，不在坡道间来回折返。", pointIds: ["nunobiki", "kitano", "mouriya", "meriken", "harborland"], mode: "walking", drawOnMap: true },
      { id: "kobe-to-osaka", label: "神户返回大阪", note: "看完日落后返回大阪住宿，形成完整住宿往返。", pointIds: ["harborland", "osaka-stay"], mode: "transit" },
    ],
  },
  {
    id: "10.03", date: "2026-10-03", dayNumber: 5, shortLabel: "10.03", filterLabel: "10月3日", weekday: "周六", areaLabel: "岚山·换宿", title: "岚山核心与入住京都",
    segments: [
      { id: "osaka-to-kyoto-hotel", label: "大阪酒店 → 京都酒店", note: "08:15 带箱退房，行李只在住宿点之间移动；到京都前台交箱后才开始游览。", pointIds: ["osaka-stay", "kyoto-stay"], mode: "transit" },
      { id: "kyoto-to-arashiyama", label: "京都酒店 → 岚山", note: "前台完成交接后轻装出发，目标 10:27 JR 京都站班次。", pointIds: ["kyoto-stay", "arashiyama-bamboo"], mode: "transit" },
      { id: "arashiyama-core", label: "岚山核心 · 不追清单", note: "竹林只短停，天龙寺与河岸才是主体验；不追加猴子公园和小火车。", pointIds: ["arashiyama-bamboo", "tenryuji", "togetsukyo"], mode: "walking", drawOnMap: true },
      { id: "arashiyama-to-kyoto", label: "岚山 → 京都住宿", note: "15:02 从嵯峨岚山返回，约 15:30 到住宿取房并休息。", pointIds: ["togetsukyo", "kyoto-stay"], mode: "transit" },
      { id: "kyoto-dinner-loop", label: "京都晚餐后回住宿", note: "料理屋まえかわ是正式晚餐首选；酒店地址未定，暂不在地图上画住宿连线。", pointIds: ["kyoto-stay", "maekawa", "kyoto-stay"], mode: "transit" },
    ],
  },
  {
    id: "10.04", date: "2026-10-04", dayNumber: 6, shortLabel: "10.04", filterLabel: "10月4日", weekday: "周日", areaLabel: "京都·宇治·烟火", title: "哲学之道、宇治与城阳烟火",
    segments: [
      { id: "kyoto-to-higashiyama", label: "住宿 → 京都东山", note: "从京都住宿前往哲学之道；酒店只是区域中心点，因此只提供公共交通导航。", pointIds: ["kyoto-stay", "philosopher"], mode: "transit" },
      { id: "higashiyama-walk", label: "京都东山", note: "哲学之道留足 60–75 分钟，南禅寺结束后直接转往宇治。", pointIds: ["philosopher", "nanzenji"], mode: "walking", drawOnMap: true },
      { id: "higashiyama-to-uji", label: "东山 → 宇治", note: "跨片区转往宇治，不在地图上用长线连接。", pointIds: ["nanzenji", "byodoin"], mode: "transit" },
      { id: "uji-core", label: "宇治", note: "只保留平等院、茶歇与河岸；凤凰堂内部排队过长就跳过。", pointIds: ["byodoin", "nakamura-uji", "uji-river"], mode: "walking", drawOnMap: true },
      { id: "joyo-fireworks-return", label: "城阳烟火 → 返回住宿", note: "从宇治前往 JR 长池，16:00 左右抵达会场；烟火散场后回京都住宿。", pointIds: ["uji-river", "joyo", "kyoto-stay"], mode: "transit" },
    ],
  },
  {
    id: "10.05", date: "2026-10-05", dayNumber: 7, shortLabel: "10.05", filterLabel: "10月5日", weekday: "周一", areaLabel: "贵船", title: "贵船神社三社",
    segments: [
      { id: "kyoto-to-kifune", label: "住宿 → 贵船", note: "从京都住宿搭铁路与巴士前往贵船；跨区域段不画地图箭头。", pointIds: ["kyoto-stay", "kifune"], mode: "transit" },
      { id: "kifune-shrines", label: "贵船神社三社", note: "贵船神社不可删除；晴雨都走本宫、奥宫、结社，鞍马翻山仅作现场加码。", pointIds: ["kifune", "kifune-okumiya", "kifune-yui"], mode: "walking", drawOnMap: true },
      { id: "kifune-to-kyoto", label: "贵船 → 返回住宿", note: "午餐和河畔休息后原路返回京都住宿。", pointIds: ["kifune-yui", "kyoto-stay"], mode: "transit" },
    ],
  },
  {
    id: "10.06", date: "2026-10-06", dayNumber: 8, shortLabel: "10.06", filterLabel: "10月6日", weekday: "周二", areaLabel: "伏见·奈良·大阪", title: "伏见稻荷与奈良后回大阪",
    segments: [
      { id: "kyoto-to-fushimi", label: "京都退房 → 伏见", note: "大箱已于 10 月 4 日由京都酒店直送大阪酒店；08:05 只背两晚分装包退房。", pointIds: ["kyoto-stay", "fushimi-inari"], mode: "transit" },
      { id: "fushimi-to-nara", label: "伏见 → 奈良", note: "伏见只走到奥社奉拜所、不登稻荷山，随后沿 JR 奈良线继续南下。", pointIds: ["fushimi-inari", "todaiji"], mode: "transit" },
      { id: "nara-core", label: "奈良公园 · 只留核心", note: "东大寺、二月堂、林间午餐和春日大社连续步行；结束后坐巴士回近铁奈良站。", pointIds: ["todaiji", "nigatsudo", "mizuya", "kasuga"], mode: "walking", drawOnMap: true },
      { id: "nara-to-osaka", label: "奈良 → 大阪住宿", note: "傍晚返回大阪并入住，移动日从京都住宿开始、以大阪住宿结束。", pointIds: ["kasuga", "osaka-stay"], mode: "transit" },
    ],
  },
  {
    id: "10.07", date: "2026-10-07", dayNumber: 9, shortLabel: "10.07", filterLabel: "10月7日", weekday: "周三", areaLabel: "返沪", title: "难波前往关西机场",
    segments: [
      { id: "osaka-to-kix", label: "住宿 → 关西机场", note: "从大阪住宿出发，约 09:00 抵达关西机场。", pointIds: ["osaka-stay", "kix"], mode: "transit" },
    ],
  },
];
