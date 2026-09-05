import type { HomeItineraryDay, TransitLeg } from "@/app/guide-core/types";
import { kansaiDays } from "../../days";
import { kansaiHome } from "../../home";
import { kansaiMap, kansaiPlaces } from "../../places";
import { kansaiTransitLegs } from "../../transit";
import { addPlanOneVisitGuides } from "./visits";

// Plan 2 still imports the historical base. Apply researched revisions only here.
const checkedAt = "2026-09-06";
const eizan = "https://eizandensha.co.jp/information/?di=20";
const busOut = "https://www.kyotobus.jp/route/timetable/schedule.html?stop_id=6293_1";
const busBack = "https://www.kyotobus.jp/route/timetable/schedule.html?stop_id=6292_1";
const jrRevision = "https://www.westjr.co.jp/press/article/2025/12/12/items/251212_00_press_daiyakaisei2026.pdf";
function yahoo(from: string, to: string, date: string, time: string) {
  const [y, m, d] = date.split("-");
  const [hh, mm] = time.split(":");
  return `https://transit.yahoo.co.jp/search/result?${new URLSearchParams({ from, to, y, m, d, hh, m1: mm[0], m2: mm[1], type: "1", ticket: "ic", s: "0", shin: "1", ex: "1", al: "1", hb: "1", lb: "1", sr: "1", expkind: "1", ws: "3" })}`;
}
const aggregate = (note: string): NonNullable<TransitLeg["verification"]> => ({ checkedAt, basis: "聚合查询", note });
const patches: Record<string, Partial<TransitLeg>> = {
  "09.30:osaka-stay>usj": {
    verification: aggregate("按 9/30 日本时间查询：06:46→06:54、07:05→07:11 有结果；酒店步行与 4 分钟到闸口仍是估算。完整首班链本轮未重核，前一晚复核。"),
  },
  "10.02:nunobiki>kitano": {
    fallback: "出发前缆车停运就跳过香草园，从新神户直接步行或打车去北野；若已在山上才停运，听从工作人员疏散安排，不自行硬走山路。",
  },
  "10.03:osaka-stay>kyoto-stay": {
    stayPlan: "目标 09:45 到前台，交箱约 15–20 分钟，争取 10:05 离开；若 10:00 才到就顺延 JR，不压缩交箱时间。",
    serviceBoundary: { label: "班次参考", detail: "酒店地址未定，路程约 75–90 分钟。10:05 交箱完成是目标而非保证；晚到改下一班 JR，先缩短渡月桥停留。" },
  },
  "10.04:kyoto-stay>philosopher": {
    stayPlan: "09:45 从北端开始运河慢行；约 70 分钟体验计入下一段步行，不在北端额外停留 70 分钟。",
    verification: { checkedAt, basis: "规划估算", note: "09:00 巴士是出发目标，不是本轮已核班次。市区拥堵时先减南禅寺，不缩短哲学之道。" },
    timingStatus: "预计时间",
  },
  "10.04:philosopher>nanzenji": {
    suggestedTime: "09:45 开始运河慢行；10:55 从南端继续前往南禅寺",
    duration: "约 90 分钟：慢行 70 分＋接驳 20 分",
    departurePlan: "哲学之道北端｜09:45 开始体验，约 10:55 到南端",
    arrivalPlan: "运河南端再走约 15–25 分钟｜南禅寺约 11:15",
    displayTimes: { departure: "09:45", arrival: "11:15" },
    stayPlan: "南禅寺境内与水路阁约 30 分钟；11:45 离开，不进收费殿堂。",
    route: "从哲学之道北端沿约 2 km 运河向南慢走约 70 分钟，再从南端经若王子方向走约 20 分钟到南禅寺；合计约 90 分钟，含游览而非全为赶路。",
    fallback: "晚到就取消南禅寺停留，从南端前往蹴上站；步行困难或大雨时改出租车去宇治，保住烟火入场余量。",
  },
  "10.04:nanzenji>byodoin": {
    duration: "约 60 分钟到片区；入园前另留午餐",
    arrivalPlan: "JR 宇治约 12:37｜平等院表参道片区约 12:45；13:20 入园",
    displayTimes: { arrival: "12:45" },
    stayPlan: "先在附近吃午餐 12:45–13:20，再看庭园约 45 分钟，14:05 离开；博物馆仅在有余量时选看。",
    route: "11:45 从南禅寺步行到蹴上站；目标地铁东西线 12:00→六地藏 12:18，换 JR 奈良线 12:29→宇治 12:37，再步行到平等院片区先吃饭。",
    fallback: "赶不上目标地铁，可查约 12:15 出发、12:49 到宇治的后续方案；进一步晚点就缩短平等院／取消茶店等位，不推迟 14:55 往 JR 站走。",
    verification: aggregate("按 10/4 查询的联程；从寺院到车站步行约 15 分钟较紧，须 11:45 离开。酒店、步行及餐食均未锁定。"),
    sources: [{ label: "Yahoo 10/4 蹴上→宇治", href: yahoo("蹴上", "宇治(奈良線)", "2026-10-04", "11:55") }],
  },
  "10.04:byodoin>nakamura-uji": {
    departurePlan: "平等院｜14:05 出发", suggestedTime: "14:05",
    arrivalPlan: "中村藤吉平等院店约 14:10",
    stayPlan: "茶歇约 20–25 分钟；不能迅速入座就外带，14:35 离开。",
    fallback: "无空位就外带或换沿街茶铺，不等长队；14:35 离店，14:55 从河岸往 JR 宇治站走。",
  },
  "10.04:uji-river>joyo": {
    suggestedTime: "14:55 离开河岸；目标 JR 宇治 15:26",
    duration: "约 50–65 分钟，含步行、候车与入场",
    verification: aggregate("10/4 查询有宇治 15:26→长池 15:37；后续 15:58→16:09，不能再承诺 16:00 到会场。入场排队另计。"),
  },
  "10.04:joyo>kyoto-stay": {
    duration: "约 1 小时 45 分–1 小时 55 分，含疏散候车",
    route: "19:50 起随人流离场，步行到 JR 长池；平时步行 5 分钟不含疏散与限流。目标 JR 奈良线 20:50→京都 21:23，再步行至酒店。",
    fallback: "错过 20:50 时，聚合查询后续为 21:18→21:53 京都，酒店约 22:05–22:15（估算）；再下一班 21:49→22:25。现场限流或停运时听从引导，确认仍有完整铁路衔接；无安全联程则从可接车地点打车回京都，不在会场出口盲等。",
    stayPlan: "目标约 21:35–21:45 到店；若改乘后续班次会晚于 22:00，次日仍不加早起。",
    verification: aggregate("10/4 的 20:50→21:23 与后续两班已在 Yahoo 交叉查询；不是运营商保证，也不是末班核验。人群放行速度决定能否上车。"),
    serviceBoundary: { label: "最晚班次", detail: "20:50 是计划安全目标，不是线路末班。后续 21:18 / 21:49 为聚合查询备选；实际最晚完整返店方案本轮未重新核定，勿据此拖到末班。" },
    sources: [{ label: "城阳市烟火交通公告", href: "https://www.city.joyo.kyoto.jp/joint/0000012600.html" }, { label: "Yahoo 10/4 长池→京都", href: yahoo("長池", "京都", "2026-10-04", "20:40") }],
  },
  "10.05:kyoto-stay>kifune": {
    suggestedTime: "09:00 离店；目标出町柳 10:00 鞍马方向",
    duration: "约 2 小时–2 小时 15 分，含多次接驳",
    departurePlan: "京都酒店｜09:00 出发；目标 09:45–09:50 到出町柳站",
    arrivalPlan: "出町柳 10:00 → 贵船口 10:28；候车与巴士接驳后，本宫约 11:00–11:15",
    displayTimes: { departure: "09:00", arrival: "11:00–11:15" },
    route: "京都酒店→JR 京都站→奈良线东福寺→京阪本线出町柳→叡山电车鞍马方向 10:00 发、贵船口 10:28 到→京都巴士 33 路→步行本宫。前两段为估算，换乘各留约 10 分钟；若接驳不顺，改下一班并压缩饭后休息。",
    stayPlan: "本宫参拜、御守与休息约 45–60 分钟；12:00 前往奥宫。",
    serviceBoundary: { label: "班次参考", detail: "叡山 2026/8/22 起平日表：鞍马方向 10:00→贵船口 10:28。原 09:52 开往八瀬比叡山口，不可乘作贵船直达车。33 路 10/5 适用班次待核，暂按 10:30–11:00 接驳范围留缓冲，不承诺 10:32 能上车。" },
    fallback: "晚到出町柳就改下一班鞍马方向，缩短饭后休息而非强赶巴士；33 路停运时先确认贵船道路和出租车可用，不默认步行山区公路。叡山 / 山区道路封闭时遵从官方管制，不能以必去为由冒险。",
    verification: { checkedAt, basis: "官方核实", pending: "仅叡山列车已核；33 路巴士 10/5 班次待确认，已留接驳缓冲。", note: "仅叡山 10:00→10:28 经运营商平日 PDF 核实；酒店→出町柳与巴士未逐段核实，因此整段仍为部分核实，不是完整已核联程。" },
    sources: [{ label: "叡山官方平日表（8/22 改正）", href: eizan }, { label: "33 路贵船口出发", href: busOut }],
  },
  "10.05:kifune>kifune-okumiya": {
    suggestedTime: "12:00", departurePlan: "贵船神社本宫｜12:00 出发", arrivalPlan: "奥宫约 12:25",
    stayPlan: "奥宫参拜约 35 分钟；13:00 返回结社方向。",
  },
  "10.05:kifune-okumiya>kifune-yui": {
    duration: "约 15 分钟，含慢行余量",
    suggestedTime: "13:00", departurePlan: "贵船神社奥宫｜13:00 出发", arrivalPlan: "结社约 13:15",
    stayPlan: "结社参拜约 20 分钟；13:35 起在周边午餐与休息，15:20 前往巴士站。",
  },
  "10.05:kifune-yui>kyoto-stay": {
    duration: "约 1 小时 40 分–2 小时 10 分，含候车换乘",
    suggestedTime: "15:20 去巴士站；15:25–15:30 到站候车",
    departurePlan: "结社周边｜15:20 去站，15:25–15:30 到站；暂以 15:37 巴士为目标",
    arrivalPlan: "巴士回贵船口后换叡山、京阪、JR｜京都酒店约 17:00–17:30",
    displayTimes: { departure: "15:20", arrival: "17:00–17:30" },
    stayPlan: "回店休息不追加景点；17:35 现行末班仅是待复核边界，不作为目标。",
    serviceBoundary: { label: "最晚班次", detail: "官方现行平日表搜索结果有 15:37 返程与 17:35 末班，但尚未确认该表覆盖 10/5。15 点多主动离山，出行前重查当日表，不拖到末班。" },
    fallback: "错过目标巴士先查仍有效的后续班次；停运则确认道路开放后联系出租车，山中可能久候。不默认走 2.1 km 山区公路，只有路况、天气、光线与体力均允许时才考虑步行到贵船口。",
    verification: { checkedAt, basis: "待确认", note: "回程巴士仅取得现行平日表信息，未取得 10/5 适用结果；返酒店整段估算约 1 小时 40 分–2 小时 10 分。" },
    sources: [{ label: "33 路贵船返程时刻", href: busBack }, { label: "叡山官方时刻", href: eizan }],
  },
  "10.06:kyoto-stay>fushimi-inari": {
    route: "目标 JR 奈良线普通 08:26 京都→08:32 稻荷，出站即到神社。上车前确认方向与该车停靠站，不再用‘快速一律不停稻荷’判断。",
    serviceBoundary: { label: "班次参考", detail: "沿用 08:26 普通列车、08:32 到稻荷的方案，本轮未重核该班；出行前在 JR 官方页面确认。2026 调图后部分快速已增停稻荷。" },
  },
  "10.06:fushimi-inari>todaiji": {
    duration: "约 2 小时 5 分，含候车与奈良端接驳",
    route: "10:00 从伏见短线返回 JR 稻荷站，目标 10:32 奈良线普通车→奈良 11:40，再搭奈良交通巴士到东大寺片区，约 12:05 先吃午餐。2026/3/14 起宫古路快速等新增停靠稻荷，不再沿用‘所有快速不停稻荷’的旧判断。",
    stayPlan: "12:05–12:40 在片区先吃简餐；12:40–14:00 看南大门与大佛殿。餐厅未定，不为热门店排队。",
    serviceBoundary: { label: "班次参考", detail: "本次仍以 10:32 普通车→11:40 奈良为主；Yahoo 另有 10:39 宫古路快速→11:21 奈良，但出发前需确认站台、方向和实际运行，不以改快速为必需条件。" },
    verification: aggregate("10/6 普通车与快速候选都返回有效结果；新增停靠稻荷另有 JR 官方 2026 调图公告。奈良站后巴士及用餐是估算。"),
    sources: [{ label: "JR 西日本 2026 调图公告", href: jrRevision }, { label: "Yahoo 10/6 稻荷→奈良", href: yahoo("稲荷", "奈良", "2026-10-06", "10:20") }],
  },
  "10.06:todaiji>nigatsudo": {
    suggestedTime: "14:00", departurePlan: "东大寺大佛殿｜14:00 出发", arrivalPlan: "二月堂约 14:15", stayPlan: "眺望与休息约 25 分钟；14:40 离开。",
  },
  "10.06:nigatsudo>mizuya": {
    suggestedTime: "14:40", departurePlan: "二月堂｜14:40 出发", arrivalPlan: "水谷茶屋约 15:00", stayPlan: "可选茶歇约 20 分钟；这里不再承担午餐，排队就跳过。",
    fallback: "茶屋休息或排队就取消茶歇，补水、短休后直接走向春日大社，不折返车站重新找餐厅。",
  },
  "10.06:mizuya>kasuga": {
    suggestedTime: "15:20", departurePlan: "水谷茶屋｜15:20 出发", arrivalPlan: "春日大社约 15:35", stayPlan: "一般参拜与林间参道约 45 分钟；16:20 离开，不安排 16:00 结束的特别参拜。",
  },
  "10.06:kasuga>osaka-stay": {
    suggestedTime: "16:20 离开；目标近铁奈良 17:12",
    departurePlan: "春日大社｜16:20 前往巴士站；目标近铁奈良 17:12 快速急行",
    duration: "约 1 小时 45 分–2 小时 5 分，含候车、铁路和到店",
    serviceBoundary: { label: "最晚班次", detail: "16:20 离开神社，目标近铁奈良 17:12→大阪难波 17:49 为聚合查询结果，非末班。若巴士拥堵先改打车；下一班候选 17:21→18:02。完整末班链本轮未重核，不拖到末班。" },
    verification: aggregate("10/6 近铁 17:12→17:49 有结果；后续 17:21→18:02 可作候选。景点到站巴士和酒店入口未确定，保留转乘余量。"),
  },
  "10.07:osaka-stay>kix": {
    suggestedTime: "心斋桥 07:25 / 难波 07:40 离店；目标 08:00 南海",
    verification: aggregate("查询使用南海难波站而非大阪难波：10/7 Rapi:t 08:00→08:39；空港急行 08:02→08:49。酒店步行及航站楼移动仍为估算。"),
  },
};

