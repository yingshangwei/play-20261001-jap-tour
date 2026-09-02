type TransitLegBase = {
  kind: "步行" | "铁路" | "铁路＋巴士" | "缆车＋步行";
  suggestedTime: string;
  duration: string;
  route: string;
  serviceBoundary?: {
    label: "最早班次" | "最晚班次" | "班次参考";
    detail: string;
  };
  fallback: string;
  sources?: Array<{ label: string; href: string }>;
};

type TransitTiming = {
  departurePlan: string;
  arrivalPlan: string;
  stayPlan: string;
  timingStatus: "已核班次" | "部分核实" | "预计时间";
};

export type TransitLeg = TransitLegBase & TransitTiming;

const NANKAI_TIMETABLE = "https://www.nankai.co.jp/cn_railway/access-timetable/";
const HANSHIN_NAMBA = "https://eki.kintetsu.co.jp/norikae/T5?USR=IM&slCode=350-0&d=2&dw=0&time=0900";
const JR_USJ_OUTBOUND = "https://timetable.jr-odekake.net/station-timetable/2836020001?date=20260930";
const JR_USJ_RETURN = "https://timetable.jr-odekake.net/station-timetable/2957020002?date=20260930";
const USJ_HOURS = "https://www.usj.co.jp/web/zh/tw/park-guide/schedule/park-hour2";
const NUNOBIKI_HOURS = "https://www.kobeherb.com/en/hours-of-operation-and-fares/";
const KOBE_SUBWAY_SANNOMIYA = "https://kotsu.city.kobe.lg.jp/subway/timetable1/sannomiya/";
const JR_KOBE = "https://timetable.jr-odekake.net/station-timetable/2809012001?date=20261002";
const OSAKA_METRO_UMEDA = "https://subway.osakametro.co.jp/station_guide/M/m16/index.php";
const JR_SAGA_ARASHIYAMA = "https://timetable.jr-odekake.net/train-timetable/5471?date=20261003";
const MAEKAWA_ACCESS = "https://ryouriya-maekawa.com/access.html";
const KYOTO_BUS_7 = "https://www2.city.kyoto.lg.jp/kotsu/busdia/hyperdia/06121202.htm";
const KYOTO_SUBWAY = "https://www2.city.kyoto.lg.jp/kotsu/tikadia/hyperdia/menu0221.htm";
const JR_UJI = "https://timetable.jr-odekake.net/station-timetable/3017064002?date=20261004";
const JOYO_EVENT = "https://www.city.joyo.kyoto.jp/joint/0000012600.html";
const JR_NAGAIKE = "https://timetable.jr-odekake.net/station-timetable/3014064001?date=20261004";
const KIFUNE_BUS_OUTBOUND = "https://www.kyotobus.jp/route/timetable/schedule.html?stop_id=6293_1";
const KIFUNE_BUS_RETURN = "https://www.kyotobus.jp/route/timetable/schedule.html?stop_id=6292_1";
const EIZAN_WEEKDAY_2026 = "https://eizandensha.co.jp/information/?di=20";
const JR_KYOTO_INARI = "https://timetable.jr-odekake.net/train-timetable/12201?date=20261006";
const JR_INARI_NARA = "https://timetable.jr-odekake.net/train-timetable/46111?date=20261006";
const NARA_BUS_NOTICE = "https://www.narakotsu.co.jp/news/general/33910/";
const KINTETSU_NARA = "https://eki.kintetsu.co.jp/norikae/T5?USR=IM&slCode=350-23&d=1&dw=0&time=1700";

function key(date: string, from: string, to: string) {
  return `${date}:${from}>${to}`;
}

