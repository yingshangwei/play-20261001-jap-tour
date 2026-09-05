import type { GuideDay, VisitGuide } from "@/app/guide-core/types";

const source = (label: string, href: string) => ({ label, href, checkedAt: "2026-09-06" });
const practical: Record<string, NonNullable<GuideDay["practical"]>> = {
  "09.29": { walking: "约 2–4 km", effort: "抵达日 · 轻量", priority: "心斋桥保留；落地、入境与到店均预留浮动，不订第一晚长套餐。", cutIfLate: "晚到先入住和吃饭，法善寺可以跳过；不挤占次日 USJ 前的睡眠。" },
  "09.30": { walking: "园内可能超过 8 km", effort: "全程最累的一天", priority: "07:15 到闸口是计划目标；午后至少一次坐下休息。Studio Pass 与任天堂园区入场方案分别确认。", cutIfLate: "不追完所有项目；累了可提前回店，10.01 保留 10:30 晚出发。" },
  "10.01": { walking: "核心约 3–4 km；全走约 5–7 km", effort: "恢复日 · 尾段可选", priority: "黑门、四天王寺、慶泽园是三个核心。后面的新世界、电电城与小吃不是必须完成的清单。", cutIfLate: "15:30 在慶泽园决定是否收尾；若累了直接地铁／出租车回店，约 16:00–16:15 到店（估算）。" },
  "10.02": { walking: "约 5–7 km，含坡路", effort: "山海两片区", priority: "12:45 开始下山，保住 14:00 神户牛午餐目标；餐厅仍需确认 3 人预约。", cutIfLate: "北野只看街景，不逐馆入内；缆车停运就跳过香草园，神户和港区仍保留。" },
  "10.03": { walking: "约 4–6 km，轻装", effort: "换宿日 · 午后休息", priority: "先到京都酒店交箱。18:30 是餐厅开餐约束，尚不代表已订到；需要三人席位确认。", cutIfLate: "交箱晚于 10:05 就换下一班 JR，压缩河岸，不省略酒店交箱；晚餐前至少留出休息与梳洗时间。" },
  "10.04": { walking: "约 6–8 km，另有排队站立", effort: "长日 · 保护烟火时间", priority: "哲学之道完整约 70 分钟；南禅寺只看境内与水路阁。14:55 离开河岸、16:00 到会场是计划目标。", cutIfLate: "先删付费殿堂／凤凰堂内部／茶店排队；宇治晚到就只吃饭和短走。烟火后错过 20:50 时按后续班次回店，不保证 22:00 前抵达。" },
  "10.05": { walking: "约 3–5 km，台阶和缓坡", effort: "烟火次日 · 不加早起", priority: "09:00 离店，目标 10:00 叡山鞍马方向；本宫、奥宫、结社保留，15 点多开始下山。", cutIfLate: "候车耽误就缩短饭后闲坐，不追加鞍马翻山。普通雨天保留参拜；警报或封路时遵从现场安全管制。" },
  "10.06": { walking: "约 6–8 km，含台阶", effort: "移动日 · 两个核心区域", priority: "仅带两晚分装包。12 点多先吃午餐再进大佛殿；春日大社按一般参拜安排，不追 16:00 结束的特别参拜。", cutIfLate: "缩短二月堂眺望和茶歇，16:20 开始去车站；奈良回大阪目标 17:12，错过改后续直达班次。" },
  "10.07": { walking: "仅车站 / 机场接驳", effort: "返程日 · 必须早起", priority: "心斋桥约 07:25、难波约 07:40 离店；目标 08:00 南海，约 09:00 前到航站楼，12:00 航班。", cutIfLate: "不要等下一班特急而白白耽搁；08:02 空港急行是候选备选，铁路大范围异常须立即改机场巴士或出租车。" },
};

