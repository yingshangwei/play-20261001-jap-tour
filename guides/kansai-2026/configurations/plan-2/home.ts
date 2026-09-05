import type { HomeItineraryDay, HomePageConfig, HomeRestaurant } from "@/app/guide-core/types";
import { kansaiHome } from "../../home";

const changes: Record<string, Partial<HomeItineraryDay>> = {
  "09.29": { note: "14:00 落地后先入住休息，17:50 再出门；心斋桥保留，晚餐坐下吃。若出关延误，缩短道顿堀与法善寺停留，不压缩入境和酒店缓冲。" },
  "09.30": { note: "保留 08:00–22:00 全天与任天堂入场方案。按实际项目预约安排午餐，午后至少一次 45 分钟坐下休息；USJ 属高步行负担日，不承诺能控制在 8 公里，次日用短路线恢复。" },
  "10.01": {
    title: "恢复日做到一半，就安心回酒店",
    route: "大阪住宿 → 黑门早午餐 → 四天王寺 → 慶泽园 → 御堂筋线 → 大阪住宿",
    schedule: "10:30 离店 · 10:45–12:00 黑门 · 12:35–14:05 四天王寺 · 14:20–15:30 慶泽园 · 16:00–16:15 回店",
    note: "三个停留足够。删掉新世界、电电城与わなか的连续晚段，换来至少 90 分钟酒店休息。早午餐坐下吃，庭园再坐一会儿；若选 18:30 市松，就只安排这一顿晚间活动。",
    transit: "步行约 3–4 公里（估算）；慶泽园后步行到天王寺，搭御堂筋线回难波／心斋桥",
  },
  "10.02": { note: "布引、北野与港区保留，14:00 午餐坐满 90 分钟；16:00–17:45 港区内留 30 分钟坐下休息。大风停缆车就改北野和港区；大箱全天留大阪，20:30–20:45 回店再打包。" },
  "10.03": { note: "先把大箱交给京都酒店，再轻装去岚山。竹林短停，天龙寺和河岸构成两个主要体验；13:15–14:00 坐下吃饭，15:30 回店休息。18:30 まえかわ仍是候选，只有预订成功才执行晚餐往返。" },
  "10.04": {
    title: "先走哲学之道，吃好午饭再等烟火",
    schedule: "08:50 离店 · 09:45–11:45 东山 · 12:45–13:20 午餐 · 13:20–14:10 平等院庭园 · 14:55 去站 · 15:26 JR · 16:00 会场 · 19:00–19:40 烟火 · 21:35 回店",
    note: "保留哲学之道完整 70 分钟与南禅寺。把宇治午餐提前，平等院只看庭园；凤凰堂内部、博物馆和茶店长队让位于用餐与候场。进场后坐下休息，晚餐提前买好，不靠临时排摊位解决。",
  },
  "10.05": { note: "烟火次日仍 09:00 出门，本宫、奥宫、结社后午餐休息。默认不翻鞍马山，也不叠加下鸭神社、跳石与商店街；下雨仍保留贵船参拜，遇官方交通中断或危险警报则服从现场安排。" },
  "10.06": {
    title: "伏见接奈良，先吃午餐再进大佛殿",
    route: "京都住宿退房 → 伏见稻荷短线 → 东大寺入口周边午餐 → 大佛殿 → 二月堂 → 水谷茶屋短休 → 春日大社一般参拜 → 大阪住宿",
    schedule: "08:05 退房 · 08:26–08:32 JR · 08:35–10:00 伏见 · 10:32–11:40 JR · 12:05 午餐 · 12:40–14:05 东大寺 · 14:20 二月堂 · 15:05 茶歇 · 15:45–16:25 春日大社 · 17:21 近铁 · 18:15–18:35 大阪酒店",
    note: "用入口周边 35 分钟午餐替换原定 14:35 的迟午餐，保留大佛殿 85 分钟。水谷茶屋改短休；春日大社默认一般参拜，特别参拜 16:00 结束。奈良段不加森林徒步、奈良町或依水园；全天步行约 6–8 公里，按酒店位置浮动，进出景区搭巴士。",
    transit: "JR 08:26 京都→08:32 稻荷；10:32 稻荷→11:40 奈良；近铁现行平日急行 17:21→18:02 大阪难波（出发前复查）",
  },
  "10.07": { note: "前一晚完成大部分打包。沿用 08:00 Rapi:t、08:39 到 KIX、约 08:50 进航站楼的保守窗口；航班 12:00 起飞。具体酒店和航站楼确定后再校准步行时间。" },
};

const restaurantChanges: Record<string, Partial<HomeRestaurant>> = {
  "焼鳥市松": {
    when: "10.01 18:30 · 下午回酒店休息后",
    caution: "从容版约 16:00 已回酒店；休息后约 17:40 出发。若 USJ 疲劳未缓解，就放弃正式餐，难波附近简单吃。",
  },
  "ぬまた双": {
    when: "10.06 19:30 以后 · 奈良回大阪入住后，以实际席位为准",
    caution: "约 18:15–18:35 才到酒店；必须把取行李与去西天满的时间算进去。只有早场就换候选或取消正式餐。",
  },
  "是しん": { when: "10.06 19:30 以后 · 大阪入住、取行李后" },
};

