import TripMap from "./TripMap";
import JourneyPlayer from "./JourneyPlayer";

export const dynamic = "force-static";

const dayOneHref = process.env.GITHUB_ACTIONS === "true" ? "./day-1.html" : "/day-1";

const days = [
  {
    date: "09.29",
    day: "周二",
    city: "大阪",
    stay: "难波 / 心斋桥",
    title: "抵达关西，先去感受大阪的夜",
    route: "KIX → 难波入住 → 心斋桥筋 → 道顿堀 → 法善寺横丁 → 大阪住宿",
    rhythm: "抵达日 · 无需早起",
    schedule: "14:00 落地 · 15:20–15:40 进城 · 16:30–16:50 酒店 · 17:50–21:10 难波夜行",
    note: "按 14:00 落地计算，第一晚不安排长套餐。心斋桥是必到项，也适合处理药妆和基础购物。",
    transit: "南海 Rapi:t／空港急行直达难波；机场进城约 34–55 分钟",
    tone: "city",
  },
  {
    date: "09.30",
    day: "周三",
    city: "大阪",
    stay: "难波 / 心斋桥",
    title: "USJ 全天：从任天堂世界玩到惊魂夜",
    route: "大阪住宿 → USJ（任天堂世界・哈利波特・惊魂夜）→ 大阪住宿",
    rhythm: "必须早起 · 06:30 离店",
    schedule: "06:30 离店 · 06:46 阪神 · 07:11 环球城 · 08:00–22:00 USJ · 22:50–23:05 回店",
    note: "官方 9 月 30 日营业时间为 08:00–22:00，计划 07:15 左右到闸口。购买含超级任天堂世界指定入场的 Express Pass，午后必须安排一次坐下休息。",
    transit: "06:46 大阪难波→06:54 西九条；07:05 JR→07:11 环球城；闭园后目标 22:12／22:20 JR",
    tone: "special",
  },
  {
    date: "10.01",
    day: "周四",
    city: "大阪",
    stay: "难波 / 心斋桥",
    title: "USJ 后睡到自然醒，再慢走大阪南区",
    route: "大阪住宿 → 黑门市场 → 四天王寺 → 慶泽园 → 新世界 → 电电城 → わなか → 大阪住宿",
    rhythm: "恢复日 · 10:30 离店",
    schedule: "10:30 离店 · 10:45–12:00 黑门 · 12:35–14:05 四天王寺 · 14:20–18:30 慢行 · 18:40 回店",
    note: "删除美术馆和重复的道顿堀，把恢复日控制在一个南北向片区；慶泽园、新世界或电电城任一处都可以提前收尾。",
    transit: "全日以步行为主，约 5–6 公里；炎热或下雨时用谷町线／千日前线缩短",
    tone: "city",
  },
  {
    date: "10.02",
    day: "周五",
    city: "神户",
    stay: "难波 / 心斋桥",
    title: "神户保留：从山景走到海港",
    route: "大阪住宿 → 布引香草园 → 北野 → 神户牛午餐 → 美利坚公园 → Harborland → 大阪住宿",
    rhythm: "常规作息 · 09:30 离店",
    luggage: "当天不换酒店；大箱留在大阪住宿，回店后再完成次日换宿打包",
    schedule: "09:30 离店 · 09:52–10:42 阪神 · 11:15–12:45 布引 · 14:00–15:30 午餐 · 20:30 回大阪",
    note: "保留评价稳定的布引、北野与港区，删除功能较弱的生田神社短停。把 Mouriya 午餐推到 14:00，换来接近正常作息的上午；大件行李整天留在大阪酒店，不带去神户。",
    transit: "09:52 大阪难波直达 10:42 神户三宫，再换地铁；返程 JR 神户线＋御堂筋线",
    tone: "nature",
  },
  {
    date: "10.03",
    day: "周六",
    city: "京都",
    stay: "京都站附近",
    title: "先把行李交给京都酒店，再轻装去岚山",
    route: "大阪住宿退房 → 京都住宿交箱 → 岚山竹林 → 天龙寺 → 渡月桥 → 京都住宿休息 → 正式晚餐 → 京都住宿",
    rhythm: "移动日 · 08:15 带箱离店",
    luggage: "箱子只走大阪酒店→京都酒店；10:05 前台交接后，全日不再携带或寄存大件",
    schedule: "08:15 退房 · 09:45–10:05 京都酒店交箱 · 10:27–10:44 JR · 10:55–14:35 岚山 · 15:02–15:20 JR · 15:30 回店 · 18:30 正餐",
    note: "不再先带箱去岚山，也不依赖车站寄存。竹林只留 30 分钟，主体验仍是天龙寺庭园和渡月桥；若大阪到京都晚点，优先压缩河岸，不动 18:30 固定晚餐。",
    transit: "御堂筋线＋JR 京都线先到京都酒店；JR 嵯峨野线往返岚山；晚餐用 JR 奈良线＋京阪本线",
    tone: "culture",
  },
  {
    date: "10.04",
    day: "周日",
    city: "宇治 · 城阳",
    stay: "京都站附近",
    title: "哲学之道、宇治川与秋日烟火",
    route: "京都住宿 → 哲学之道 → 南禅寺・水路阁 → 平等院 → 宇治川 → 城阳秋花火 → 京都住宿",
    rhythm: "常规偏早 · 08:50 离店",
    luggage: "08:20 前把大箱交给京都酒店前台，宅急便直送 10.06 的大阪酒店；随身保留两晚用品",
    schedule: "08:50 离店 · 09:45–11:45 东山 · 12:45–14:55 宇治 · 15:26 JR · 16:00 会场 · 19:00–19:40 烟火 · 21:35 回店",
    note: "哲学之道和烟火都是不可删除项。伏见稻荷改到 10 月 6 日清晨；当天删除东福寺和宇治上神社，平等院不等待周日可能长达约 2 小时的凤凰堂内部参观。",
    transit: "市巴士 7 路进东山；地铁东西线＋JR 奈良线去宇治／长池；烟火后目标 20:50，21:23 到京都",
    tone: "special",
  },
  {
    date: "10.05",
    day: "周一",
    city: "京都北山",
    stay: "京都站附近",
    title: "贵船神社是硬约束，雨天也不会删除",
    route: "京都住宿 → 贵船口・33 路巴士 → 本宫 → 奥宫 → 结社 → 河畔午餐 → 京都住宿",
    rhythm: "正常作息 · 09:00 离店",
    schedule: "09:00 离店 · 09:52–10:21 叡电 · 10:32 巴士 · 10:45–15:20 贵船 · 15:37 巴士 · 17:00–17:30 回店",
    note: "改搭 09:52 的叡电，烟火次日可以睡到接近日常生物钟。默认直达贵船三社，鞍马翻山只在天气与体力都良好时加码；无论晴雨，本宫都必须保留。",
    transit: "JR 奈良线＋京阪本线＋叡山电车＋京都巴士 33 路；返程巴士末班约 17:35",
    tone: "nature",
  },
  {
    date: "10.06",
    day: "周二",
    city: "伏见 · 奈良 → 大阪",
    stay: "难波 / 心斋桥",
    title: "伏见稻荷之后，沿 JR 奈良线继续南下",
    route: "京都住宿退房 → 伏见稻荷本殿・千本鸟居・奥社 → 东大寺 → 二月堂 → 林间午餐 → 春日大社 → 大阪住宿",
    rhythm: "移动日轻早起 · 08:05 退房",
    luggage: "大箱已由京都酒店直送大阪酒店；当天只背两晚分装包，不使用伏见或奈良寄存柜",
    schedule: "08:05 退房 · 08:26–08:32 JR · 08:35–10:00 伏见 · 10:32–11:40 JR · 12:05–16:35 奈良 · 18:05–18:25 入住大阪",
    note: "伏见稻荷推迟约 80 分钟，仍只走到奥社奉拜所、不登山。代价是主入口人流会多一些，因此 10:00 准时下山；奈良继续只留东大寺、二月堂、林间午餐与春日大社。",
    transit: "JR 08:26 京都→08:32 稻荷；10:32 稻荷→11:40 奈良；近铁 17:12→17:49 大阪难波",
    tone: "nature",
  },
  {
    date: "10.07",
    day: "周三",
    city: "返程",
    stay: "—",
    title: "留足时间，舒服返沪",
    route: "难波 → 南海电铁 → 关西机场",
    rhythm: "必须早起 · 07:25 / 07:40 离店",
    schedule: "心斋桥 07:25 / 难波 07:40 离店 · 08:00–08:39 Rapi:t · 08:50 航站楼 · 12:00 起飞",
    note: "12:00 国际航班按 08:00 南海 Rapi:t 规划，约 08:50 进入航站楼，保留 3 小时以上。",
    transit: "南海 Rapi:t 08:00→08:39 或空港急行 08:02→08:49；空港急行首班约 05:15",
    tone: "city",
  },
];