export const transitLegs: Record<string, TransitLegBase> = {
  [key("09.29", "kix", "osaka-stay")]: {
    kind: "铁路",
    suggestedTime: "15:20–16:00（出关取行李后）",
    duration: "34–55 分钟＋到酒店步行",
    route: "南海电铁：关西机场站 → 难波站。优先 Rapi:t；衔接不上就坐空港急行，均可直达难波。",
    fallback: "南海停运时改 JR 关空快速到新今宫／天王寺后换乘；大范围停运则搭机场巴士到 OCAT，最后一段打车。",
    sources: [{ label: "南海机场线官方时刻", href: NANKAI_TIMETABLE }],
  },
  [key("09.29", "osaka-stay", "shinsaibashi")]: {
    kind: "步行", suggestedTime: "17:50", duration: "约 10–15 分钟（酒店未定，估算）",
    route: "沿御堂筋或心斋桥筋向北步行，以实际酒店入口重新定位。",
    fallback: "下雨、行李未放妥或体力不足时坐出租车，约 5–10 分钟。",
  },
  [key("09.29", "shinsaibashi", "dotonbori")]: {
    kind: "步行", suggestedTime: "19:00 前后", duration: "约 12–15 分钟",
    route: "沿心斋桥筋商店街一路向南，到戎桥／道顿堀川。",
    fallback: "商店街拥挤时改走御堂筋；雨大可从心斋桥站坐大阪 Metro 御堂筋线 1 站到难波。",
  },
  [key("09.29", "dotonbori", "hozenji")]: {
    kind: "步行", suggestedTime: "20:30 前后", duration: "约 5–8 分钟",
    route: "从道顿堀向南穿过千日前，步行进入法善寺横丁。",
    fallback: "人流过密时直接跳过横丁回酒店，不为短距离乘车。",
  },
  [key("09.29", "hozenji", "osaka-stay")]: {
    kind: "步行", suggestedTime: "21:05 前后", duration: "约 5–10 分钟（酒店未定，估算）",
    route: "步行返回难波／心斋桥住宿，形成抵达日闭环。",
    fallback: "若酒店在心斋桥北侧或已经很累，法善寺口直接打车回店。",
  },

  [key("09.30", "osaka-stay", "usj")]: {
    kind: "铁路",
    suggestedTime: "06:30 离店；目标大阪难波 06:46",
    duration: "约 41–45 分钟到园区闸口",
    route: "阪神难波线 06:46 大阪难波 → 06:54 西九条；换 JR 梦咲线 07:05 西九条 → 07:11 环球城，步行约 4 分钟到园区闸口。",
    serviceBoundary: { label: "班次参考", detail: "9/30 官方营业时间为 08:00–22:00，且 USJ 提醒可能早于标示时间开园；计划 07:15 左右排队。" },
    fallback: "阪神异常时坐大阪 Metro 千日前线到玉川，步行到 JR 野田换大阪环状线／梦咲线；全面停运则酒店直达出租车。",
    sources: [
      { label: "阪神大阪难波站", href: HANSHIN_NAMBA },
      { label: "JR 西九条 9/30 时刻", href: JR_USJ_OUTBOUND },
      { label: "USJ 9/30 营业时间", href: USJ_HOURS },
    ],
  },
  [key("09.30", "usj", "osaka-stay")]: {
    kind: "铁路",
    suggestedTime: "22:05–22:10 离开闸口；目标 22:12／22:20 JR",
    duration: "约 30–45 分钟",
    route: "JR 梦咲线：环球城 → 西九条；换阪神难波线到大阪难波，再步行回酒店。",
    serviceBoundary: { label: "最晚班次", detail: "建议把 23:12 作为能从容完成返难波换乘的最晚目标。JR 另有 23:37、00:02 从环球城开出，但后段可能只能从西九条打车。" },
    fallback: "错过阪神末班后，先搭还能开的 JR 到西九条，再打车回难波；连 JR 也错过则从 USJ 直接打车。",
    sources: [
      { label: "JR 环球城 9/30 时刻", href: JR_USJ_RETURN },
      { label: "阪神大阪难波站", href: HANSHIN_NAMBA },
      { label: "USJ 9/30 营业时间", href: USJ_HOURS },
    ],
  },

  [key("10.01", "osaka-stay", "kuromon")]: {
    kind: "步行", suggestedTime: "10:30", duration: "约 10–15 分钟（酒店未定，估算）",
    route: "从难波／心斋桥住宿步行到黑门市场西侧入口。",
    fallback: "酒店若在心斋桥北侧，坐大阪 Metro 千日前线到日本桥，或直接打车。",
  },
  [key("10.01", "kuromon", "shitennoji")]: {
    kind: "步行", suggestedTime: "12:00–12:20", duration: "约 22–28 分钟",
    route: "由黑门市场向东南，经日本桥与谷町筋方向步行到四天王寺。",
    fallback: "炎热或下雨时，从日本桥坐大阪 Metro 千日前线到谷町九丁目，换谷町线到四天王寺前夕阳丘。",
  },
  [key("10.01", "shitennoji", "tennoji-park")]: {
    kind: "步行", suggestedTime: "14:10 前后", duration: "约 12–15 分钟",
    route: "从四天王寺西门沿逢阪方向向南，步行进入天王寺公园／慶泽园。",
    fallback: "体力不足时在四天王寺前夕阳丘站坐谷町线 1 站到天王寺。",
  },
  [key("10.01", "tennoji-park", "shinsekai")]: {
    kind: "步行", suggestedTime: "15:30 前后", duration: "约 8–10 分钟",
    route: "穿过天王寺公园向西，到通天阁与新世界商店街。",
    fallback: "慶泽园停留过久时可直接跳过新世界，坐御堂筋线从动物园前回难波。",
  },
  [key("10.01", "shinsekai", "den-den-town")]: {
    kind: "步行", suggestedTime: "16:40 前后", duration: "约 12–15 分钟",
    route: "从通天阁北行，经堺筋进入日本桥电电城。",
    fallback: "累了就在惠美须町站坐大阪 Metro 堺筋线到日本桥，结束当天行程。",
  },
  [key("10.01", "den-den-town", "wanaka")]: {
    kind: "步行", suggestedTime: "17:45 前后", duration: "约 12–15 分钟",
    route: "沿堺筋／难波千日前向西北，步行到わなか千日前本店。",
    fallback: "商店关门晚、时间被拖长时取消小吃，直接步行或打车回酒店。",
  },
  [key("10.01", "wanaka", "osaka-stay")]: {
    kind: "步行", suggestedTime: "18:30–19:00", duration: "约 5–10 分钟（酒店未定，估算）",
    route: "从千日前步行返回难波／心斋桥住宿。",
    fallback: "若酒店在心斋桥北侧且当天已超步数，打车回店。",
  },

  [key("10.02", "osaka-stay", "nunobiki")]: {
    kind: "铁路",
    suggestedTime: "09:30 离店；目标大阪难波 09:52",
    duration: "约 75–90 分钟",
    route: "阪神快速急行 09:52 大阪难波 → 10:42 神户三宫；步行换乘神户市营地铁，约 10:54 三宫 → 10:56 新神户，再步行约 7 分钟到缆车站。",
    serviceBoundary: { label: "班次参考", detail: "直达快速急行已核到分钟；地铁班次密集。布引缆车和香草园此时均已开放，约 11:05 到下站即可。" },
    fallback: "阪神异常时从大阪站坐 JR 神户线新快速到三之宫，再换地铁；布引缆车因风停运则直接步行去北野。",
    sources: [
      { label: "阪神大阪难波站", href: HANSHIN_NAMBA },
      { label: "神户地铁三宫时刻", href: KOBE_SUBWAY_SANNOMIYA },
      { label: "布引缆车营业时间", href: NUNOBIKI_HOURS },
    ],
  },
  [key("10.02", "nunobiki", "kitano")]: {
    kind: "缆车＋步行", suggestedTime: "12:45–13:00", duration: "约 25–35 分钟",
    route: "从山顶／中间站搭布引缆车下到新神户，再沿北野通步行约 12–15 分钟到异人馆街。",
    serviceBoundary: { label: "班次参考", detail: "10 月平日缆车 09:30 开；通常末班上行 16:45、下行 17:15。当天中午下山不受末班压力。" },
    fallback: "缆车临时停运时不要徒步硬下山；按既定规则跳过香草园，从新神户直接步行或打车到北野。",
    sources: [{ label: "布引缆车营业时间", href: NUNOBIKI_HOURS }],
  },
  [key("10.02", "kitano", "mouriya")]: {
    kind: "步行", suggestedTime: "13:45", duration: "约 15–20 分钟",
    route: "沿北野坂顺坡下行到三宫，前往 Mouriya 本店预约午餐。",
    fallback: "穿正式鞋、不便走坡路或遇大雨时，从北野打车到餐厅约 5–10 分钟。",
  },
  [key("10.02", "mouriya", "meriken")]: {
    kind: "步行", suggestedTime: "15:30", duration: "约 22–30 分钟",
    route: "餐后经旧居留地向南步行到美利坚公园，沿途本身就是城市散步段。",
    fallback: "午餐结束晚于 15:30 时，从三宫／餐厅直接打车到美利坚公园，保住港区日落。",
  },
  [key("10.02", "meriken", "harborland")]: {
    kind: "步行", suggestedTime: "17:45", duration: "约 12–15 分钟",
    route: "沿海港步道向西，经过 Mosaic 前往 Harborland。",
    fallback: "大风或暴雨时在 Meriken Park Oriental Hotel 一带打车到 Harborland／JR 神户站。",
  },
  [key("10.02", "harborland", "osaka-stay")]: {
    kind: "铁路",
    suggestedTime: "19:15–19:30 出发",
    duration: "约 55–70 分钟",
    route: "步行到 JR 神户站，搭 JR 神户线新快速到大阪；步行到梅田站，换大阪 Metro 御堂筋线到难波。",
    serviceBoundary: { label: "最晚班次", detail: "JR 神户往大阪末班约 00:05，但梅田往难波地铁末班约 00:08，无法衔接。完整公共交通建议最晚约 23:00 从神户出发。" },
    fallback: "过了地铁衔接点，仍可先搭 JR 到大阪站再打车回难波；JR 也停运后只能神户直达出租车／改住神户。",
    sources: [
      { label: "JR 神户站 10/2 时刻", href: JR_KOBE },
      { label: "大阪 Metro 梅田站", href: OSAKA_METRO_UMEDA },
    ],
  },

  [key("10.03", "osaka-stay", "arashiyama-bamboo")]: {
    kind: "铁路",
    suggestedTime: "07:50 退房",
    duration: "约 75–90 分钟",
    route: "大阪 Metro 御堂筋线：难波 → 梅田；步行到阪急大阪梅田，搭京都线特急到桂，换阪急岚山线到岚山，再步行 15–20 分钟到竹林。",
    serviceBoundary: { label: "最早班次", detail: "按难波区域估算，约 05:15 起可组成完整换乘；酒店地址确定后再核对首个可衔接班次。" },
    fallback: "阪急异常时改 JR：大阪 → 京都 → 嵯峨岚山；若大件行李未成功前送，先寄存在阪急岚山／JR 嵯峨岚山站。",
  },
  [key("10.03", "arashiyama-bamboo", "tenryuji")]: {
    kind: "步行", suggestedTime: "10:10", duration: "约 5–8 分钟",
    route: "从竹林主路经天龙寺北门进入庭园，避免绕回岚山大街。",
    fallback: "北门临时关闭时沿竹林小径回长辻通，从天龙寺正门进入。",
  },
  [key("10.03", "tenryuji", "togetsukyo")]: {
    kind: "步行", suggestedTime: "11:45", duration: "约 10–12 分钟",
    route: "从天龙寺正门沿长辻通向南到渡月桥与桂川河岸。",
    fallback: "雨大或人流太密时在天龙寺门口打车到 JR 嵯峨岚山，直接结束岚山段。",
  },
  [key("10.03", "togetsukyo", "kyoto-stay")]: {
    kind: "铁路",
    suggestedTime: "14:00 离开河岸；目标 14:31 JR",
    duration: "约 35–45 分钟",
    route: "步行 12–15 分钟到 JR 嵯峨岚山，搭 JR 嵯峨野线直达京都站，再步行到酒店。",
    serviceBoundary: { label: "班次参考", detail: "10/3 优先搭 14:31 JR 嵯峨岚山 → 14:49 京都；若提前到站可搭 14:17 → 14:34。" },
    fallback: "JR 异常时从阪急岚山到桂换京都线至乌丸，再换京都地铁乌丸线到京都站。",
    sources: [{ label: "JR 嵯峨岚山 10/3 时刻", href: JR_SAGA_ARASHIYAMA }],
  },
  [key("10.03", "kyoto-stay", "maekawa")]: {
    kind: "铁路", suggestedTime: "17:45–18:00", duration: "约 25–35 分钟",
    route: "JR 奈良线：京都 → 东福寺；换京阪本线：东福寺 → 清水五条；步行约 10 分钟到料理屋まえかわ。",
    serviceBoundary: { label: "班次参考", detail: "晚餐 18:30 开始，至少预留 15 分钟机动；去程不要按最后一班规划。" },
    fallback: "穿正式衣鞋或下雨时，从京都站直接打车约 15–25 分钟。",
    sources: [{ label: "餐厅官方交通", href: MAEKAWA_ACCESS }],
  },
  [key("10.03", "maekawa", "kyoto-stay")]: {
    kind: "铁路", suggestedTime: "22:00–22:15", duration: "约 25–35 分钟",
    route: "步行到清水五条，搭京阪本线到东福寺，换 JR 奈良线回京都站。",
    serviceBoundary: { label: "最晚班次", detail: "以完成京阪＋JR 换乘计，约 23:30 前离店较稳妥；这是酒店未定情况下的保守估算，出发前需再查当日末班。" },
    fallback: "错过换乘或餐厅延时，直接从餐厅打车回京都站附近酒店，约 15–25 分钟。",
    sources: [{ label: "餐厅官方交通", href: MAEKAWA_ACCESS }],
  },

  [key("10.04", "kyoto-stay", "philosopher")]: {
    kind: "铁路＋巴士",
    suggestedTime: "08:50 离店",
    duration: "约 45–55 分钟",
    route: "京都站前搭京都市巴士 7 路到银阁寺道，步行约 8–10 分钟到哲学之道北端。",
    serviceBoundary: { label: "班次参考", detail: "10/4 周日，市巴士白天班次可用；酒店地址未定，目标约 09:45 到哲学之道北端。" },
    fallback: "巴士拥挤时搭京都地铁乌丸线到今出川，换 203 路到银阁寺道；若 09:00 后仍未上车，直接从京都站打车。",
    sources: [{ label: "京都市巴士 7 路 10/4", href: KYOTO_BUS_7 }],
  },
  [key("10.04", "philosopher", "nanzenji")]: {
    kind: "步行", suggestedTime: "09:45–10:55", duration: "60–75 分钟（本身就是游览）",
    route: "沿疏水渠从哲学之道北端向南完整步行，再接南禅寺与水路阁。",
    fallback: "脚痛或雨势过大时在中段退出，打车约 10–15 分钟到南禅寺；不要因此压缩后面的宇治和烟火。",
  },
  [key("10.04", "nanzenji", "byodoin")]: {
    kind: "铁路",
    suggestedTime: "11:45 出发",
    duration: "约 50–65 分钟",
    route: "步行到蹴上，搭京都地铁东西线到六地藏；换 JR 奈良线到宇治，再步行约 10 分钟到平等院。",
    serviceBoundary: { label: "班次参考", detail: "白天约 10–15 分钟一班；京都站地铁方向的首末班不构成当天限制。" },
    fallback: "东西线异常时打车到三条，搭京阪本线到中书岛，换京阪宇治线到宇治。",
    sources: [{ label: "京都地铁官方时刻入口", href: KYOTO_SUBWAY }],
  },
  [key("10.04", "byodoin", "nakamura-uji")]: {
    kind: "步行", suggestedTime: "13:55–14:00", duration: "约 3–5 分钟",
    route: "从平等院表门沿表参道步行到中村藤吉平等院店。",
    fallback: "排队超过 20–30 分钟就外带或换沿街茶铺，不推迟 15:15 去长池。",
  },
  [key("10.04", "nakamura-uji", "uji-river")]: {
    kind: "步行", suggestedTime: "14:35", duration: "约 5–10 分钟",
    route: "由平等院表参道向宇治川，步行到朝雾桥一带河岸。",
    fallback: "下雨时缩短为桥边短停；若已晚于 14:45，直接前往 JR 宇治站。",
  },
  [key("10.04", "uji-river", "joyo")]: {
    kind: "铁路",
    suggestedTime: "15:15 离河岸；目标 JR 宇治 15:26",
    duration: "约 25–35 分钟",
    route: "步行 10–15 分钟到 JR 宇治，搭 JR 奈良线普通 15:26，约 15:37 到长池；步行约 5 分钟到烟火会场。",
    serviceBoundary: { label: "班次参考", detail: "不要搭 15:37 终到城阳的车；错过 15:26 时选择下一班明确停靠长池的奈良方向普通列车。" },
    fallback: "JR 中断时从京阪宇治到中书岛，转京阪／近铁到寺田，再搭活动免费接驳巴士；时间紧则宇治直接打车到会场。",
    sources: [
      { label: "JR 宇治 10/4 时刻", href: JR_UJI },
      { label: "城阳烟火交通说明", href: JOYO_EVENT },
    ],
  },
  [key("10.04", "joyo", "kyoto-stay")]: {
    kind: "铁路",
    suggestedTime: "烟火后目标 20:50 从 JR 长池出发",
    duration: "长池 → 京都 33 分钟；约 21:30–22:00 回酒店",
    route: "会场步行约 5 分钟到 JR 长池，搭 JR 奈良线普通：20:50 出发、21:23 到京都；人流顺利可看 20:17，拥挤则改 21:18。",
    serviceBoundary: { label: "最晚班次", detail: "10/4 长池往京都最晚约 23:37。它只是兜底，不应作为计划班次；烟火散场优先排 20:50／21:18。" },
    fallback: "JR 临时停运时搭活动免费接驳巴士到近铁寺田，再走近铁京都线回京都；接驳结束或全面停运则排队打车。",
    sources: [
      { label: "JR 长池 10/4 时刻", href: JR_NAGAIKE },
      { label: "城阳烟火官方交通", href: JOYO_EVENT },
    ],
  },

  [key("10.05", "kyoto-stay", "kifune")]: {
    kind: "铁路＋巴士",
    suggestedTime: "09:00 离店",
    duration: "约 85–100 分钟",
    route: "JR 奈良线：京都 → 东福寺；京阪本线：东福寺 → 出町柳；叡山电车鞍马线到贵船口；换京都巴士 33 路到贵船。",
    serviceBoundary: { label: "班次参考", detail: "目标叡山电车 09:52 出町柳 → 10:21 贵船口，再接 10:32 京都巴士 33 路；现行平日表已核对。" },
    fallback: "33 路满员或停运时，贵船口到本宫约 2.1 公里、步行 30–40 分钟；雨天或带长辈应提前预约出租车。",
    sources: [
      { label: "京都巴士 33 路去程", href: KIFUNE_BUS_OUTBOUND },
      { label: "叡山电车 2026 平日时刻", href: EIZAN_WEEKDAY_2026 },
    ],
  },
  [key("10.05", "kifune", "kifune-okumiya")]: {
    kind: "步行", suggestedTime: "11:30", duration: "约 20–25 分钟",
    route: "从贵船神社本宫沿贵船川缓坡北行到奥宫，机动车多时贴内侧行走。",
    fallback: "雨势很大或行动不便时，在本宫附近预约短程出租车；不要用鞍马翻山替代三社参拜。",
  },
  [key("10.05", "kifune-okumiya", "kifune-yui")]: {
    kind: "步行", suggestedTime: "12:30", duration: "约 10–12 分钟",
    route: "由奥宫沿同一河谷道路南返，顺路到结社，不需要折返。",
    fallback: "路滑时放慢到 15–20 分钟；若天气达到警报级别，先打车回本宫／贵船口。",
  },
  [key("10.05", "kifune-yui", "kyoto-stay")]: {
    kind: "铁路＋巴士",
    suggestedTime: "13:05 午餐；15:20 去站，目标 15:37 巴士",
    duration: "约 90–105 分钟",
    route: "步行到贵船巴士站，搭京都巴士 33 路到贵船口；换叡山电车到出町柳、京阪到东福寺、JR 奈良线到京都。",
    serviceBoundary: { label: "最晚班次", detail: "现行平日 33 路从贵船末班约 17:35；山里最需要盯的是这班巴士，不是后段电车。" },
    fallback: "错过 33 路后步行约 2.1 公里、30–40 分钟到贵船口，或提前预约出租车；山中临时叫车可能等很久。",
    sources: [
      { label: "京都巴士 33 路返程", href: KIFUNE_BUS_RETURN },
      { label: "叡山电车 2026 平日时刻", href: EIZAN_WEEKDAY_2026 },
    ],
  },

  [key("10.06", "kyoto-stay", "fushimi-inari")]: {
    kind: "铁路",
    suggestedTime: "08:05 退房；目标京都站 08:26 JR",
    duration: "约 10–15 分钟＋到站步行",
    route: "JR 奈良线普通 08:26 京都 → 08:32 稻荷，出站即到伏见稻荷大社。不要误上不停稻荷的快速。",
    serviceBoundary: { label: "班次参考", detail: "10/6 计划用 08:26 普通列车，08:32 到稻荷；列车已按 JR 官方时刻核对。" },
    fallback: "JR 异常时从京都坐 JR／地铁到东福寺，再换京阪到伏见稻荷；赶时间则京都站直接打车。",
    sources: [{ label: "JR 京都 10/6 奈良线时刻", href: JR_KYOTO_INARI }],
  },
  [key("10.06", "fushimi-inari", "todaiji")]: {
    kind: "铁路＋巴士",
    suggestedTime: "10:00 离开神社；目标 JR 稻荷 10:32",
    duration: "约 80–95 分钟",
    route: "JR 奈良线普通 10:32 从稻荷出发、11:40 到 JR 奈良；换奈良交通 2／77／97 等往东大寺方向巴士，在东大寺大佛殿・春日大社前一带下车。",
    serviceBoundary: { label: "班次参考", detail: "JR 班次已按 10/6 核对；奈良巴士 10 月观光季改线方案尚未最终发布，需在出发前再次确认站台与线路。" },
    fallback: "奈良巴士改线或拥挤时，从 JR 奈良站打车到东大寺；也可步行约 35–45 分钟，但会增加当天负担。",
    sources: [
      { label: "JR 稻荷 10/6 时刻", href: JR_INARI_NARA },
      { label: "奈良交通 10 月调整预告", href: NARA_BUS_NOTICE },
    ],
  },
  [key("10.06", "todaiji", "nigatsudo")]: {
    kind: "步行", suggestedTime: "13:30", duration: "约 15 分钟",
    route: "从东大寺大佛殿东侧沿寺内参道上行到二月堂。",
    fallback: "膝盖不适时跳过二月堂坡道，直接沿平路前往水谷茶屋／春日大社。",
  },
  [key("10.06", "nigatsudo", "mizuya")]: {
    kind: "步行", suggestedTime: "14:15", duration: "约 15–20 分钟",
    route: "由二月堂沿若草山脚与林间参道南行到水谷茶屋。",
    fallback: "水谷茶屋休息或排队过长时，在春日野园地周边用餐，不折返近铁奈良站。",
  },
  [key("10.06", "mizuya", "kasuga")]: {
    kind: "步行", suggestedTime: "15:35", duration: "约 10–15 分钟",
    route: "沿石灯笼林间参道继续向南进入春日大社。",
    fallback: "脚力不足时缩短春日大社内部参拜，保留返回近铁奈良站的体力。",
  },
  [key("10.06", "kasuga", "osaka-stay")]: {
    kind: "铁路＋巴士",
    suggestedTime: "16:35 离开神社；目标近铁奈良 17:12",
    duration: "约 70–90 分钟",
    route: "从春日大社前搭奈良交通巴士或打车到近铁奈良；搭快速急行 17:12 近铁奈良 → 17:49 大阪难波，再步行入住。",
    serviceBoundary: { label: "最晚班次", detail: "17:12 直达快速急行已核到分钟；实际末班更晚。为稳妥衔接，16:35 离开春日大社，巴士等待过长就改打车。" },
    fallback: "巴士拥挤时打车或步行 25–30 分钟到近铁奈良；近铁异常时改 JR 奈良 → 天王寺／JR 难波。",
    sources: [
      { label: "近铁奈良平日時刻", href: KINTETSU_NARA },
      { label: "奈良交通 10 月调整预告", href: NARA_BUS_NOTICE },
    ],
  },

  [key("10.07", "osaka-stay", "kix")]: {
    kind: "铁路",
    suggestedTime: "难波酒店 07:45–08:00；心斋桥酒店约 07:30",
    duration: "35–50 分钟＋到站步行",
    route: "南海难波站搭 Rapi:t 08:00（约 08:39 到关西机场）或空港急行 08:02（约 08:49 到），目标 09:00 前后进入航站楼。",
    serviceBoundary: { label: "最早班次", detail: "南海难波空港急行首班约 05:15、05:58 到机场；无需赶首班，但不要晚于计划窗口。" },
    fallback: "南海异常时从新今宫／天王寺改搭 JR 关空快速；铁路大面积中断时用机场巴士，最后兜底为预约出租车。",
    sources: [{ label: "南海机场线官方时刻", href: NANKAI_TIMETABLE }],
  },
};