const visits: Record<string, Record<string, VisitGuide>> = {
  "09.29": {
    shinsaibashi: { priority: "必保留", duration: "约 55 分钟", focus: "步行商店街、买旅行补给；不是逐家扫店。晚餐在难波周边解决。" },
    dotonbori: { priority: "核心", duration: "约 75 分钟，含用餐", focus: "戎桥与河岸夜景，顺路吃饭；不再跨区找餐厅。" },
    hozenji: { priority: "可跳过", duration: "约 20 分钟", focus: "横丁短走即可；落地晚或疲劳时直接回酒店。" },
  },
  "09.30": {
    usj: { priority: "必保留", duration: "全天，约 08:00–22:00", focus: "以已购买的指定时段排任天堂世界与主项目，给餐食、排队和休息留空白。", hours: "9/30 官网营业 08:00–22:00；可能提前开园，出发前复核。", booking: "日期指定 Studio Pass；另确认覆盖 SUPER NINTENDO WORLD 的 Express Pass 或有效指定入场方案。", caution: "全日步行可能明显超过 8 km。不要把营业 14 小时理解为连续游玩 14 小时。", sources: [source("USJ 营业日历", "https://www.usj.co.jp/web/ja/jp/park-guide/schedule/park-hour2")] },
  },
  "10.01": {
    kuromon: { priority: "核心", duration: "约 75 分钟，含早午餐", focus: "早餐兼午餐与少量小吃；不用每个摊位排队。" },
    shitennoji: { priority: "核心", duration: "约 90 分钟", focus: "以中心伽蓝为主，不把所有庭园、宝物馆都纳入。", hours: "10 月中心伽蓝等收费区 08:30–16:00；外围开放不等于各馆开放。", price: "中心伽蓝成人 ¥500；庭园另 ¥300。", caution: "本次不安排宝物馆特展；当期秋季展 10/10 才开始。", sources: [source("四天王寺参拜", "https://www.shitennoji.or.jp/admission.html")] },
    "tennoji-park": { priority: "核心", duration: "约 60–70 分钟", focus: "庭园慢走和坐下休息，结束后再决定是否追加街区。", hours: "09:30–17:00，最后入园 16:30；通常周一休园。", price: "成人 ¥300。", caution: "9 月有池塘补水与瀑布暂停的检修公告，可能延长；10/1 前复核。未恢复或风雨大时直接回酒店休息。", sources: [source("慶泽园开放信息", "https://www.keitakuen-garden.jp/en/info"), source("池塘检修公告", "https://www.keitakuen-garden.jp/en/news/smk57ch9f")] },
    shinsekai: { priority: "可跳过", duration: "约 30–60 分钟", focus: "看通天阁街景，不默认排队登塔；与电电城二选一也可以。" },
    "den-den-town": { priority: "可跳过", duration: "约 45–60 分钟", focus: "有精力才逛动漫店；超过 17:45 就收尾。" },
    wanaka: { priority: "用餐候选", duration: "约 20–30 分钟", focus: "回店路上的小吃候选；排队长就跳过，不视为一顿正式晚餐。" },
  },
  "10.02": {
    nunobiki: { priority: "核心", duration: "约 90 分钟", focus: "缆车上山后选花园与眺望台慢走；不追全园，也不再推荐已撤去的足汤。", hours: "10/2 平日：上行 09:30–16:45，下行末班 17:15；花园 10:00–17:00。", price: "成人往返缆车＋入园 ¥2,500（2026/4 起）。", caution: "风或雷雨可能停运；若已在山上，遵从工作人员安排，不自行硬走山路。", sources: [source("布引营业 / 票价", "https://www.kobeherb.com/infomation/hours_fare/")] },
    kitano: { priority: "可跳过", duration: "约 30 分钟", focus: "街景与外观即可，避免坡路上重复折返；为 14:00 午餐让路。" },
    mouriya: { priority: "用餐候选", duration: "90 分钟", focus: "神户牛正式午餐候选，保留 14:00–15:30。", booking: "需自行确认本店 3 人、菜单与开餐时间；候选行程不代表预约成功。" },
    meriken: { priority: "核心", duration: "约 90–105 分钟", focus: "港边步道、拍照与坐下休息，不追加多个收费馆。" },
    harborland: { priority: "核心", duration: "约 60–75 分钟", focus: "与美利坚公园合并视为同一个港区体验；19:15 开始返程。" },
  },
  "10.03": {
    "arashiyama-bamboo": { priority: "必保留", duration: "约 20–30 分钟", focus: "公共竹林道路短走；不把短竹林体验扩成半日打卡。", price: "公共道路免费；不等同于其他收费竹林设施。", sources: [source("京都岚山区域指南", "https://ja.kyoto.travel/area/area09.php")] },
    tenryuji: { priority: "核心", duration: "约 90 分钟", focus: "曹源池庭园是主体验；建筑参观依时间与兴趣决定。", hours: "08:30–17:00，最后受付 16:50。", price: "庭园成人 ¥500；诸堂参拜另加 ¥300。", sources: [source("天龙寺参拜", "https://www.tenryuji.com/en/visit/index.html")] },
    togetsukyo: { priority: "核心", duration: "约 80 分钟，含午餐", focus: "河岸与桥边短走 20–35 分钟，其余留给午餐；不加猴子公园或小火车。", caution: "雨后涨水不下河滩；交箱或餐食晚了先压缩河岸。" },
    maekawa: { priority: "用餐候选", duration: "约 2.5–3 小时", focus: "18:30 开餐的正式晚餐首选，下午先回酒店休息。", booking: "需要确认 3 人预约、套餐及取消规则；目前不是已订状态。", caution: "回店较晚，次日早上寄出大箱的手续尽量前一晚准备。" },
  },
  "10.04": {
    philosopher: { priority: "必保留", duration: "约 70 分钟慢行", focus: "完整体验约 2 km 运河道；这 70 分钟已计入下一段步行，南端到南禅寺另留约 20 分钟，不重复计时。", price: "公共步道免费。", sources: [source("哲学之道官方旅游介绍", "https://ja.kyoto.travel/tourism/single01.php?category_id=8&tourism_id=2684")] },
    nanzenji: { priority: "可跳过", duration: "约 30 分钟", focus: "只看境内与水路阁；本轮用压缩寺院参观补回运河南端的接驳时间，不缩短哲学之道。", hours: "收费区域 08:40–17:00，受付至 16:40；本日不进收费殿堂。", price: "境内与水路阁散步免费；方丈、三门各 ¥600（本日不安排）。", caution: "南禅院因整修休观至 2027 年春；不是整个南禅寺关闭。11:45 必须往蹴上站走。", sources: [source("南禅寺参观", "https://nanzenji.or.jp/about_rinzaishu/visit"), source("南禅院休观", "https://www.nanzenji.or.jp/information/20260108")] },
    byodoin: { priority: "核心", duration: "约 45 分钟；之前先吃午餐", focus: "12:45–13:20 在表参道附近吃简餐，13:20–14:05 看庭园；博物馆有余量再选看，不排凤凰堂内部。", hours: "庭园 08:45–17:30（入园至 17:15）；博物馆 09:00–17:00（至 16:45）。", price: "成人 ¥700，包含庭园与博物馆；只看庭园也不是另一种低价票。", caution: "6/16–10/15 凤凰堂内部每场减员、部分半点场次取消，排队容易拖延烟火行程。", sources: [source("平等院参观", "https://www.byodoin.or.jp/guide/"), source("凤凰堂内部调整", "https://www.byodoin.or.jp/news/1/202479/")] },
    "nakamura-uji": { priority: "用餐候选", duration: "约 20–25 分钟", focus: "下午只作茶歇，不再把午餐拖到这里；需等位就外带或换店。", booking: "不是已订位，不以热门茶店入座作为完成条件。" },
    "uji-river": { priority: "可跳过", duration: "约 15 分钟", focus: "14:55 离开河岸去 JR 宇治；行程落后就省掉这段停留。" },
    joyo: { priority: "必保留", duration: "19:00–19:40；提前到场休息", focus: "约 16:00 到场是保守计划目标，不是官方入场截止。带水、食品和可坐的垫子，留足排队与散场时间。", hours: "10/4 会场 14:00–21:00；烟火 19:00 起约 40 分钟。", price: "线下票 ¥2,000；Ticket Pia ¥2,500；无当日售票。", booking: "限量预售至 10/3，可能提前售罄。雨天照常，恶劣天气取消且原则不退款。", caution: "正常步行 5 分钟不含排队；散场优先目标 20:50 JR，错过后的回店时间会顺延。", sources: [source("城阳市活动公告", "https://www.city.joyo.kyoto.jp/joint/0000012600.html")] },
  },
  "10.05": {
    kifune: { priority: "必保留", duration: "本宫约 45–60 分钟", focus: "本宫→奥宫→结社保持原顺序。接驳改正后约 11:00–11:15 到本宫，不再赶未确认的 10:32 巴士。", hours: "5–11 月本宫通常 06:00–20:00；授与所 / 御朱印 09:00–17:00。", price: "参拜免费；御守等另计。", caution: "石阶雨天湿滑；普通下雨仍保留参拜，遇警报、封路或停运不得强行进入。", sources: [source("贵船神社参拜", "https://kifunejinja.jp/en/info/")] },
    "kifune-okumiya": { priority: "必保留", duration: "约 35 分钟", focus: "沿河缓坡进入林间，含拍照与安静参拜；不从这里追加鞍马翻山。" },
    "kifune-yui": { priority: "必保留", duration: "约 20 分钟；之后午餐休息", focus: "三社参拜收尾，附近午餐与河畔休息到 15:20，给下午返程留余量。" },
  },
  "10.06": {
    "fushimi-inari": { priority: "必保留", duration: "约 85 分钟", focus: "本殿→千本鸟居→奥社奉拜所原路折返，不上山顶。10:00 收尾去 JR 稻荷站。" },
    todaiji: { priority: "核心", duration: "午餐 35 分钟＋参观 80 分钟", focus: "12:05 到东大寺片区先吃简餐；12:40–14:00 看南大门与大佛殿，把原来 14:35 的午餐前置。", hours: "4–10 月大佛殿 07:30–17:30。", price: "成人 ¥800；现场现金支付。", booking: "大佛殿个人参拜不接受预约。", sources: [source("东大寺参拜", "https://www.todaiji.or.jp/information/haikan/")] },
    nigatsudo: { priority: "可跳过", duration: "约 25 分钟", focus: "眺望与休息，不追其他堂宇；累了可缩短，给春日大社与返程留力。" },
    mizuya: { priority: "用餐候选", duration: "约 20 分钟", focus: "从晚午餐改为可选茶歇；没座或排队就直接走林间参道。" },
    kasuga: { priority: "核心", duration: "约 45 分钟", focus: "一般参拜与林间参道；15:35 左右到、16:20 离开，不以付费特别参拜为目标。", hours: "官网基本信息：3–10 月一般参拜 06:30–17:30；特别参拜 09:00–16:00。", price: "一般参拜免费；特别参拜 ¥700（本日不安排）。", caution: "10/6 周二，万叶植物园季节性周二休园，不追加。", sources: [source("春日大社参拜", "https://www.kasugataisha.or.jp/en/about_en/basic/")] },
  },
};

export function addPlanOneVisitGuides(days: GuideDay[]): GuideDay[] {
  return days.map((day) => ({ ...day, practical: practical[day.id], visits: visits[day.id] }));
}