export const planOneTransitLegs: TransitLeg[] = kansaiTransitLegs.map((leg) => ({
  ...leg,
  verification: {
    checkedAt,
    basis: leg.kind === "步行" ? "规划估算" : "待确认",
    note: leg.kind === "步行" ? "按片区、停留和体力预算排程，非现场测距；拥堵、台阶、天气及酒店入口会改变耗时。" : "沿用原方案及其来源入口；本轮未重新核完整班次 / 首末班链。请以运营商出行日公告复核，不能视为刚刚验证成功。",
  },
  ...patches[leg.id],
}));

export const planOneDays = addPlanOneVisitGuides(kansaiDays.map((day) => ({
  ...day,
  segments: day.segments.map((segment) => ({ ...segment, ...({
    "higashiyama-walk": { note: "哲学之道约 70 分钟，再走约 20 分钟到南禅寺；寺院只留境内与水路阁约 30 分钟。" },
    "uji-core": { note: "先在平等院片区午餐，再看庭园；茶歇和河岸可缩短，凤凰堂内部不安排。" },
    "nara-core": { note: "先在东大寺片区吃午餐，再看大佛殿、二月堂与春日大社；水谷茶屋改为可选茶歇。" },
  } as Record<string, { note: string }>)[segment.id] })),
})));

