import { defineDayJournal } from "@/app/guide-core/defineGuide";
import { googleMapsDirections, googleMapsSearch } from "@/app/guide-core/links";

const checkedAt = "2026-09-04";
const usjHours = "https://www.usj.co.jp/web/ja/jp/park-guide/schedule/park-hour2";
const usjTickets = "https://www.usj.co.jp/web/ja/jp/tickets/lineup";
const expressPasses = "https://www.usj.co.jp/web/ja/jp/tickets/lineup/expresspass";
const timedEntry = "https://www.usj.co.jp/web/ja/jp/enjoy/numbered-ticket/timed-entry-ticket";
const superNintendoWorld = "https://www.usj.co.jp/web/ja/jp/areas/super-nintendo-world";
const halloween = "https://www.usj.co.jp/web/ja/jp/events/halloween-extreme-autumn-2026/halloween-horror-nights";
const streetZombies = `${halloween}/street-zombies`;
const zombieDance = `${halloween}/zombie-de-dance`;
const residentEvil = `${halloween}/resident-evil-requiem-the-dive`;
const closures = "https://www.usj.co.jp/web/ja/jp/park-guide/schedule/attraction-closure/";
const wheelchair = "https://www.usj.co.jp/web/ja/jp/service-guide/wheelchair";
const osakaNambaTimetable = "https://eki.kintetsu.co.jp/norikae/T5?USR=PC&d=2&dw=0&slCode=350-0";
const jrOutbound = "https://timetable.jr-odekake.net/station-timetable/2836020001?date=20260930";
const jrReturn = "https://timetable.jr-odekake.net/station-timetable/2957020002?date=20260930";