export const planTwoHome: HomePageConfig = {
  ...kansaiHome,
  metadata: { ...kansaiHome.metadata, title: "九日关西｜配置 2 · 从容版", description: "2026 关西九日从容版：保留 USJ、神户、岚山、哲学之道、烟火、贵船和伏见接奈良，缩短恢复日晚段，明确午餐与休息。" },
  hero: { ...kansaiHome.hero, eyebrow: "2026 · 配置 2 · 从容版", description: "九日路线与固定日期照旧。大阪恢复日提早回店，烟火日先吃午饭再逛宇治，奈良日把正餐放在大佛殿之前；重要的体验留足时间，疲劳时也知道从哪里收尾。" },
  itinerary: {
    ...kansaiHome.itinerary,
    note: "配置 2 · 全部九天已复核 · 时间均为日本当地时间",
    items: kansaiHome.itinerary.items.map((day) => ({ ...day, ...changes[day.date] })),
    journalPaths: Object.fromEntries(kansaiHome.itinerary.items.map((day) => [day.date, `/guides/kansai-2026-plan-2/days/2026-${day.date.replace(".", "-")}`])),
  },
  reference: {
    ...kansaiHome.reference,
    note: "2026-09-05 · 全部九天与旧 Day 3 草稿复盘",
    titleLines: ["把时间留给体验，", "也留给吃饭和休息。"],
    description: "固定日期、住宿和行李安排沿用原计划。配置 2 的取舍集中在恢复日尾段、午餐时机与可取消项目，适合优先照顾睡眠和体力。",
    items: [
      { status: "缩短", tone: "adopt", title: "10.01 庭园后回酒店", body: "黑门、四天王寺、慶泽园后结束；删去新世界、电电城串联，约 16:00 回店，比原计划多出约两小时休息。" },
      { status: "先吃饭", tone: "adopt", title: "10.04 午餐优先于平等院内部", body: "12:45–13:20 坐下吃饭，平等院只看庭园。茶店排队超过 10 分钟就换补给，保住 15:26 列车与 16:00 入场。" },
      { status: "前置", tone: "move", title: "10.06 不把午餐拖到下午", body: "到东大寺入口先用餐 35 分钟，再留 85 分钟看大佛殿。水谷茶屋只作短休，春日大社以一般参拜为主。" },
      { status: "取舍", tone: "skip", title: "旧奈良徒步草稿不并入正线", body: "旧草稿把 10.01 改成 07:25 出发、11–12 公里步行，与 USJ 次日恢复要求冲突。原始林 4.5 公里和奈良町本次不追加。" },
      { status: "保留", tone: "keep", title: "所有固定锚点与行李交接照旧", body: "USJ、神户、岚山、哲学之道、烟火、贵船、伏见和抵达夜心斋桥保留；10.03 先交箱，10.04 前送大箱，10.06 轻装南下。" },
      { status: "留余量", tone: "keep", title: "高负担日之后不再加码", body: "USJ 步行量难保证低于 8 公里，次日用短路线补偿；贵船回城后默认休息，最后一晚的正式餐只选能从容到场的晚席。" },
    ],
  },
  dining: { ...kansaiHome.dining, items: kansaiHome.dining.items.map((restaurant) => ({ ...restaurant, ...restaurantChanges[restaurant.name] })) },
  detours: {
    ...kansaiHome.detours,
    description: "全部是可跳过的替换项，不能叠加在当天完整路线后。",
    items: kansaiHome.detours.items.map((item) => ({ ...item, body: item.area === "大阪"
      ? "想逛电电城，就替换当天庭园或正式晚餐；恢复日不在三站之后再加购物。"
      : `${item.body} 若实际体力不足，直接略过。` })),
  },
  practical: {
    ...kansaiHome.practical,
    items: kansaiHome.practical.items.map((item) => item.title === "取舍"
      ? { ...item, body: "固定锚点全部保留。10.01 删尾段，10.04 先午餐再看平等院庭园，10.06 先午餐再入大佛殿；所有动漫绕行与正式晚餐都可取消。" }
      : item.title === "天气"
        ? { ...item, body: "9 月末至 10 月初仍需防阵雨、台风和湿滑。贵船普通雨天保留神社；神户大风改北野与港区；奈良雨天取消二月堂坡道。奈良国立博物馆佛像馆自 9 月 14 日起装修，不能当完整雨天替代。" }
        : item),
  },
  sources: { ...kansaiHome.sources, links: [
    ...kansaiHome.sources.links,
    { label: "东大寺开放时间与现金票价", href: "https://www.todaiji.or.jp/information/haikan/" },
    { label: "春日大社一般与特别参拜时间", href: "https://www.kasugataisha.or.jp/en/about_en/basic/" },
    { label: "近铁奈良平日 17:21 急行", href: "https://eki.kintetsu.co.jp/english/T7?dw=0&sf=5212&time=1720&tx=1-123" },
    { label: "奈良国立博物馆佛像馆装修公告", href: "https://www.narahaku.go.jp/english/about/guide/butsuzo/" },
  ] },
};