const luggagePlans = [
  {
    date: "10.03",
    label: "先换酒店，再开始玩",
    title: "大阪酒店 → 京都酒店 → 岚山",
    body: "08:15 带箱退房，约 09:45 到京都站附近住宿，直接在前台交箱或预办理入住；10:05 后只带日用小包去岚山。全程不把大箱带到景点，也不找车站寄存柜。",
    href: "https://timetable.jr-odekake.net/train-timetable/23671?date=20261003",
    cta: "查看 10:27 JR 班次",
  },
  {
    date: "10.04",
    label: "酒店到酒店前送",
    title: "京都酒店 → 大阪酒店",
    body: "按宅急便官方保守时限，10 月 4 日早上把大箱交给京都酒店前台，写明 10 月 6 日入住的大阪酒店、预订人和电话；随身小包装两晚衣物、药品、证件和贵重物品。",
    href: "https://faq-en.kuronekoyamato.co.jp/app/answers/detail/a_id/6692/",
    cta: "查看宅急便酒店寄送规则",
  },
  {
    date: "订房",
    label: "不满足就换酒店",
    title: "两端都必须有可代收前台",
    body: "京都酒店需接受入住前行李，且能在前台寄出宅急便；大阪酒店需接受住客抵达前的大箱。无前台民宿、Airbnb 或拒绝代收的住宿不适合这套路线。订房后应邮件确认，而不是到现场碰运气。",
    href: "https://faq-en.kuronekoyamato.co.jp/app/answers/detail/a_id/4028/",
    cta: "查看无前台住宿限制",
  },
];