const pointPatches: Record<string, { meta: string; fit?: string }> = {
  nanzenji: { meta: "约 11:15–11:45 · 境内 / 水路阁", fit: "哲学之道南端还需步行约 20 分钟；压缩为免费境内短走，不进付费殿堂。" },
  byodoin: { meta: "13:20–14:05 · 午餐后看庭园" },
  "nakamura-uji": { meta: "14:10–14:35 · 可选茶歇" },
  kifune: { meta: "必保留 · 约 11:00–12:00", fit: "目标出町柳 10:00 鞍马方向到贵船口 10:28；巴士班次待核，普通雨天保留参拜。" },
  "kifune-okumiya": { meta: "约 12:25–13:00 · 林间参拜" },
  "kifune-yui": { meta: "约 13:15–13:35 · 之后午餐" },
  todaiji: { meta: "先吃午餐 · 大佛殿 12:40–14:00" },
  nigatsudo: { meta: "14:15–14:40 · 眺望休息" },
  mizuya: { meta: "15:00–15:20 · 可选茶歇", fit: "10.06 午餐已前置到东大寺片区；水谷茶屋只作茶歇候选，不等位。" },
  kasuga: { meta: "15:35–16:20 · 一般参拜" },
};
export const planOnePlaces = kansaiPlaces.map((place) => ({ ...place, ...pointPatches[place.id] }));

