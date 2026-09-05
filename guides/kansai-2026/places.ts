import type { GuideMapConfig, Place } from "@/app/guide-core/types";

const spots: Place[] = [
  { id: "kix", name: "关西国际机场", area: "kansai", category: "spot", position: [34.4359, 135.2435], dates: ["09.29", "10.07"], meta: "抵达 / 返程", googleQuery: "Kansai International Airport" },
  { id: "osaka-stay", name: "大阪住宿 · 难波 / 心斋桥", area: "osaka", category: "stay", position: [34.6676, 135.5012], dates: ["09.29", "09.30", "10.01", "10.02", "10.06", "10.07"], meta: "前段 4 晚 · 最后一晚再住大阪", googleQuery: "Namba Osaka" },
  { id: "kyoto-stay", name: "京都住宿 · 京都站附近", area: "kyoto", category: "stay", position: [34.9858, 135.7588], dates: ["10.03", "10.04", "10.05", "10.06"], meta: "10.03–10.06 · 3 晚", googleQuery: "Kyoto Station" },

  { id: "shinsaibashi", name: "心斋桥筋", area: "osaka", category: "spot", position: [34.6748, 135.5012], dates: ["09.29", "10.06"], meta: "首晚必到 · 最后一晚可补购物", googleQuery: "Shinsaibashi-suji Shopping Street Osaka" },
  { id: "dotonbori", name: "道顿堀", area: "osaka", category: "spot", position: [34.6687, 135.5013], dates: ["09.29", "10.06"], meta: "夜景与美食街", googleQuery: "Dotonbori Osaka" },
  { id: "hozenji", name: "法善寺横丁", area: "osaka", category: "spot", position: [34.6676, 135.5027], dates: ["09.29", "10.06"], meta: "道顿堀旁的石板小巷", googleQuery: "Hozenji Yokocho Osaka" },
  { id: "usj", name: "USJ", area: "osaka", category: "spot", position: [34.6656, 135.4325], dates: ["09.30"], meta: "07:15 到闸口 · 官方 08:00–22:00", googleQuery: "Universal Studios Japan" },
  { id: "kuromon", name: "黑门市场", area: "osaka", category: "spot", position: [34.6654, 135.5064], dates: ["10.01"], meta: "10:45–12:00 早午餐", googleQuery: "Kuromon Ichiba Market Osaka" },
  { id: "shitennoji", name: "四天王寺", area: "osaka", category: "spot", position: [34.6545, 135.5165], dates: ["10.01"], meta: "12:35–14:05 · 安静古寺", googleQuery: "Shitennoji Temple Osaka" },
  { id: "tennoji-park", name: "天王寺公园 · 慶泽园", area: "osaka", category: "spot", position: [34.651, 135.5107], dates: ["10.01"], meta: "14:20–15:30 · 松弛散步", googleQuery: "Keitakuen Garden Osaka" },
  { id: "shinsekai", name: "新世界 · 通天阁", area: "osaka", category: "spot", position: [34.6525, 135.5063], dates: ["10.01"], meta: "街景、炸串，可不上塔", googleQuery: "Tsutenkaku Shinsekai Osaka" },
  { id: "den-den-town", name: "日本桥电电城", area: "osaka", category: "spot", position: [34.6592, 135.5062], dates: ["10.01"], meta: "动漫、电器与模型店", googleQuery: "Nipponbashi Denden Town Osaka" },

  { id: "nunobiki", name: "布引香草园 · 缆车", area: "kobe", category: "spot", position: [34.7179, 135.1903], dates: ["10.02"], meta: "11:15–12:45 · 神户自然主线", googleQuery: "Kobe Nunobiki Herb Gardens", guide: "Google Maps 4.5 · 约 6,200 条评价", fit: "山景与花园是神户日的主要体验；遇强风停运则直接去北野。", official: "https://www.kobeherb.com/en/" },
  { id: "kitano", name: "北野异人馆街", area: "kobe", category: "spot", position: [34.7008, 135.1897], dates: ["10.02"], meta: "从山侧顺坡下行", googleQuery: "Kitano Ijinkan-Gai Kobe" },
  { id: "meriken", name: "美利坚公园", area: "kobe", category: "spot", position: [34.6826, 135.1871], dates: ["10.02"], meta: "港口散步与地标建筑", googleQuery: "Meriken Park Kobe" },
  { id: "harborland", name: "神户 Harborland", area: "kobe", category: "spot", position: [34.6796, 135.1789], dates: ["10.02"], meta: "看日落后回大阪", googleQuery: "Kobe Harborland" },

  { id: "arashiyama-bamboo", name: "岚山竹林小径", area: "kyoto", category: "spot", position: [35.017, 135.6713], dates: ["10.03"], meta: "10:55–11:25 · 只留 30 分钟", googleQuery: "Arashiyama Bamboo Forest Kyoto", guide: "Google Maps 4.4 · 约 2.4 万条评价", fit: "先把行李交给京都酒店再来；午前客流会比清晨多，因此拍照后即走，不把它当半日主景点。" },
  { id: "tenryuji", name: "天龙寺庭园", area: "kyoto", category: "spot", position: [35.0158, 135.6738], dates: ["10.03"], meta: "08:30 开门 · 岚山主景点", googleQuery: "Tenryu-ji Kyoto", guide: "Google Maps 4.5 · 约 1.7 万条评价", fit: "庭园体验比竹林更完整，且可从北门自然衔接竹林。", official: "https://www.tenryuji.com/en/visit/index.html" },
  { id: "togetsukyo", name: "渡月桥・桂川", area: "kyoto", category: "spot", position: [35.0135, 135.6778], dates: ["10.03"], meta: "河岸休息 · 看山景", googleQuery: "Togetsukyo Bridge Kyoto", guide: "Google Maps 4.5", fit: "与天龙寺同一核心区，作为午后低强度收尾，不追加猴子公园爬坡。" },

  { id: "philosopher", name: "哲学之道", area: "kyoto", category: "spot", position: [35.0202, 135.7958], dates: ["10.04"], meta: "不可删除 · 09:45–10:55", googleQuery: "Philosopher's Path Kyoto", guide: "Google Maps 4.6", fit: "本次京都硬约束；约 2 公里，预留 60–75 分钟而不是当作景点间通道。" },
  { id: "nanzenji", name: "南禅寺 · 水路阁", area: "kyoto", category: "spot", position: [35.0114, 135.793], dates: ["10.04"], meta: "11:45 前离开", googleQuery: "Nanzenji Temple Suirokaku Kyoto", guide: "Google Maps 4.5 · 约 1.3 万条评价", fit: "直接承接哲学之道，结束后转往宇治。", official: "https://nanzenji.or.jp/about_rinzaishu/visit" },

  { id: "byodoin", name: "平等院", area: "kyoto", category: "spot", position: [34.8893, 135.8077], dates: ["10.04"], meta: "只看庭园与博物馆", googleQuery: "Byodoin Temple Uji", guide: "Google Maps 4.5 · 约 2.2 万条评价", fit: "宇治最值得保留的核心景点；烟火日不等待凤凰堂内部参观。", official: "https://www.byodoin.or.jp/en/guide/" },
  { id: "uji-river", name: "宇治川 · 朝雾桥", area: "kyoto", category: "spot", position: [34.8917, 135.8101], dates: ["10.04"], meta: "河岸散步", googleQuery: "Asagiri Bridge Uji" },
  { id: "joyo", name: "城阳秋花火", area: "kyoto", category: "spot", position: [34.8445, 135.7972], dates: ["10.04"], meta: "19:00 开始 · JR 长池站步行约 5 分钟", googleQuery: "Kizugawa Athletic Park Joyo Kyoto" },

  { id: "kifune", name: "贵船神社 本宫", area: "kyoto", category: "spot", position: [35.1219, 135.7629], dates: ["10.05"], meta: "不可删除 · 10:45–11:30", googleQuery: "Kifune Shrine Kyoto", guide: "Google Maps 4.5 · 约 1.2 万条评价", fit: "本次旅行的自然与神社硬约束；雨天也改乘巴士直达，不取消。", official: "https://kifunejinja.jp/en/info/" },
  { id: "kifune-okumiya", name: "贵船神社 奥宫", area: "kyoto", category: "spot", position: [35.1262, 135.7621], dates: ["10.05"], meta: "三社参拜 · 林间最深处", googleQuery: "Kifune Shrine Okumiya Kyoto", guide: "Google Maps 4.5 · 约 2,900 条评价", fit: "从本宫沿河缓坡前往，保留完整贵船体验。" },
  { id: "kifune-yui", name: "贵船神社 结社", area: "kyoto", category: "spot", position: [35.1241, 135.7624], dates: ["10.05"], meta: "三社参拜收尾", googleQuery: "Kifune Shrine Yui no Yashiro Kyoto", guide: "Google Maps 4.4 · 约 600 条评价", fit: "奥宫返回本宫方向时顺路停靠，不额外跨区。" },

  { id: "fushimi-inari", name: "伏见稻荷大社 · 千本鸟居", area: "kyoto", category: "spot", position: [34.9671, 135.7727], dates: ["10.06"], meta: "不可删除 · 08:35–10:00 短线", googleQuery: "Fushimi Inari Taisha Kyoto", guide: "Google Maps 4.6 · 约 8.6 万条评价", fit: "为保护睡眠接受稍多客流，走本殿、千本鸟居与奥社短线；不登稻荷山，之后沿 JR 奈良线去奈良。", official: "https://inari.jp/en/access/" },
  { id: "todaiji", name: "东大寺 · 大佛殿", area: "nara", category: "spot", position: [34.689, 135.8398], dates: ["10.06"], meta: "预留 90–120 分钟", googleQuery: "Todai-ji Daibutsuden Nara", guide: "Google Maps 4.7 · 约 3 万条评价", fit: "奈良不可替代的核心景点，不能压缩成拍照停留。", official: "https://www.todaiji.or.jp/en/information/haikan/" },
  { id: "nigatsudo", name: "二月堂", area: "nara", category: "spot", position: [34.6894, 135.8454], dates: ["10.06"], meta: "东大寺后顺路登高", googleQuery: "Nigatsudo Nara", guide: "Google Maps 4.6 · 约 3,300 条评价", fit: "距离东大寺近，视野与氛围回报高。" },
  { id: "kasuga", name: "春日大社", area: "nara", category: "spot", position: [34.6814, 135.8484], dates: ["10.06"], meta: "石灯笼与林间参道", googleQuery: "Kasuga Taisha Nara", guide: "Google Maps 4.5 · 约 1.5 万条评价", fit: "与奈良公园林间路线连续，结束后坐巴士回站。", official: "https://www.kasugataisha.or.jp/en/about_en/basic/" },
];