const bookingCards = [
  {
    number: "01",
    urgency: "尽快锁定",
    title: "USJ",
    body: "购买 9 月 30 日日期指定 Studio Pass，并优先选含超级任天堂世界指定入场的 Express Pass；当天仍在 2026 万圣节惊魂夜活动期内。",
    meta: "当天可能早于标示时间开园",
    href: "https://www.usj.co.jp/web/en/us/tickets/express-pass",
    cta: "查看 Express Pass",
  },
  {
    number: "02",
    urgency: "固定日期",
    title: "城阳秋花火",
    body: "10 月 4 日 19:00 起约 40 分钟，JR 长池站步行约 5 分钟。8,000 张预售票，现场不售票；Ticket Pia 网上票 2,500 日元。",
    meta: "雨天照常 · 恶劣天气取消且原则上不退款",
    href: "https://t.pia.jp/pia/event/event.do?eventBundleCd=b2669988",
    cta: "购买烟火票",
  },
  {
    number: "03",
    urgency: "3 人用餐",
    title: "正式餐候选池",
    body: "先比较 8 家 2026 米其林一星和 1 家神户牛专门店，再锁定 1–2 顿。页面已列出日期适配、预算、口碑、特色、预约方式和 3 人用餐条件。",
    meta: "支持 3 人不等于指定日期仍有 3 个余位",
    href: "#eat",
    cta: "比较全部餐厅",
  },
];