const homePatches: Record<string, Partial<HomeItineraryDay>> = {
  "10.01": { note: "三个核心之后的新世界、电电城和小吃均可取消。慶泽园有 9 月池塘检修公告，出行前检查是否恢复；累了 15:30 收尾，约 16:00–16:15 回店。", transit: "核心约 3–4 km，全部走完约 5–7 km（估算）；余下街区是可选尾段，不需每站完成。" },
  "10.03": { note: "先完成酒店交箱，10:05 只是目标；晚到改后续 JR、压缩河岸。18:30 正餐是候选开餐安排，需要确认 3 人预约，不代表已经订到。" },
  "10.04": { schedule: "08:50 离店 · 09:45–10:55 哲学之道 · 11:15–11:45 南禅寺 · 12:45 午餐 · 13:20–14:05 平等院 · 15:26 JR · 16:00 会场 · 19:00–19:40 烟火 · 21:35–21:45 目标回店", note: "补回运河南端到南禅寺约 20 分钟接驳，以缩短寺院内部游览来换取；哲学之道完整保留。宇治先吃午餐，不排凤凰堂内部。散场错过 20:50 时查后续 21:18，酒店可能到 22:05–22:15，不能保证 22:00 前到店。" },
  "10.05": { schedule: "09:00 离店 · 10:00–10:28 叡山鞍马方向 · 巴士班次待核 · 11:00–13:35 三社 · 午餐休息 · 15:20 去站 · 17:00–17:30 目标回店", note: "修正原 09:52 的错误支线：改乘 10:00 鞍马方向，不增加早起。候车晚了先缩短饭后休息，三社保留，不追加翻山。", transit: "JR＋京阪到出町柳；叡山 10:00→10:28 已核官方平日表。33 路仅按现行表暂排，15:37 返程和 17:35 末班是否适用 10/5 仍待核。" },
  "10.06": { route: "京都退房 → 伏见稻荷短线 → 东大寺片区午餐 → 大佛殿 → 二月堂 → 可选茶歇 → 春日大社一般参拜 → 大阪住宿", schedule: "08:05 退房 · 08:35–10:00 伏见 · 10:32–11:40 JR · 12:05 午餐 · 12:40–14:00 东大寺 · 15:35–16:20 春日大社 · 17:12 近铁 · 18:05–18:25 入住大阪", note: "把 14:35 晚午餐前移至 12:05，水谷茶屋改为可选茶歇；春日大社不安排 16:00 结束的特别参拜。大箱已酒店直送，仍不使用车站寄存柜。" },
};
export const planOneHome = { ...kansaiHome, itinerary: { ...kansaiHome.itinerary, items: kansaiHome.itinerary.items.map((item) => ({ ...item, ...homePatches[item.date] })) } };
export const planOneMap = { ...kansaiMap, transitAuditNote: "2026-09-06 复盘：所有时间按日本当地时间。叡山鞍马方向列车已核官方平日表；部分长途联程用 Yahoo 按旅行日交叉查询，聚合结果不等同运营商核实。其余班次和完整首末班链明确标待复核；酒店未确定，首尾接驳始终为估算。展开每段卡片可看具体核查范围与来源。" };