const restaurantPoints: Place[] = [
  { id: "ajinoya", name: "Ajinoya Honten", area: "osaka", category: "restaurant", position: [34.668065, 135.500976], dates: ["09.29", "10.01", "10.06"], meta: "大阪烧 · ¥1,000–2,000", googleQuery: "Namba Okonomiyaki Ajinoya Honten", guide: "Google Maps 4.2 · 3,937 条评价", fit: "道顿堀旁，适合首晚或大阪收尾；热门时段可能排队。", fitLevel: "顺路", official: "https://ajinoya-okonomiyaki.com/" },
  { id: "wanaka", name: "たこ焼道楽わなか 千日前本店", area: "osaka", category: "restaurant", position: [34.66521, 135.503402], dates: ["10.01", "10.06"], meta: "章鱼烧 · ¥1–1,000", googleQuery: "Takoyaki Wanaka Sennichimae Osaka", guide: "Google Maps 4.3 · 4,365 条评价", fit: "电电城走回难波时顺手吃，不占一顿正式正餐。", fitLevel: "顺路", official: "https://takoyaki-wanaka.com/" },
  { id: "rikimaru", name: "焼肉力丸 なんば千日前店", area: "osaka", category: "restaurant", position: [34.6669, 135.5038], dates: ["09.29", "10.01", "10.06"], meta: "烧肉 · ¥4,000–6,000", googleQuery: "Yakiniku Rikimaru Sennichimae Osaka", guide: "Google Maps 4.8 · 16,590 条评价", fit: "难波核心区、评论量大；想轻松吃烧肉时比长套餐更灵活。", fitLevel: "备选", official: "https://handafood.jp/rikimaru/" },
  { id: "mouriya", name: "モーリヤ本店 / Mouriya Honten", area: "kobe", category: "restaurant", position: [34.693119, 135.191193], dates: ["10.02"], meta: "神户牛排 · ¥10,000+", googleQuery: "Mouriya Honten Kobe", guide: "Google Maps 4.6 · 约 1,800 条评价", fit: "北野下坡到三宫后最顺路，作为本次第 2 顿可预约正餐。", fitLevel: "预订型", official: "https://www.mouriya.co.jp/en/head" },
  { id: "katsukura", name: "名代とんかつ かつくら 三条本店", area: "kyoto", category: "restaurant", position: [35.0086, 135.7675], dates: ["10.03", "10.05"], meta: "炸猪排 · ¥2,000–3,000", googleQuery: "Katsukura Tonkatsu Sanjo Main Store", guide: "Google Maps 4.5 · 2,339 条评价", fit: "岚山或贵船回城后的高评论量晚餐备选，不要求长套餐。", fitLevel: "备选", official: "https://www.katsukura.jp/" },
  { id: "maekawa", name: "料理屋まえかわ", area: "kyoto", category: "restaurant", position: [34.998689, 135.767871], dates: ["10.03"], meta: "米其林一星 · ¥20,000–29,999 · 3 人可", googleQuery: "料理屋まえかわ 京都", guide: "Tabelog 3.80 · 122 条评价", fit: "10.03 原选候选；15:30 左右回到京都酒店，休息后赴 18:30 固定晚餐。", fitLevel: "预订型", official: "https://ryouriya-maekawa.com/" },
  { id: "wagokoro-izumi", name: "和ごころ泉", area: "kyoto", category: "restaurant", position: [35.000922, 135.76047], dates: ["10.03"], meta: "米其林一星 · ¥20,790 起 · 3 人可", googleQuery: "和ごころ泉 京都", guide: "Tabelog 3.81 · 261 条评价", fit: "10.03 只能作为料理屋まえかわ的替换项；10.05 周一休息。", fitLevel: "预订型", official: "https://omakaseje.com/restaurants/hc541098" },
  { id: "nakaichi", name: "鮨割烹なか一", area: "kyoto", category: "restaurant", position: [35.002323, 135.776468], dates: ["10.05"], meta: "米其林一星 · 寿司割烹 · 3 人可", googleQuery: "鮨割烹なか一 京都", guide: "Tabelog 3.58 · 84 条评价", fit: "贵船回酒店短休后的 18:30–19:00 晚餐候选；英文代订价格需和本地直订比较。", fitLevel: "预订型", official: "https://omakaseje.com/restaurants/jz370470" },
  { id: "tenjaku", name: "天若", area: "kyoto", category: "restaurant", position: [35.031403, 135.741907], dates: ["10.05"], meta: "米其林一星 · 约 ¥17,325 · 3 人可申请", googleQuery: "天若 京都 天ぷら", guide: "Tabelog 3.60 · 天妇罗百名店 2025", fit: "18:00 同时开席，贵船返城后时间较紧；只有返程顺利才建议选。", fitLevel: "预订型", official: "https://www.tablecheck.com/en/shops/tenjaku/reserve" },
  { id: "nijojo-furuta", name: "二条城ふる田", area: "kyoto", category: "restaurant", position: [35.012209, 135.753872], dates: ["10.05"], meta: "米其林一星 · 约 ¥24,200 · 3 人可", googleQuery: "二条城ふる田 京都", guide: "Tabelog 3.73 · 88 条评价", fit: "建议 19:00–19:30；贵船回酒店休息后再前往，是 10.05 时间容错最大的正式餐。", fitLevel: "预订型", official: "https://www.tablecheck.com/en/shops/nijyoujyoufuruta/reserve" },
  { id: "numata-sou", name: "ぬまた双", area: "osaka", category: "restaurant", position: [34.696668, 135.503786], dates: ["10.06"], meta: "米其林一星 · 约 ¥23,100 · 3 人可", googleQuery: "ぬまた双 大阪", guide: "Tabelog 4.04 · 179 条评价", fit: "奈良回大阪入住后的首选；不要订过早席，以实际放位和 3 人余位为准。", fitLevel: "预订型", official: "https://omakase.in/ja/r/kl465761" },
  { id: "ichimatsu", name: "焼鳥市松", area: "osaka", category: "restaurant", position: [34.695938, 135.49702], dates: ["10.01"], meta: "米其林一星 · ¥14,500 起 · 3 人可", googleQuery: "焼鳥市松 大阪", guide: "Tabelog 4.01 · 821 条 · Bronze", fit: "10.01 18:30 候选；选择后需提前结束或取消电电城，保住 USJ 次日的恢复节奏。", fitLevel: "预订型", official: "https://omakase.in/r/ib508202" },
  { id: "zeshin", name: "是しん", area: "osaka", category: "restaurant", position: [34.696365, 135.502426], dates: ["10.06"], meta: "米其林一星 · ¥26,620 · 3 人可", googleQuery: "是しん 大阪", guide: "Tabelog 约 3.90 · 约 410 条 · Bronze", fit: "建议 19:30 左右；预约流程清晰但预算较高，当前资料标注仅收现金。", fitLevel: "预订型", official: "https://www.tablecheck.com/en/shops/zeshin/reserve" },
  { id: "nakamura-uji", name: "中村藤吉 平等院店", area: "kyoto", category: "restaurant", position: [34.891473, 135.80664], dates: ["10.04"], meta: "茶餐与甜品 · ¥1,000–2,000", googleQuery: "Nakamura Tokichi Byodoin Uji", guide: "Google Maps 4.3 · 2,352 条评价", fit: "平等院表参道上，去宇治川前休息；排队长就外带。", fitLevel: "顺路", official: "https://www.tokichi.jp/" },
  { id: "mizuya", name: "水谷茶屋", area: "nara", category: "restaurant", position: [34.683491, 135.846791], dates: ["10.06"], meta: "日式简餐 · ¥1,000–2,000", googleQuery: "Mizuya Chaya Nara", guide: "Google Maps 4.7 · 1,244 条评价", fit: "春日大社林间路线旁，景观和顺路程度都很好。", fitLevel: "顺路" },
  { id: "maguro-koya", name: "まぐろ小屋 / Maguro Koya", area: "nara", category: "restaurant", position: [34.68548, 135.828858], dates: ["10.06"], meta: "金枪鱼料理 · ¥2,000–3,000", googleQuery: "Maguro Koya Nara", guide: "Google Maps 4.5 · 1,451 条评价", fit: "靠近近铁奈良站，适合进景区前或返程前吃。", fitLevel: "备选" },
];