const restaurants = [
  {
    city: "KYOTO · 清水五条",
    name: "料理屋まえかわ",
    cuisine: "季节日本料理 · 创作割烹",
    stars: "MICHELIN GUIDE 2026 · 一星",
    status: "原选候选",
    statusTone: "priority",
    when: "10.03 18:30 · 岚山回酒店休息后",
    price: "¥20,000–29,999 / 人",
    rating: "Tabelog 3.80 · 122 条评价",
    party: "3 人可 · 柜台 10 席；二楼包间为 4–8 人",
    reservation: "完全预约制 · 18:30 同时开席 · 2026 年预约以电话为主",
    feature: "祇园名店体系出身，传统技法里加入现代构思；鱼、季节蔬菜和收尾主食的完成度是主要看点。",
    caution: "与岚山日衔接最好，但周六席位紧张；如未订到，可用和ごころ泉替换，不要同晚重复安排。",
    mapHref: "https://www.google.com/maps/search/?api=1&query=%E6%96%99%E7%90%86%E5%B1%8B%E3%81%BE%E3%81%88%E3%81%8B%E3%82%8F%20%E4%BA%AC%E9%83%BD",
    michelinHref: "https://guide.michelin.com/jp/en/kyoto-region/kyoto/restaurant/ryoriya-maekawa",
    reviewHref: "https://tabelog.com/kyoto/A2601/A260201/26034300/",
    bookingHref: "https://ryouriya-maekawa.com/",
  },
  {
    city: "KYOTO · 四条烏丸",
    name: "和ごころ泉",
    cuisine: "京怀石 · 季节料理",
    stars: "MICHELIN GUIDE 2026 · 一星",
    status: "京都备选",
    statusTone: "candidate",
    when: "10.03 晚餐 · 只能替换まえかわ；10.05 周一休息",
    price: "¥20,790 起 / 人",
    rating: "Tabelog 3.81 · 261 条评价",
    party: "3 人可 · 共 24 席；线上资料显示最多可接 10 人",
    reservation: "完全预约制 · OMAKASE JapanEatinerary 可英文申请 · 当前资料标注仅收现金",
    feature: "京都本土怀石脉络清晰，季节器皿、椀物与细腻出汁是重点；比纯法餐更贴合这次偏好的日本料理。",
    caution: "周一休息，因此不适合贵船当晚；最自然的用法是和料理屋まえかわ二选一。",
    mapHref: "https://www.google.com/maps/search/?api=1&query=%E5%92%8C%E3%81%94%E3%81%93%E3%82%8D%E6%B3%89%20%E4%BA%AC%E9%83%BD",
    michelinHref: "https://guide.michelin.com/jp/en/kyoto-region/kyoto/restaurant/wagokoro-izumi",
    reviewHref: "https://tabelog.com/kyoto/A2601/A260201/26002281/",
    bookingHref: "https://omakaseje.com/restaurants/hc541098",
  },
  {
    city: "KYOTO · 祇园",
    name: "鮨割烹なか一",
    cuisine: "寿司 · 割烹",
    stars: "MICHELIN GUIDE 2026 · 一星",
    status: "贵船日晚餐候选",
    statusTone: "recommended",
    when: "10.05 18:30–19:00 · 贵船回酒店短休后",
    price: "直订参考 ¥15,000–19,999；英文代订约 ¥28,000 起",
    rating: "Tabelog 3.58 · 84 条；OMAKASE JE 5.0 · 6 条",
    party: "3 人可 · 35 席；线上申请按餐厅确认",
    reservation: "建议预约 · OMAKASE JapanEatinerary 提供英文支持 · 非即时确认",
    feature: "把寿司与京都割烹结合，风格传统而不局限于纯寿司；祇园位置适合用作京都最后一晚的正式餐。",
    caution: "英文代订渠道明显高于本地参考价；若酒店可协助电话预订，先比较总价再决定。",
    mapHref: "https://www.google.com/maps/search/?api=1&query=%E9%AE%A8%E5%89%B2%E7%83%B9%E3%81%AA%E3%81%8B%E4%B8%80%20%E4%BA%AC%E9%83%BD",
    michelinHref: "https://guide.michelin.com/jp/en/kyoto-region/kyoto/restaurant/sushi-kappo-nakaichi",
    reviewHref: "https://tabelog.com/kyoto/A2601/A260301/26001062/",
    bookingHref: "https://omakaseje.com/restaurants/jz370470",
  },
  {
    city: "KYOTO · 西阵",
    name: "天若",
    cuisine: "天妇罗 · 怀石",
    stars: "MICHELIN GUIDE 2026 · 一星",
    status: "性价比候选",
    statusTone: "recommended",
    when: "10.05 18:00 · 贵船返城后直接前往，时间较紧",
    price: "¥16,500 + 5% 服务费 ≈ ¥17,325 / 人",
    rating: "Tabelog 3.60 · 25 条 · 天妇罗百名店 2025",
    party: "3 人可申请 · 仅 8 席",
    reservation: "TableCheck 预约 · 18:00 同时开席 · 周三休息",
    feature: "天妇罗与小型怀石组合，价位在本轮一星里相对克制，适合想换一种日本料理风格。",
    caution: "贵船预计 17:00–17:30 回到京都站附近，18:00 开席容错低；只有当天返程顺利才建议选。",
    mapHref: "https://www.google.com/maps/search/?api=1&query=%E5%A4%A9%E8%8B%A5%20%E4%BA%AC%E9%83%BD%20%E5%A4%A9%E3%81%B7%E3%82%89",
    michelinHref: "https://guide.michelin.com/jp/en/kyoto-region/kyoto/restaurant/tenjaku",
    reviewHref: "https://tabelog.com/kyoto/A2601/A260202/26034377/",
    bookingHref: "https://www.tablecheck.com/en/shops/tenjaku/reserve",
  },
  {
    city: "KYOTO · 二条城前",
    name: "二条城ふる田",
    cuisine: "日本料理 · 割烹",
    stars: "MICHELIN GUIDE 2026 · 一星",
    status: "时间最稳",
    statusTone: "recommended",
    when: "10.05 19:00–19:30 · 贵船回酒店休息后",
    price: "¥22,000 + 10% 服务费 ≈ ¥24,200 / 人",
    rating: "Tabelog 3.73 · 88 条评价",
    party: "3 人可在线预订 · 7 人以上才需电话",
    reservation: "TableCheck 预约 · 建议提前锁定",
    feature: "以京都季节食材和现代感摆盘为主，位置靠近二条城，贵船回城后时间弹性比 18:00 同时开席的店更好。",
    caution: "价格高于天若，但对行程延误的容错更大；是 10.05 最稳妥的正式晚餐选择。",
    mapHref: "https://www.google.com/maps/search/?api=1&query=%E4%BA%8C%E6%9D%A1%E5%9F%8E%E3%81%B5%E3%82%8B%E7%94%B0%20%E4%BA%AC%E9%83%BD",
    michelinHref: "https://guide.michelin.com/jp/en/kyoto-region/kyoto/restaurant/nijojo-furuta",
    reviewHref: "https://tabelog.com/kyoto/A2601/A260203/26030266/",
    bookingHref: "https://www.tablecheck.com/en/shops/nijyoujyoufuruta/reserve",
  },
  {
    city: "OSAKA · 西天满",
    name: "ぬまた双",
    cuisine: "日本料理 · 割烹",
    stars: "MICHELIN GUIDE 2026 · 一星",
    status: "大阪首选",
    statusTone: "priority",
    when: "10.06 晚餐 · 奈良回大阪入住后；以实际放位时间为准",
    price: "¥22,000 + 5% 服务费 ≈ ¥23,100 / 人",
    rating: "Tabelog 4.04 · 179 条 · 日本料理百名店",
    party: "3 人可 · 普通柜台可订；包间柜台需 4–7 人",
    reservation: "OMAKASE 预约 · 席位少，放位后尽快锁定",
    feature: "口碑数和评分都很强，强调季节感与现场感；适合把最后一晚升级成大阪正式餐。",
    caution: "奈良日预计 18:25 才入住大阪，不要订过早席；若当天只有早场，改选是しん或取消正式餐。",
    mapHref: "https://www.google.com/maps/search/?api=1&query=%E3%81%AC%E3%81%BE%E3%81%9F%E5%8F%8C%20%E5%A4%A7%E9%98%AA",
    michelinHref: "https://guide.michelin.com/jp/en/osaka-region/osaka/restaurant/numata-sou",
    reviewHref: "https://tabelog.com/osaka/A2701/A270101/27124703/",
    bookingHref: "https://omakase.in/ja/r/kl465761",
  },
  {
    city: "OSAKA · 北新地",
    name: "焼鳥市松",
    cuisine: "烧鸟 · 鸡料理",
    stars: "MICHELIN GUIDE 2026 · 一星",
    status: "口碑最稳",
    statusTone: "recommended",
    when: "10.01 18:30 · USJ 后恢复日；需提前结束电电城",
    price: "¥14,500；含 5 杯搭配约 ¥20,000 / 人",
    rating: "Tabelog 4.01 · 821 条 · Bronze",
    party: "3 人可 · 共 13 席",
    reservation: "OMAKASE 预约 · 当前页面已开放至 2026.10.31",
    feature: "本轮唯一烧鸟一星，评价基数远高于其他候选，价位也较温和；能明显拉开与两顿怀石的风格差异。",
    caution: "选择这家就把 10.01 的电电城缩短或取消，17:40 左右从酒店出发，不要在恢复日继续硬塞景点。",
    mapHref: "https://www.google.com/maps/search/?api=1&query=%E7%84%BC%E9%B3%A5%E5%B8%82%E6%9D%BE%20%E5%A4%A7%E9%98%AA",
    michelinHref: "https://guide.michelin.com/jp/en/osaka-region/osaka/restaurant/yakitori-ichimatsu",
    reviewHref: "https://tabelog.com/osaka/A2701/A270101/27016600/",
    bookingHref: "https://omakase.in/r/ib508202",
  },
  {
    city: "OSAKA · 西天满",
    name: "是しん",
    cuisine: "日本料理 · 割烹",
    stars: "MICHELIN GUIDE 2026 · 一星",
    status: "大阪稳妥备选",
    statusTone: "candidate",
    when: "10.06 19:30 左右 · 奈良回大阪入住后",
    price: "¥26,620 / 人 · 含税与服务费",
    rating: "Tabelog 约 3.90 · 约 410 条 · Bronze",
    party: "3 人可在线预订 · 13 人以上才需电话",
    reservation: "TableCheck 预约 · 当前资料标注仅收现金",
    feature: "菜式稳健、评论量大，西天满位置适合从难波入住后前往；预约流程对外国游客相对清晰。",
    caution: "预算是大阪候选中最高，且需准备现金；优势是时间选择通常比小型同时开席店更容易匹配。",
    mapHref: "https://www.google.com/maps/search/?api=1&query=%E6%98%AF%E3%81%97%E3%82%93%20%E5%A4%A7%E9%98%AA",
    michelinHref: "https://guide.michelin.com/jp/en/osaka-region/osaka/restaurant/zeshin",
    reviewHref: "https://tabelog.com/osaka/A2701/A270101/27098799/",
    bookingHref: "https://www.tablecheck.com/en/shops/zeshin/reserve",
  },
  {
    city: "KOBE · 三宫",
    name: "Mouriya Honten",
    cuisine: "神户牛 · 铁板烧",
    stars: "神户牛专项候选 · 非本轮一星筛选",
    status: "神户日候选",
    statusTone: "candidate",
    when: "10.02 14:00 · 北野下坡到三宫后",
    price: "约 ¥10,000 起 / 人；部分渠道另收 10% 服务费",
    rating: "Google Maps 4.6 · 约 1,800 条评价",
    party: "3 人明确可订 · 官网成人数量支持 1–6 人",
    reservation: "官网可预约 · 多语言页面与礼宾支持",
    feature: "神户牛主题最贴合当天城市体验，三宫本店从北野顺坡而下即可到，午餐后继续去港区。",
    caution: "它不是本轮米其林一星候选；若正式餐只选 1–2 顿，可先在它与大阪／京都一星餐厅之间做预算取舍。",
    mapHref: "https://www.google.com/maps/search/?api=1&query=Mouriya%20Honten%20Kobe",
    reviewHref: "https://www.google.com/maps/search/?api=1&query=Mouriya%20Honten%20Kobe",
    bookingHref: "https://www.mouriya.co.jp/en/reserve",
  },
];