export const kansaiDayTwoJournal = defineDayJournal({
  schemaVersion: 1,
  id: "2026-09-30",
  guideId: "kansai-2026",
  date: "2026-09-30",
  dayNumber: 2,
  weekday: "WED",
  metadata: {
    title: "USJ，从开园玩到万圣夜｜关西 2026 Day 2",
    description: "2026 年 9 月 30 日大阪往返 USJ：早到入园、SUPER NINTENDO WORLD、园内休息、万圣节夜场与闭园返程。",
  },
  navigation: {
    ariaLabel: "第二天页面导航",
    backLabel: "返回九日总行程",
    badge: "DAY 02 · 2026.09.30 · WED",
  },
  labels: {
    statsAriaLabel: "当天关键数据",
    estimatedTiming: "时间为估算",
    partiallyVerifiedTiming: "部分核实",
    hasAlternative: "有备选",
    recommendationSource: "资料 / 官方",
    recommendationMap: "地图",
  },
  presentation: {
    template: "hand-journal",
  },
  hero: {
    kicker: "OSAKA → USJ → HALLOWEEN NIGHT",
    titleLines: ["从开园，", "玩到夜。"],
    lead: "这天不赶景点数量。先保住任天堂园区，再保住两次坐下休息；其余项目跟着票面时间和现场等候走。晚上想看丧尸就留下，不想看也有安静版收尾。",
    stats: [
      { value: "06:30", label: "离开酒店" },
      { value: "08–22", label: "官方营业" },
      { value: "≈7–8 km", label: "步行目标" },
      { value: "2 次", label: "坐下休息" },
    ],
    footnote: "周三 · 非日本法定节假日 · 万圣节活动期 · 酒店位置尚未锁定",
  },
  route: {
    label: "今日闭环",
    summary: "大阪难波／心斋桥住宿 → 大阪难波 → 西九条 → 环球城 → USJ → 原路回大阪住宿",
  },
  primaryRule: {
    ariaLabel: "USJ 当天最重要的票务规则",
    eyebrow: "ONE HARD PIN",
    title: "唯一不能临场随缘的，是任天堂园区入场。",
    body: "先买 9 月 30 日有效的 1 Day Studio Pass；Express Pass 只选详情明确写有 SUPER NINTENDO WORLD 入场确约的产品。若没有确约，出发前把所有人的 Studio Pass 二维码登记进官方 App，入园后立刻申请园区整理券。",
    href: timedEntry,
    linkLabel: "查看官方整理券流程",
  },
  sections: [
    {
      kind: "timeline",
      id: "schedule",
      eyebrow: "HOUR BY HOUR",
      titleLines: ["票面时间优先，", "顺区走，不折返。"],
      aside: {
        label: "怎么移动时间块",
        body: "Express Pass 和园区整理券的指定时间高于本页。拿到票后，把整块内容前后挪，不要把园区拆成两次进出。",
      },
      items: [
        {
          time: "05:50–06:30",
          title: "在酒店吃完早餐，整理一只轻包",
          kind: "free",
          note: "带护照复印件、充电宝、雨具、水和少量能量食品。Studio Pass 与 Express Pass 分别保存离线截图；官方 App 提前登录并登记所有同行人的二维码。",
          timingStatus: "estimated",
        },
        {
          time: "06:30–07:15",
          title: "大阪住宿 → USJ 闸口",
          kind: "hop",
          note: "酒店步行时间未定；目标搭 06:46 大阪难波出发的阪神难波线，06:54 到西九条，换 JR 梦咲线约 07:05 出发、07:11 到环球城，再步行约 4 分钟。",
          timingStatus: "partial",
          href: googleMapsDirections("Osaka-Namba Station", "Universal Studios Japan", "transit"),
        },
        {
          time: "07:15–08:00",
          title: "排队、过安检，不把 08:00 当作到达时间",
          kind: "anchor",
          note: "官方公示 08:00 开园，但明确提醒可能提前放行。进闸后先处理任天堂园区整理券，再看 App 的实时等候时间。",
          timingStatus: "verified",
          href: usjHours,
        },
        {
          time: "08:00–约 10:30",
          title: "先做一个园外高排队项目，再向任天堂园区移动",
          kind: "anchor",
          note: "从好莱坞区或侏罗纪区挑一个身体能接受的主项目即可；不要为了多刷一个项目错过指定入场。若确约时段就在开园后，直接跳过这一步。",
          hasAlternative: true,
          timingStatus: "estimated",
        },
        {
          time: "按票面时段 · 约 3h",
          title: "SUPER NINTENDO WORLD 一次玩完，不安排二次入区",
          kind: "anchor",
          note: "优先 Mario Kart 与 Donkey Kong；Yoshi 和小游戏看体力。限流时离开后不能再次入区，园区入场也不等于项目免排队。午饭也属于这 3 小时，不额外挤占后面的时间。",
          timingStatus: "estimated",
          href: superNintendoWorld,
        },
        {
          time: "进区约 90min 后",
          title: "第一次坐下：午餐至少留 45 分钟",
          kind: "meal",
          note: "任天堂园区覆盖午饭就选 Kinopio's Cafe，并把这 45–60 分钟算在园区 3 小时内；若指定入场不在午间，11:30–13:00 改去 Three Broomsticks。两家 9 月 30 日的具体营业时段尚未发布。",
          price: "主餐约 ¥2,000–3,500",
          hasAlternative: true,
          timingStatus: "estimated",
        },
        {
          time: "离开任天堂园区后–16:30",
          title: "下午只保一个主题区和一个主项目",
          kind: "anchor",
          note: "按 Express Pass 指定时段走。若没有指定时段，优先同一区内连续完成，避免在园区两端来回。Space Fantasy、Shrek 4-D 与 Sesame Street 4-D 已列入停运表，不把它们写进备选。",
          hasAlternative: true,
          timingStatus: "estimated",
          href: closures,
        },
        {
          time: "16:30–17:20",
          title: "第二次坐下：喝水、充电、决定今晚走哪条线",
          kind: "free",
          note: "如果脚已经累，就把晚间目标缩成一个：看 Street Zombies，或补一个夜间项目。此处不再加新景点。",
          timingStatus: "estimated",
        },
        {
          time: "18:00–20:30",
          title: "万圣夜二选一：看热闹，或者避开惊吓",
          kind: "anchor",
          note: "惊吓线：Street Zombies 从 18:00 持续到闭园；Zombie de Dance 的准确演出表约提前一周公布。安静线：避开街头丧尸区，补一个室内项目或在商店慢逛。带孩子或不接受惊吓时不要硬走夜场线。",
          hasAlternative: true,
          timingStatus: "partial",
          href: streetZombies,
        },
        {
          time: "20:30–21:40",
          title: "最后一个项目，21:40 开始向出口收拢",
          kind: "free",
          note: "商店只留一个集中购买窗口。22:00 是闭园，不是开始找车站的时间；想稳稳回难波，就在 22:05–22:10 之间通过闸口。",
          timingStatus: "estimated",
        },
        {
          time: "22:05–23:05",
          title: "环球城 → 大阪住宿",
          kind: "hop",
          note: "目标 22:12 或 22:20 左右搭 JR 梦咲线到西九条，换阪神难波线回大阪难波。23:12 是本计划的完整返程安全线；更晚 JR 班次可能只够到西九条，后段要打车。",
          timingStatus: "partial",
          href: googleMapsDirections("Universal Studios Japan", "Osaka-Namba Station", "transit"),
        },
      ],
    },
    {
      kind: "transport",
      id: "transport",
      eyebrow: "DOOR TO DOOR",
      titleLines: ["早班有余量，", "晚班留退路。"],
      note: "已核主干列车与园区营业时间；酒店到大阪难波的步行、换乘和入园安检仍是估算，因此整体标为部分核实。",
      items: [
        {
          from: "大阪住宿",
          to: "USJ 闸口",
          depart: "06:30 离店；06:46 大阪难波上车",
          arrive: "06:54 西九条；约 07:11 环球城；约 07:15 闸口",
          duration: "约 41–45 分钟",
          mode: "步行＋阪神难波线＋JR 梦咲线",
          route: "大阪难波 06:46 → 西九条 06:54；换乘 JR 梦咲线约 07:05 → 环球城约 07:11，随后步行到入口。",
          timingStatus: "partial",
          serviceBoundary: "阪神工作日首班：大阪难波 05:03 往尼崎方向；本计划不使用首班。",
          fallback: "阪神异常时，地铁千日前线到玉川，步行到 JR 野田后换大阪环状线／梦咲线；大范围停运则酒店直达出租车。",
          href: googleMapsDirections("Osaka-Namba Station", "Universal Studios Japan", "transit"),
        },
        {
          from: "USJ 闸口",
          to: "大阪住宿",
          depart: "22:05–22:10 离开；目标 22:12／22:20 JR",
          arrive: "约 22:50–23:05 回到酒店",
          duration: "约 30–45 分钟",
          mode: "步行＋JR 梦咲线＋阪神难波线",
          route: "环球城 → 西九条；站内换阪神难波线到大阪难波，再步行回酒店。",
          timingStatus: "partial",
          serviceBoundary: "23:12 作为完整返程的实用最晚线；JR 技术末班更晚，但可能赶不上后段阪神。",
          fallback: "错过阪神末班时先搭 JR 到西九条，再打车回难波；连 JR 也错过则从 USJ 直接打车。",
          href: googleMapsDirections("Universal Studios Japan", "Osaka-Namba Station", "transit"),
        },
      ],
    },
    {
      kind: "recommendations",
      id: "food",
      eyebrow: "TWO REAL BREAKS",
      titleLines: ["吃饭是休息，", "不是第三条队伍。"],
      note: "当日餐厅时刻表尚未发布。以下只锁区域和用餐策略，9 月 28 日在官方 App 复查营业时间。",
      items: [
        {
          label: "任天堂时段覆盖午饭",
          name: "Kinopio's Cafe",
          order: "汉堡或意面主餐；先看移动点餐",
          reason: "就在 SUPER NINTENDO WORLD 内，不为吃饭二次进区；官方页面显示可移动点餐，当日入店申请在店头办理。",
          caution: "只有入场时段与午饭重合才选。限流时离开园区通常不能再次入区。",
          sourceHref: "https://www.usj.co.jp/web/ja/jp/restaurants/kinopios-cafe",
          mapHref: googleMapsSearch("Kinopio's Cafe Universal Studios Japan"),
        },
        {
          label: "不在任天堂园区时",
          name: "Three Broomsticks",
          order: "Fish and Chips / Shepherd's Pie",
          reason: "有完整室内座位，也支持移动点餐，适合把午饭和脚部恢复合在一起。",
          caution: "9 月 30 日营业时间尚未发布；不要跨半个园区专程去吃，离得远就用附近同类餐厅替代。",
          sourceHref: "https://www.usj.co.jp/web/ja/jp/restaurants/three-broomsticks",
          mapHref: googleMapsSearch("Three Broomsticks Universal Studios Japan"),
        },
        {
          label: "体力下降时",
          name: "就近坐下，不追网红餐",
          order: "一份主食＋水，至少坐 30 分钟",
          reason: "主题公园下午的稀缺资源不是菜品，而是脚力。用 App 看当前区域营业中的餐厅，减少一次跨区往返。",
          caution: "过敏或特殊饮食先看官方餐饮说明并向店员确认，不凭图片猜配料。",
          sourceHref: "https://www.usj.co.jp/web/ja/jp/food-and-restaurant",
          mapHref: googleMapsSearch("Restaurants Universal Studios Japan"),
        },
      ],
    },
    {
      kind: "notes",
      id: "choices",
      eyebrow: "TICKET & NIGHT",
      titleLines: ["先把选择做完，", "当天就少排一次队。"],
      items: [
        {
          label: "票券",
          body: "1 Day Studio Pass 与 Express Pass 是两张票，后者不能单独入园。当前基础价格分别从成人 ¥8,400、Express 4 ¥6,800 起，9 月 30 日实际售价会随日期和产品变化；购买页显示多少就按多少，不拿起价做预算结论。",
        },
        {
          label: "任天堂",
          body: "买 Express Pass 时只认“含 SUPER NINTENDO WORLD 入场确约”字样。若没有，入园后马上在 App 申请整理券；整理券可能提前发完。限流时通常不能二次入区。",
        },
        {
          label: "恐怖项目",
          body: "Street Zombies 18:00 开始。若想玩 Resident Evil Requiem: The Dive，还要在入园后申请电子整理券；14 岁及以下／初中年龄不可体验。额外付费的“残像”要求全员 18 岁以上，本页不默认加入。",
        },
        {
          label: "演出表",
          body: "Zombie de Dance 的准确演出时间约在游玩日前一周公布。9 月 23–28 日再把演出钉进时间线；在那之前只保留 18:00 后的夜场窗口。",
        },
      ],
    },
    {
      kind: "notes",
      id: "contingency",
      eyebrow: "PLAN B",
      titleLines: ["少玩两个项目，", "也别丢掉整天。"],
      items: [
        {
          label: "晚到",
          body: "08:30 后才进园：先领任天堂整理券，删掉上午的园外主项目；保留任天堂、午饭、一次下午休息和一个晚间目标。",
        },
        {
          label: "下雨",
          body: "雨具优先于伞。户外过山车暂停时，不在入口干等，直接换室内项目或餐厅；任天堂园区入场时段照常守住。",
        },
        {
          label: "走不动",
          body: "立刻停止跨区，第二次坐下休息提前。官方在入园后右侧提供数量有限、不可预约的付费轮椅；当前公示 ¥500，具体可乘项目需逐项看利用标准。",
        },
        {
          label: "早撤",
          body: "想保体力就 20:30–21:00 离园。先删商店和第二个夜间项目，不删任天堂园区，也不为了“玩满票价”拖到脚痛。",
        },
      ],
    },
    {
      kind: "links",
      id: "map",
      eyebrow: "POCKET KIT",
      titleLines: ["该点的都点好，", "进园不再搜索。"],
      note: "离线 KML 只含大阪难波区域占位与 USJ；酒店确定后需要替换住宿点。园内导航和整理券必须使用官方 App。",
      items: [
        { label: "01 · 大阪难波站", href: googleMapsSearch("Osaka-Namba Station") },
        { label: "02 · 环球城站", href: googleMapsSearch("Universal City Station Osaka") },
        { label: "03 · USJ 入口", href: googleMapsSearch("Universal Studios Japan Entrance") },
        { label: "04 · SUPER NINTENDO WORLD", href: googleMapsSearch("Super Nintendo World Universal Studios Japan") },
        { label: "官方票券列表", href: usjTickets },
        { label: "官方 Express Pass 列表", href: expressPasses },
        { label: "官方 9/30 营业时间", href: usjHours },
        { label: "下载 Day 2 离线 KML", href: "/downloads/day-2-usj.kml", download: true },
      ],
    },
    {
      kind: "sources",
      id: "sources",
      title: "核对记录与直接来源",
      summary: "9 月 30 日不是日本法定节假日；USJ 官方公示当日 08:00–22:00，但可能提前开园。万圣节夜场已公布活动期，精确演出表仍待临行前复核。票价只记录官方起价，不把动态价格写死。铁路主干班次已核，酒店步行与换乘余量仍按估算处理。",
      items: [
        { title: "USJ 9 月 30 日营业时间", href: usjHours, checkedAt },
        { title: "官方票券与基础起价", href: usjTickets, checkedAt },
        { title: "Express Pass 当前产品列表", href: expressPasses, checkedAt },
        { title: "任天堂园区整理券流程", href: timedEntry, checkedAt },
        { title: "SUPER NINTENDO WORLD 官方说明", href: superNintendoWorld, checkedAt },
        { title: "Halloween Horror Nights 2026", href: halloween, checkedAt },
        { title: "Street Zombies 官方时段", href: streetZombies, checkedAt },
        { title: "Zombie de Dance 官方说明", href: zombieDance, checkedAt },
        { title: "Resident Evil 整理券与年龄限制", href: residentEvil, checkedAt },
        { title: "USJ 计划停运项目", href: closures, checkedAt },
        { title: "轮椅与无障碍服务", href: wheelchair, checkedAt },
        { title: "大阪难波工作日时刻表", href: osakaNambaTimetable, checkedAt },
        { title: "JR 西九条至环球城 9/30 时刻", href: jrOutbound, checkedAt },
        { title: "JR 环球城返程 9/30 时刻", href: jrReturn, checkedAt },
        { title: "日本内阁府 2026 年法定节假日", href: "https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html", checkedAt },
      ],
    },
  ],
  footer: {
    badge: "DAY 02 / 09.30",
    message: "回房只做两件事：洗澡，睡觉。明天 10:30 再出门，给脚和睡眠留回程票。",
    backLabel: "回到九日总行程",
  },
});
