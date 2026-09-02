import TripMap from "./TripMap";

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
    urgency: "正式餐",
    title: "料理屋まえかわ",
    body: "本次只需要锁定 1–2 顿好餐。料理屋まえかわ固定优先放在 10 月 3 日岚山日，下午入住并休息后再赴约。",
    meta: "Google Maps 4.7 · 50 条评价 · 需预约",
    href: "https://ryouriya-maekawa.com/",
    cta: "查看官方预约",
  },
];

const restaurants = [
  {
    city: "KYOTO · 日本料理",
    name: "料理屋まえかわ",
    stars: "GOOGLE MAPS 4.7 · 50 条评价",
    when: "建议 10.03 晚餐",
    price: "午餐约 ¥10,000 · 晚餐约 ¥20,000",
    description: "本次正式餐首选。15:20 左右从岚山回到京都、取房并休息后赴约；席位少且 18:30 固定开席，建议尽早确认。",
    href: "https://ryouriya-maekawa.com/",
  },
  {
    city: "KOBE · 神户牛",
    name: "Mouriya Honten",
    stars: "GOOGLE MAPS 4.6 · 约 1,800 条评价",
    when: "建议 10.02 午餐",
    price: "约 ¥10,000 起",
    description: "北野下坡到三宫后最顺路，也是用户备选中的神户牛餐厅。若同时预约料理屋まえかわ，这顿可选午间短套餐，避免两顿都过长。",
    href: "https://www.mouriya.co.jp/en/head",
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
              <a className="text-link" href={card.href} target="_blank" rel="noreferrer">
                {card.cta} <span>↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="dining" id="eat">
        <div className="shell">
          <div className="dining-heading">
            <p className="eyebrow">ONE OR TWO GOOD MEALS</p>
            <h2>京都认真吃一顿，<br />神户再选一顿牛排。</h2>
            <p>正式餐首选料理屋まえかわ，放在 10 月 3 日岚山结束、入住休息之后；神户可预约 Mouriya 午餐。地图中其余餐厅按 Google Maps 评分与顺路程度作为灵活备选。</p>
          </div>
          <div className="restaurant-list">
            {restaurants.map((restaurant) => (
              <article className="restaurant" key={restaurant.name}>
                <div>
                  <span className="restaurant-city">{restaurant.city}</span>
                  <h3>{restaurant.name}</h3>
                  <strong>{restaurant.stars}</strong>
                </div>
                <div className="restaurant-detail">
                  <span>{restaurant.when}</span>
                  <span>{restaurant.price}</span>
                  <p>{restaurant.description}</p>
                  <a className="text-link light" href={restaurant.href} target="_blank" rel="noreferrer">
                    官方菜单与预约 <span>↗</span>
                  </a>
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