const referenceReview = [
  {
    status: "吸收",
    tone: "adopt",
    title: "哲学之道保留为完整半日",
    body: "Google Maps 上哲学之道与南禅寺评价稳定且地理连续；只保留这条北东山主线，不再叠加银阁寺、法然院、永观堂、蹴上、八坂神社与祇园。",
  },
  {
    status: "取舍",
    tone: "skip",
    title: "神户和岚山同时保留，但各自删到核心",
    body: "10 月 2 日保留神户布引、北野和港区；10 月 3 日先把行李交给京都酒店，再轻装往返岚山。竹林只短停，天龙寺庭园与渡月桥才是主体验。",
  },
  {
    status: "保留",
    tone: "keep",
    title: "贵船作为京都自然主线",
    body: "贵船神社本宫是不可删除项。默认由贵船口搭巴士直达三社；鞍马翻山只是晴天且体力充足时的加码，不再反客为主。",
  },
  {
    status: "不照搬",
    tone: "skip",
    title: "删掉评价不错但功能重复的点",
    body: "东福寺、永观堂、宇治上神社并不是不值得去，而是在本次日期里分别与伏见稻荷、南禅寺、平等院功能重叠；删减依据是路线与体力，不只看评分。",
  },
  {
    status: "顺移",
    tone: "move",
    title: "伏见稻荷顺移到奈良当天",
    body: "10 月 6 日清晨先走伏见稻荷本殿、千本鸟居与奥社短线，再沿 JR 奈良线南下。这样既完整保留伏见，也不会挤压 10 月 4 日的烟火候场。",
  },
  {
    status: "调整住宿",
    tone: "keep",
    title: "京都仍住 3 晚",
    body: "10.03 岚山结束后入住、10.06 退房；哲学之道与宇治烟火合并为一日，10.05 单独留给贵船。",
  },
];