export const kansaiPlaces: Place[] = [...spots, ...restaurantPoints];

export const kansaiMap: GuideMapConfig = {
  defaultAreaId: "kansai",
  ariaLabel: "关西景点、住宿与餐厅交互地图",
  transitAuditNote: "时刻资料核对于 2026-09-02。“已核班次”是运营方公布到分钟的车次；“部分核实”表示主车次已核、酒店步行或换乘仍为估算；“预计时间”统一按 5–15 分钟粒度表达。酒店地址尚未锁定，出发前两周及当天还需复查。",
  diningNote: "正式餐候选按行程适配日期显示，资料核对于 2026 年 9 月 3 日；评分、价格和席位会变化。“3 人可”只代表规则与桌席支持 3 人，并不代表目标日期仍有 3 个余位。",
  areas: [
    { id: "kansai", label: "关西全程", bounds: [[34.39, 135.14], [35.16, 135.9]] },
    { id: "osaka", label: "大阪", bounds: [[34.62, 135.4], [34.72, 135.56]] },
    { id: "kobe", label: "神户", bounds: [[34.66, 135.14], [34.74, 135.22]] },
    { id: "kyoto", label: "京都", bounds: [[34.82, 135.64], [35.15, 135.83]] },
    { id: "nara", label: "奈良", bounds: [[34.67, 135.82], [34.7, 135.86]] },
  ],
};