const transitTimings: Record<string, TransitTiming> = {
  [key("09.29", "kix", "osaka-stay")]: {
    departurePlan: "关西机场到达层｜15:20–15:40 完成入境取行李后去南海站",
    arrivalPlan: "难波站约 16:15–16:35｜酒店约 16:30–16:50",
    stayPlan: "办理入住并休整 60–75 分钟；17:50 再出门",
    timingStatus: "预计时间",
  },
  [key("09.29", "osaka-stay", "shinsaibashi")]: {
    departurePlan: "大阪酒店｜17:50 出发",
    arrivalPlan: "心斋桥筋约 18:05",
    stayPlan: "逛街、补给约 55 分钟；19:00 向道顿堀移动",
    timingStatus: "预计时间",
  },
  [key("09.29", "shinsaibashi", "dotonbori")]: {
    departurePlan: "心斋桥筋｜19:00 出发",
    arrivalPlan: "戎桥／道顿堀约 19:15",
    stayPlan: "晚餐与夜景约 75 分钟；20:30 离开",
    timingStatus: "预计时间",
  },
  [key("09.29", "dotonbori", "hozenji")]: {
    departurePlan: "道顿堀｜20:30 出发",
    arrivalPlan: "法善寺横丁约 20:38",
    stayPlan: "石板巷与参拜约 20 分钟；21:00 前后回酒店",
    timingStatus: "预计时间",
  },
  [key("09.29", "hozenji", "osaka-stay")]: {
    departurePlan: "法善寺横丁｜21:00 出发",
    arrivalPlan: "大阪酒店约 21:10",
    stayPlan: "结束抵达日；尽量保证 8 小时以上睡眠",
    timingStatus: "预计时间",
  },

  [key("09.30", "osaka-stay", "usj")]: {
    departurePlan: "大阪酒店｜06:30 离店；大阪难波 06:46 上车",
    arrivalPlan: "西九条 06:54｜环球城 07:11｜USJ 闸口约 07:15",
    stayPlan: "官方 08:00–22:00；全天游玩，午后安排一次 30–45 分钟坐下休息",
    timingStatus: "部分核实",
  },
  [key("09.30", "usj", "osaka-stay")]: {
    departurePlan: "USJ 闸口｜22:05–22:10；目标环球城 22:12／22:20 JR",
    arrivalPlan: "西九条约 22:17–22:25｜酒店约 22:50–23:05",
    stayPlan: "回店即休息；次日 10:30 才出门作为恢复日",
    timingStatus: "部分核实",
  },

  [key("10.01", "osaka-stay", "kuromon")]: {
    departurePlan: "大阪酒店｜10:30 出发",
    arrivalPlan: "黑门市场约 10:45",
    stayPlan: "早午餐与市场慢逛约 75 分钟；12:00 离开",
    timingStatus: "预计时间",
  },
  [key("10.01", "kuromon", "shitennoji")]: {
    departurePlan: "黑门市场｜12:00–12:05 出发",
    arrivalPlan: "四天王寺约 12:30–12:35",
    stayPlan: "境内参拜约 90 分钟；14:05 离开",
    timingStatus: "预计时间",
  },
  [key("10.01", "shitennoji", "tennoji-park")]: {
    departurePlan: "四天王寺｜14:05 出发",
    arrivalPlan: "慶泽园约 14:20",
    stayPlan: "庭园休息约 70 分钟；15:30 离开",
    timingStatus: "预计时间",
  },
  [key("10.01", "tennoji-park", "shinsekai")]: {
    departurePlan: "慶泽园｜15:30 出发",
    arrivalPlan: "新世界约 15:40",
    stayPlan: "街区散步与小吃约 60 分钟；16:40 离开",
    timingStatus: "预计时间",
  },
  [key("10.01", "shinsekai", "den-den-town")]: {
    departurePlan: "新世界｜16:40 出发",
    arrivalPlan: "电电城约 16:55",
    stayPlan: "动漫、电器店约 50 分钟；17:45 离开",
    timingStatus: "预计时间",
  },
  [key("10.01", "den-den-town", "wanaka")]: {
    departurePlan: "电电城｜17:45 出发",
    arrivalPlan: "わなか约 18:00",
    stayPlan: "章鱼烧与坐下休息约 30 分钟；18:30 回酒店",
    timingStatus: "预计时间",
  },
  [key("10.01", "wanaka", "osaka-stay")]: {
    departurePlan: "わなか千日前｜18:30 出发",
    arrivalPlan: "大阪酒店约 18:40",
    stayPlan: "当晚不再加景点，为神户日保留体力",
    timingStatus: "预计时间",
  },

  [key("10.02", "osaka-stay", "nunobiki")]: {
    departurePlan: "大阪酒店｜09:30；大阪难波 09:52 快速急行",
    arrivalPlan: "神户三宫 10:42｜新神户约 10:56｜缆车下站约 11:05",
    stayPlan: "约 11:15 上山；香草园游览至 12:45",
    timingStatus: "部分核实",
  },
  [key("10.02", "nunobiki", "kitano")]: {
    departurePlan: "布引香草园｜12:45 下山",
    arrivalPlan: "新神户约 13:00｜北野约 13:15",
    stayPlan: "异人馆街慢走约 30 分钟；13:45 下坡赴餐厅",
    timingStatus: "预计时间",
  },
  [key("10.02", "kitano", "mouriya")]: {
    departurePlan: "北野｜13:45 出发",
    arrivalPlan: "Mouriya 本店约 14:00",
    stayPlan: "预约午餐 14:00–15:30，预留完整 90 分钟",
    timingStatus: "预计时间",
  },
  [key("10.02", "mouriya", "meriken")]: {
    departurePlan: "Mouriya｜15:30 出发",
    arrivalPlan: "美利坚公园约 16:00",
    stayPlan: "旧居留地与港区慢走、休息约 1 小时 45 分；17:45 离开",
    timingStatus: "预计时间",
  },
  [key("10.02", "meriken", "harborland")]: {
    departurePlan: "美利坚公园｜17:45 出发",
    arrivalPlan: "Harborland 约 18:00",
    stayPlan: "日落后夜景约 75 分钟；19:15 开始返程",
    timingStatus: "预计时间",
  },
  [key("10.02", "harborland", "osaka-stay")]: {
    departurePlan: "Harborland｜19:15；约 19:30 到 JR 神户站",
    arrivalPlan: "大阪／梅田约 20:10｜酒店约 20:30–20:45",
    stayPlan: "回店后只整理次日随身包；大件行李已前送京都",
    timingStatus: "预计时间",
  },

  [key("10.03", "osaka-stay", "arashiyama-bamboo")]: {
    departurePlan: "大阪酒店｜07:50 退房，仅带随身包",
    arrivalPlan: "阪急岚山约 09:20｜竹林约 09:35–09:40",
    stayPlan: "竹林只停留 30 分钟；10:10 前往天龙寺",
    timingStatus: "预计时间",
  },
  [key("10.03", "arashiyama-bamboo", "tenryuji")]: {
    departurePlan: "竹林｜10:10 出发",
    arrivalPlan: "天龙寺北门约 10:15",
    stayPlan: "庭园与寺院约 90 分钟；11:45 离开",
    timingStatus: "预计时间",
  },
  [key("10.03", "tenryuji", "togetsukyo")]: {
    departurePlan: "天龙寺｜11:45 出发",
    arrivalPlan: "渡月桥／桂川约 12:00",
    stayPlan: "河岸与午餐约 2 小时；14:00 去 JR 站",
    timingStatus: "预计时间",
  },
  [key("10.03", "togetsukyo", "kyoto-stay")]: {
    departurePlan: "渡月桥｜14:00；目标 JR 嵯峨岚山 14:31",
    arrivalPlan: "京都站 14:49｜京都酒店约 15:05–15:20",
    stayPlan: "入住并休息约 2 小时 30 分；17:45 再赴晚餐",
    timingStatus: "部分核实",
  },
  [key("10.03", "kyoto-stay", "maekawa")]: {
    departurePlan: "京都酒店｜17:45 出发",
    arrivalPlan: "料理屋まえかわ约 18:15",
    stayPlan: "18:30 预约晚餐，按 2.5–3 小时预留至约 21:30",
    timingStatus: "预计时间",
  },
  [key("10.03", "maekawa", "kyoto-stay")]: {
    departurePlan: "料理屋まえかわ｜约 21:30–22:00 离店",
    arrivalPlan: "京都酒店约 22:15–22:35",
    stayPlan: "回店休息；次日 08:50 出发",
    timingStatus: "预计时间",
  },

  [key("10.04", "kyoto-stay", "philosopher")]: {
    departurePlan: "京都酒店｜08:50；目标约 09:00 从京都站前出发",
    arrivalPlan: "银阁寺道约 09:35｜哲学之道北端约 09:45",
    stayPlan: "完整慢走约 70 分钟；10:55 到南端",
    timingStatus: "部分核实",
  },
  [key("10.04", "philosopher", "nanzenji")]: {
    departurePlan: "哲学之道北端｜09:45 开始向南步行",
    arrivalPlan: "南禅寺区域约 10:55",
    stayPlan: "南禅寺与水路阁约 50 分钟；11:45 离开",
    timingStatus: "预计时间",
  },
  [key("10.04", "nanzenji", "byodoin")]: {
    departurePlan: "南禅寺｜11:45 出发",
    arrivalPlan: "JR 宇治约 12:35｜平等院约 12:45",
    stayPlan: "只看庭园与博物馆约 70 分钟；13:55 离开",
    timingStatus: "预计时间",
  },
  [key("10.04", "byodoin", "nakamura-uji")]: {
    departurePlan: "平等院｜13:55 出发",
    arrivalPlan: "中村藤吉平等院店约 14:00",
    stayPlan: "茶餐／甜品约 35 分钟；排队超 15 分钟即外带",
    timingStatus: "预计时间",
  },
  [key("10.04", "nakamura-uji", "uji-river")]: {
    departurePlan: "中村藤吉｜14:35 出发",
    arrivalPlan: "宇治川／朝雾桥约 14:40",
    stayPlan: "河岸短停约 15 分钟；14:55 去 JR 宇治站",
    timingStatus: "预计时间",
  },
  [key("10.04", "uji-river", "joyo")]: {
    departurePlan: "宇治川｜14:55；目标 JR 宇治 15:26",
    arrivalPlan: "JR 长池 15:37｜烟火会场约 15:45–16:00",
    stayPlan: "先取位、休息与用餐；19:00–19:40 看烟火",
    timingStatus: "部分核实",
  },
  [key("10.04", "joyo", "kyoto-stay")]: {
    departurePlan: "会场｜19:50 起随人流离场；目标 JR 长池 20:50",
    arrivalPlan: "京都站 21:23｜酒店约 21:35–21:45",
    stayPlan: "回店即休息；次日贵船不安排更早班次",
    timingStatus: "部分核实",
  },

  [key("10.05", "kyoto-stay", "kifune")]: {
    departurePlan: "京都酒店｜09:00；09:42 前到出町柳",
    arrivalPlan: "出町柳 09:52 → 贵船口 10:21；33 路 10:32 → 贵船约 10:37",
    stayPlan: "本宫 10:45–11:30，含参拜、御守与短休",
    timingStatus: "部分核实",
  },
  [key("10.05", "kifune", "kifune-okumiya")]: {
    departurePlan: "贵船神社本宫｜11:30 出发",
    arrivalPlan: "奥宫约 11:55",
    stayPlan: "林间参拜约 35 分钟；12:30 返程",
    timingStatus: "预计时间",
  },
  [key("10.05", "kifune-okumiya", "kifune-yui")]: {
    departurePlan: "贵船神社奥宫｜12:30 出发",
    arrivalPlan: "结社约 12:45",
    stayPlan: "参拜约 20 分钟；13:05 开始午餐与河畔休息",
    timingStatus: "预计时间",
  },
  [key("10.05", "kifune-yui", "kyoto-stay")]: {
    departurePlan: "结社周边｜13:05 午餐；15:20 去站，目标 15:37 巴士",
    arrivalPlan: "贵船口约 15:42｜京都酒店约 17:00–17:30",
    stayPlan: "回店后不再排景点；33 路 17:35 末班仅作兜底",
    timingStatus: "部分核实",
  },

  [key("10.06", "kyoto-stay", "fushimi-inari")]: {
    departurePlan: "京都酒店｜08:05 退房；京都站 08:26 JR",
    arrivalPlan: "JR 稻荷 08:32｜神社入口约 08:35",
    stayPlan: "本殿、千本鸟居、奥社短线约 85 分钟；10:00 下山",
    timingStatus: "部分核实",
  },
  [key("10.06", "fushimi-inari", "todaiji")]: {
    departurePlan: "伏见稻荷｜10:00 下山；目标 JR 稻荷 10:32",
    arrivalPlan: "JR 奈良 11:40｜东大寺约 12:05",
    stayPlan: "南大门与大佛殿约 85 分钟；13:30 前往二月堂",
    timingStatus: "部分核实",
  },
  [key("10.06", "todaiji", "nigatsudo")]: {
    departurePlan: "东大寺大佛殿｜13:30 出发",
    arrivalPlan: "二月堂约 13:45",
    stayPlan: "登高、眺望与休息约 30 分钟；14:15 离开",
    timingStatus: "预计时间",
  },
  [key("10.06", "nigatsudo", "mizuya")]: {
    departurePlan: "二月堂｜14:15 出发",
    arrivalPlan: "水谷茶屋约 14:35",
    stayPlan: "午餐约 60 分钟；若排队长，改春日野园地简餐",
    timingStatus: "预计时间",
  },
  [key("10.06", "mizuya", "kasuga")]: {
    departurePlan: "水谷茶屋｜15:35 出发",
    arrivalPlan: "春日大社约 15:50",
    stayPlan: "林间参道与参拜约 45 分钟；16:35 离开",
    timingStatus: "预计时间",
  },
  [key("10.06", "kasuga", "osaka-stay")]: {
    departurePlan: "春日大社｜16:35；目标近铁奈良 17:12 快速急行",
    arrivalPlan: "大阪难波 17:49｜酒店约 18:05–18:25",
    stayPlan: "入住、取前送行李并在难波轻松晚餐；不再加跨区景点",
    timingStatus: "部分核实",
  },

  [key("10.07", "osaka-stay", "kix")]: {
    departurePlan: "难波酒店 07:40｜心斋桥酒店 07:25；目标南海难波 08:00",
    arrivalPlan: "Rapi:t 08:00 → 关西机场 08:39｜航站楼约 08:50",
    stayPlan: "预留约 3 小时 10 分钟办理值机、安检与出境；12:00 起飞",
    timingStatus: "部分核实",
  },
};

export function getTransitLeg(date: string, fromId: string, toId: string) {
  const legKey = key(date, fromId, toId);
  const transit = transitLegs[legKey];
  const timing = transitTimings[legKey];
  return transit && timing ? { ...transit, ...timing } : undefined;
}