const practical = [
  ["住宿", "9.29–10.03 大阪难波／心斋桥 4 晚；10.03–10.06 京都站 3 晚；10.06 最后一晚回难波。"],
  ["行李", "10.03 箱子随人只走大阪酒店→京都酒店，交前台后再去岚山；10.04 大箱由京都酒店前送大阪酒店，10.06 伏见与奈良全程只背两晚分装包。"],
  ["交通", "关西内部使用 ICOCA 加单独购票即可，一般不需要全国 JR Pass；京都优先坐铁路而不是挤巴士。"],
  ["取舍", "神户、岚山与伏见稻荷都保留；删除东福寺、银阁寺及东山重复寺社。10 月 4 日只走哲学之道、南禅寺、宇治核心和固定烟火。"],
  ["天气", "9 月末仍可能受台风和阵雨影响。贵船下雨仍直达神社；神户大风取消布引缆车；岚山下雨缩短竹林与河岸停留。"],
];

export default function Home() {
  return (
    <main id="top">
      <header className="hero">
        <nav className="nav shell" aria-label="页面导航">
          <a className="brand" href="#top" aria-label="返回顶部">
            <span className="brand-mark">关</span>
            <span>KANSAI 2026</span>
          </a>
          <div className="nav-menu">
            <a href="#journey">旅程动画</a>
            <a href="#map">线路地图</a>
            <a href="#route">逐日路线</a>
            <a href="#reference">文档复盘</a>
            <a href="#book">订票</a>
            <a href="#eat">餐厅</a>
          </div>
        </nav>

        <div className="hero-content shell">
          <p className="eyebrow">2026 · 国庆关西旅行手册</p>
          <h1>九日关西，<br />沿山林与烟火前行。</h1>
          <p className="hero-copy">
            先在大阪住稳、玩完 USJ 后留一天慢下来，再走进神户山海、岚山、京都北山与奈良古林，
            最后回到大阪，用一场秋日烟火串起整段旅程。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#route">开始阅读</a>
            <span className="trip-date">09.29 — 10.07</span>
          </div>
        </div>

        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="sun-disc" aria-hidden="true">関西</div>
      </header>

      <section className="overview shell" aria-label="行程概览">
        <article>
          <span>住宿节奏</span>
          <strong>大阪 4晚 · 京都 3晚 · 大阪 1晚</strong>
        </article>
        <article>
          <span>路线基调</span>
          <strong>自然徒步 + 城市散步</strong>
        </article>
        <article>
          <span>固定锚点</span>
          <strong>USJ · 神户 · 岚山 · 哲学之道 · 贵船 · 伏见 · 烟火</strong>
        </article>
      </section>

      <JourneyPlayer />

      <section className="luggage-plan shell" aria-labelledby="luggage-title">
        <div className="luggage-plan-heading">
          <div>
            <p className="eyebrow dark">LUGGAGE FIRST</p>
            <span className="section-note">两次换宿 · 零次带大箱游览</span>
          </div>
          <div>
            <h2 id="luggage-title">箱子先到位，<br />人再轻装出发。</h2>
            <p>10 月 3 日先完成大阪酒店到京都酒店的物理迁移；10 月 6 日因伏见、奈良位于南下顺路方向，改由酒店前台提前把大箱送到大阪，避免当天先绕大阪再折返。</p>
          </div>
        </div>
        <div className="luggage-plan-grid">
          {luggagePlans.map((item) => (
            <article key={item.date}>
              <span>{item.date}</span>
              <small>{item.label}</small>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <a href={item.href} target="_blank" rel="noreferrer">{item.cta} ↗</a>
            </article>
          ))}
        </div>
      </section>

      <section className="map-section shell" id="map" aria-labelledby="map-title">
        <div className="map-heading">
          <div>
            <p className="eyebrow dark">ROUTE MAP</p>
            <span className="section-note">按日期筛选 · 相邻两点 Google Maps 导航</span>
          </div>
          <h2 id="map-title">真实地图，<br />一眼看清是否顺路。</h2>
        </div>

        <TripMap />
      </section>

      <section className="route shell" id="route">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">THE ROUTE</p>
            <span className="section-note">按 2026 年日期安排</span>
          </div>
          <h2>大阪起收，<br />串起神户、京都与奈良。</h2>
        </div>
        <div className="timeline">
          {days.map((item, index) => (
            <article className={`timeline-card tone-${item.tone}`} key={item.date}>
              <div className="timeline-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="timeline-date">
                <strong>{item.date}</strong>
                <span>{item.day} · {item.city}</span>
                <em>住 {item.stay}</em>
              </div>
              <div className="timeline-copy">
                <h3>{item.title}</h3>
                <p className="route-line">{item.route}</p>
                {item.luggage && <p className="transit-line"><span>行李</span>{item.luggage}</p>}
                <p className="transit-line"><span>作息</span>{item.rhythm}</p>
                <p className="transit-line"><span>建议时间</span>{item.schedule}</p>
                <p className="transit-line"><span>交通摘要</span>{item.transit}</p>
                <p>{item.note}</p>
                {index === 0 && (
                  <a className="day-detail-link" href={dayOneHref}>
                    打开第一天手账 <span>↗</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="reference-review shell" id="reference" aria-labelledby="reference-title">
        <div className="reference-intro">
          <div>
            <p className="eyebrow dark">REFERENCE REVIEW</p>
            <span className="section-note">对照用户提供的 2025 京都行程</span>
          </div>
          <div>
            <h2 id="reference-title">参考旧行程，<br />但不被它绑住。</h2>
            <p>飞书文档的价值在于区域内的细顺序；新版结合 Google Maps 评价量、近期游记中的拥挤反馈与真实移动成本，保留高价值主线，并为岚山、哲学之道、贵船和固定烟火重新分配京都住宿。</p>
          </div>
        </div>
        <div className="reference-grid">
          {referenceReview.map((item) => (
            <article className={`reference-card status-${item.tone}`} key={item.title}>
              <span>{item.status}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="feature" aria-labelledby="fireworks-title">
        <div className="feature-grid shell">
          <div className="feature-visual" aria-hidden="true">
            <div className="firework firework-a" />
            <div className="firework firework-b" />
            <div className="feature-date">10.04</div>
          </div>
          <div className="feature-copy">
            <p className="eyebrow">THE FIREWORKS</p>
            <h2 id="fireworks-title">城阳秋花火，<br />是这趟旅行的时间锚点。</h2>
            <p>
              19:00 起约 40 分钟。会场距离 JR 长池站约 5 分钟步行，
              下午从宇治去会场最顺；上午只保留哲学之道与南禅寺，伏见稻荷顺移到 10 月 6 日清晨，为候场和散场保留体力。
            </p>
            <div className="feature-stats">
              <span><strong>8,000</strong>张限定预售</span>
              <span><strong>40</strong>分钟烟火</span>
              <span><strong>¥2,500</strong>网上票</span>
            </div>
            <a className="text-link light" href="https://www.city.joyo.kyoto.jp/joint/0000012600.html" target="_blank" rel="noreferrer">
              阅读城阳市官方说明 <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="booking shell" id="book">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow dark">BOOK FIRST</p>
            <span className="section-note">建议按编号顺序处理</span>
          </div>
          <h2>先锁定两张票，<br />再订一顿正式餐。</h2>
        </div>
        <div className="booking-grid">
          {bookingCards.map((card) => (
            <article className="booking-card" key={card.number}>
              <div className="booking-top">
                <span className="booking-number">{card.number}</span>
                <span className="urgency">{card.urgency}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <small>{card.meta}</small>
              <a className="text-link" href={card.href} {...(!card.href.startsWith("#") ? { target: "_blank", rel: "noreferrer" } : {})}>
                {card.cta} <span>{card.href.startsWith("#") ? "↓" : "↗"}</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="dining" id="eat">
        <div className="shell">
          <div className="dining-heading">
            <p className="eyebrow">DINING SHORTLIST · 3 GUESTS</p>
            <h2>先把候选摆齐，<br />再决定哪一两顿值得订。</h2>
            <p>当前共 9 家：8 家《京都・大阪米其林指南 2026》一星，加 1 家神户牛专门店。均具备接待 3 人的席位或预约规则，但“支持 3 人”不等于指定日期尚有 3 个余位；资料核对于 2026 年 9 月 3 日。</p>
          </div>
          <div className="dining-summary" aria-label="餐厅候选摘要">
            <span><strong>9</strong>家候选</span>
            <span><strong>8</strong>家 2026 一星</span>
            <span><strong>3</strong>人用餐</span>
            <span><strong>1–2</strong>顿最终锁定</span>
          </div>
          <div className="restaurant-list">
            {restaurants.map((restaurant) => (
              <article className={`restaurant restaurant-${restaurant.statusTone}`} key={restaurant.name}>
                <div className="restaurant-title-block">
                  <span className="restaurant-city">{restaurant.city}</span>
                  <h3>{restaurant.name}</h3>
                  <p>{restaurant.cuisine}</p>
                  <strong>{restaurant.stars}</strong>
                  <em>{restaurant.status}</em>
                </div>
                <div className="restaurant-detail">
                  <dl className="restaurant-facts">
                    <div><dt>适合哪天</dt><dd>{restaurant.when}</dd></div>
                    <div><dt>价格预算</dt><dd>{restaurant.price}</dd></div>
                    <div><dt>评分评价</dt><dd>{restaurant.rating}</dd></div>
                    <div><dt>3 人用餐</dt><dd>{restaurant.party}</dd></div>
                    <div className="wide"><dt>预约要求</dt><dd>{restaurant.reservation}</dd></div>
                  </dl>
                  <p className="restaurant-feature"><b>特色</b>{restaurant.feature}</p>
                  <p className="restaurant-caution"><b>怎么判断</b>{restaurant.caution}</p>
                  <div className="restaurant-actions">
                    <a href={restaurant.mapHref} target="_blank" rel="noreferrer">Google Maps ↗</a>
                    {restaurant.michelinHref && <a href={restaurant.michelinHref} target="_blank" rel="noreferrer">米其林页面 ↗</a>}
                    <a href={restaurant.reviewHref} target="_blank" rel="noreferrer">评价详情 ↗</a>
                    <a className="restaurant-book" href={restaurant.bookingHref} target="_blank" rel="noreferrer">预约入口 ↗</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="detours shell" aria-labelledby="detours-title">
        <div className="detours-copy">
          <p className="eyebrow dark">ANIME DETOURS</p>
          <h2 id="detours-title">动漫打卡，<br />只加顺路的。</h2>
          <p>不为了打卡横跨城市，把几个最自然的场景嵌入原本路线。</p>
        </div>
        <div className="detour-list">
          <article>
            <span>宇治</span>
            <h3>《吹响吧！上低音号》</h3>
            <p>宇治桥、朝雾桥、宇治川沿岸和“久美子长椅”，与平等院完全顺路。</p>
          </article>
          <article>
            <span>出町柳</span>
            <h3>《玉子市场》</h3>
            <p>贵船回程经过出町桝形商店街，再走到鸭川跳石，不额外换乘。</p>
          </article>
          <article>
            <span>京都北部</span>
            <h3>《四叠半神话大系》</h3>
            <p>鸭川、下鸭神社和出町柳一带，本身也是傍晚散步的好路线。</p>
          </article>
          <article>
            <span>大阪</span>
            <h3>日本桥电电城</h3>
            <p>安排在 USJ 后的轻松大阪日，慢慢逛模型、游戏与周边店，再步行回难波。</p>
          </article>
        </div>
      </section>

      <section className="practical shell" aria-labelledby="practical-title">
        <div className="practical-title">
          <p className="eyebrow dark">GOOD TO KNOW</p>
          <h2 id="practical-title">让路线保持松弛的五件事。</h2>
        </div>
        <div className="practical-list">
          {practical.map(([title, body], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sources shell" aria-labelledby="source-title">
        <p className="eyebrow dark">OFFICIAL LINKS</p>
        <h2 id="source-title">出发前，再看一眼最新状态。</h2>
        <div className="source-links">
          <a href="https://www.usj.co.jp/web/en/us/park-guide/schedule/park-hour" target="_blank" rel="noreferrer">USJ 营业时间 ↗</a>
          <a href="https://www.city.joyo.kyoto.jp/joint/0000012600.html" target="_blank" rel="noreferrer">城阳秋花火官方说明 ↗</a>
          <a href="https://kifunejinja.jp/" target="_blank" rel="noreferrer">贵船神社 ↗</a>
          <a href="https://www.tenryuji.com/en/visit/index.html" target="_blank" rel="noreferrer">天龙寺开放时间 ↗</a>
          <a href="https://global.kyoto.travel/en/comfort/" target="_blank" rel="noreferrer">京都官方拥挤预测 ↗</a>
          <a href="https://inari.jp/en/access/" target="_blank" rel="noreferrer">伏见稻荷大社交通 ↗</a>
          <a href="https://nanzenji.or.jp/about_rinzaishu/visit" target="_blank" rel="noreferrer">南禅寺开放时间 ↗</a>
          <a href="https://www.kobeherb.com/en/" target="_blank" rel="noreferrer">神户布引香草园 ↗</a>
          <a href="https://faq-en.kuronekoyamato.co.jp/app/answers/detail/a_id/6692/" target="_blank" rel="noreferrer">宅急便酒店到酒店行李规则 ↗</a>
          <a href="https://www.pref.nara.lg.jp/site/park/2587.html" target="_blank" rel="noreferrer">春日山原始林 ↗</a>
          <a href="https://guide.michelin.com/jp/ja/kyoto-region/kyoto/restaurants" target="_blank" rel="noreferrer">MICHELIN 京都餐厅 ↗</a>
          <a href="https://guide.michelin.com/jp/ja/osaka-region/osaka/restaurants" target="_blank" rel="noreferrer">MICHELIN 大阪餐厅 ↗</a>
        </div>
      </section>

      <footer>
        <div className="shell footer-inner">
          <div>
            <span className="brand footer-brand"><span className="brand-mark">关</span> KANSAI 2026</span>
            <p>愿你在山林、街巷与烟火之间，留出一点从容。</p>
          </div>
          <a href="#top">回到顶部 ↑</a>
        </div>
      </footer>
    </main>
  );
}
