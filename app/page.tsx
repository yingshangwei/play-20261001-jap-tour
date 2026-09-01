import TripMap from "./TripMap";

export const dynamic = "force-static";

const days = [
  {
    date: "09.29",
    day: "周二",
    city: "大阪",
    stay: "难波 / 心斋桥",
    title: "抵达关西，先去感受大阪的夜",
    route: "KIX → 难波入住 → 心斋桥筋 → 道顿堀 → 法善寺横丁",
    note: "按 14:00 落地计算，第一晚不安排长套餐。心斋桥是必到项，也适合处理药妆和基础购物。",
    transit: "机场进城约 35–45 分钟；预计 16:00–16:30 到酒店",
    tone: "city",
  },
  {
    date: "09.30",
    day: "周三",
    city: "大阪",
    stay: "难波 / 心斋桥",
    title: "USJ 全天：从任天堂世界玩到惊魂夜",
    route: "超级任天堂世界 → 哈利波特 → 主力项目 → 万圣节惊魂夜",
    note: "开园前 60–90 分钟抵达。购买含超级任天堂世界指定入场的 Express Pass，晚上保留体力看街头僵尸和限定内容。",
    transit: "难波 → 环球城约 30–40 分钟；建议 7:00–7:30 离店",
    tone: "special",
  },
  {
    date: "10.01",
    day: "周四",
    city: "奈良",
    stay: "难波 / 心斋桥",
    title: "古寺之后，走进千年原始林",
    route: "东大寺 → 二月堂 → 春日大社 → 春日山原始林 → 奈良町",
    note: "不只停留在奈良公园。体力正常可走 2–3 小时林间短线；想轻松就缩短徒步，把傍晚留给奈良町。",
    transit: "近铁大阪难波 ↔ 近铁奈良，单程约 40 分钟",
    tone: "nature",
  },
  {
    date: "10.02",
    day: "周五",
    city: "京都",
    stay: "京都站附近",
    title: "换城入住，沿东山慢慢散步",
    route: "银阁寺 → 哲学之道 → 永观堂 → 南禅寺 → 八坂神社 → 祇园",
    note: "参考旧行程补入永观堂：银阁寺一路向南，16:00 前完成入场，再去南禅寺与祇园。清水寺夜游不放在这天，国庆期间常规 18:00 闭门。",
    transit: "难波 → 京都站约 50–60 分钟；京都站 → 银阁寺约 30–40 分钟",
    tone: "culture",
  },
  {
    date: "10.03",
    day: "周六",
    city: "京都",
    stay: "京都站附近",
    title: "岚山早行，避开周末人潮",
    route: "竹林 → 天龙寺 → 大河内山庄 → 常寂光寺 / 祇王寺 → 嵯峨野",
    note: "参考文档中的常寂光寺、祇王寺值得保留，但仍维持 7:00 左右先到竹林；不照搬 10:00 才进岚山的节奏，也不硬塞保津川游船。",
    transit: "JR 京都 → 嵯峨岚山约 17 分钟；当地步行 4–6 小时",
    tone: "nature",
  },
  {
    date: "10.04",
    day: "周日",
    city: "宇治 · 城阳",
    stay: "京都站附近",
    title: "任天堂、宇治川与秋日烟火",
    route: "任天堂博物馆 → 平等院 → 宇治川 → JR 长池 → 城阳秋花火",
    note: "最理想是 10:00 左右入馆，14:00 后逛宇治，16:30 前到烟火会场。三处都在京都南部，几乎不折返。",
    transit: "京都 → 小仓约 25–30 分钟；宇治 → 长池约 20 分钟；长池 → 京都约 35 分钟",
    tone: "special",
  },
  {
    date: "10.05",
    day: "周一",
    city: "京都北山",
    stay: "京都站附近",
    title: "翻过鞍马山，抵达贵船",
    route: "出町柳 → 鞍马寺 → 木根道 → 贵船神社三社 → 出町柳 / 吉泉",
    note: "晴天从鞍马走到贵船约需半天；雨天取消山路，直接由贵船口搭巴士去神社。若订吉泉，回到出町柳后步行约 10 分钟；需准备干净上衣并预留整理时间。",
    transit: "京都 → 鞍马约 60–75 分钟；翻山 2.5–3 小时；贵船 → 京都约 70 分钟",
    tone: "nature",
  },
  {
    date: "10.06",
    day: "周二",
    city: "大阪",
    stay: "难波 / 心斋桥",
    title: "回到大阪，城市与购物收尾",
    route: "大阪城公园 → 中之岛 / 梅田 → 日本桥电电城 → 心斋桥",
    note: "标准版上午从京都回大阪。若特别想补参考文档里的伏见稻荷，可 6:30 走到奥社奉拜所后折返，9:00 回酒店；这时删去中之岛 / 梅田，避免全天过满。",
    transit: "京都站 → 难波约 50–60 分钟；伏见稻荷可选短线另计 2–2.5 小时",
    tone: "city",
  },
  {
    date: "10.07",
    day: "周三",
    city: "返程",
    stay: "—",
    title: "留足时间，舒服返沪",
    route: "难波 → 南海电铁 → 关西机场",
    note: "12:00 国际航班建议 7:45–8:00 离开酒店，约 9:00 抵达机场。",
    transit: "南海 Rapi:t / 机场急行约 35–45 分钟，另留值机与安检时间",
    tone: "city",
  },
];

const bookingCards = [
  {
    number: "01",
    urgency: "现在处理",
    title: "任天堂博物馆",
    body: "10 月票已进入先到先得。首选 10 月 4 日 10:00–11:00；若没有，就接受 10 月 2、3 或 5 日，再交换对应的京都日。",
    meta: "全部指定日期与时段 · 周二闭馆",
    href: "https://museum-tickets.nintendo.com/en/calendar?hidemenu=true",
    cta: "查看官方票务",
  },
  {
    number: "02",
    urgency: "固定日期",
    title: "城阳秋花火",
    body: "10 月 4 日 19:00–19:40，JR 长池站步行约 5 分钟。8,000 张预售票，现场不售票；Ticket Pia 网上票 2,500 日元。",
    meta: "雨天照常 · 恶劣天气取消且原则上不退款",
    href: "https://t.pia.jp/pia/event/event.do?eventBundleCd=b2669988",
    cta: "购买烟火票",
  },
  {
    number: "03",
    urgency: "尽快锁定",
    title: "USJ",
    body: "购买 9 月 30 日日期指定 Studio Pass，并选择含超级任天堂世界指定入场的 Express Pass。当天仍在 2026 万圣节惊魂夜活动期内。",
    meta: "当天可能早于标示时间开园",
    href: "https://www.usj.co.jp/web/en/us/tickets/express-pass",
    cta: "查看 Express Pass",
  },
];

const restaurants = [
  {
    city: "KYOTO · 日本料理",
    name: "料理屋まえかわ",
    stars: "MICHELIN ★",
    when: "建议 10.02 晚餐或 10.03 午餐",
    price: "午餐约 ¥10,000 · 晚餐约 ¥20,000",
    description: "离清水五条站约 300 米，是截图候选里最贴合东山路线的一家。席位少，适合尽早通过官方页面或酒店礼宾确认。",
    href: "https://ryouriya-maekawa.com/",
  },
  {
    city: "KYOTO · 日本料理",
    name: "菊乃井本店",
    stars: "MICHELIN ★★★",
    when: "建议 10.02 或 10.03 晚餐",
    price: "晚餐 ¥22,000 起 + 15% 服务费",
    description: "传统京都料亭体验最完整的一餐。空间、器物与季节料理共同构成体验，国际游客可使用英文或中文在线预约。",
    href: "https://kikunoi.jp/restaurant/",
  },
  {
    city: "OSAKA · 现代法餐",
    name: "La Cime",
    stars: "MICHELIN ★★",
    when: "建议 10.06 晚餐",
    price: "套餐 ¥35,200 · 税及服务费已含",
    description: "以日本食材表现大阪与奄美文化的现代法餐，位置在本町，适合作为最后一晚的正式收尾。",
    href: "https://www.la-cime.com/reservation/",
  },
  {
    city: "KYOTO · 京怀石",
    name: "京懐石 吉泉",
    stars: "MICHELIN ★★",
    when: "建议 10.05 晚餐",
    price: "晚餐 ¥30,000 起 + 10% 服务费",
    description: "参考文档里的正式餐选择可以保留，但顺移到贵船日：餐厅距出町柳站步行约 10 分钟，回程不绕路。官方以电话预约为主，可请京都酒店协助。",
    href: "https://www.kichisen-kyoto.com/",
  },
];

const referenceReview = [
  {
    status: "吸收",
    tone: "adopt",
    title: "10.02 加入永观堂",
    body: "参考文档的东北京都步行线很合理。把永观堂放在哲学之道与南禅寺之间，按 16:00 前受付倒推时间，仍能在傍晚走到祇园。",
  },
  {
    status: "保留",
    tone: "keep",
    title: "岚山仍然清晨出发",
    body: "祇王寺与常寂光寺继续保留；但国庆周六的人流压力更高，所以维持 7:00 竹林先行，不采用参考文档 10:00 后才开始的节奏。",
  },
  {
    status: "顺移",
    tone: "move",
    title: "吉泉放到贵船回程",
    body: "餐厅就在下鸭、出町柳一带。安排在 10.05 比放进东山或岚山日更顺，徒步后换一件干净上衣即可衔接正式晚餐。",
  },
  {
    status: "不照搬",
    tone: "skip",
    title: "不安排清水寺夜游",
    body: "旧行程是 11 月末的夜间特别开放。2026 国庆落在常规时段，清水寺 18:00 闭门；想去只能改成清晨或白天，不能按 19:15 入场。",
  },
  {
    status: "可选替换",
    tone: "optional",
    title: "伏见稻荷放在 10.06 清晨",
    body: "如果它的优先级高，可 6:30 走千本鸟居短线后回酒店，再去大阪；代价是删掉中之岛 / 梅田。不要塞进任天堂、宇治与烟火的固定日。",
  },
  {
    status: "不调整",
    tone: "keep",
    title: "京都继续住京都站",
    body: "参考文档住四条适合纯市区观光；本行程还要频繁前往岚山、小仓、宇治和大阪，京都站仍是整体换乘更省力的基地。",
  },
];

const practical = [
  ["住宿", "9.29–10.02 大阪难波／心斋桥 3 晚；10.02–10.06 京都站 4 晚；10.06 最后一晚回难波。"],
  ["行李", "10 月 2 日退房后带行李直接去京都站附近酒店寄存；10 月 6 日同样先回难波寄存，再开始大阪市内行程。"],
  ["交通", "关西内部使用 ICOCA 加单独购票即可，一般不需要全国 JR Pass；京都优先坐铁路而不是挤巴士。"],
  ["取舍", "出发改为 9 月 29 日后少了一整天，主线保留奈良、删去神户；若更想看神户，可用神户布引＋港口替换 10 月 1 日奈良。"],
  ["天气", "9 月末仍可能受台风和阵雨影响。奈良与岚山可视天气微调；贵船下雨则保留神社、取消翻山。"],
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
            从大阪的霓虹出发，穿过奈良古林、岚山嵯峨野和京都北山，
            把任天堂、贵船、USJ 与一场秋日烟火串成一条舒服的路线。
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
          <strong>大阪 3晚 · 京都 4晚 · 大阪 1晚</strong>
        </article>
        <article>
          <span>路线基调</span>
          <strong>自然徒步 + 城市散步</strong>
        </article>
        <article>
          <span>三项必抢</span>
          <strong>任天堂 · USJ · 城阳烟火</strong>
        </article>
      </section>

      <section className="map-section shell" id="map" aria-labelledby="map-title">
        <div className="map-heading">
          <div>
            <p className="eyebrow dark">ROUTE MAP</p>
            <span className="section-note">缩放、筛选，点击标记跳转 Google Maps</span>
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
          <h2>先在大阪落脚，<br />再慢慢走进京都。</h2>
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
                <p className="transit-line"><span>交通耗时</span>{item.transit}</p>
                <p>{item.note}</p>
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
            <p>那份文档适合 11 月末的四日京都快走；这次是国庆九日、还有任天堂博物馆与烟火两项固定约束。结论是局部吸收，不需要重排全程。</p>
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
              与任天堂博物馆、宇治同属京都南部，所以安排在同一天最顺。
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
          <h2>先锁定三张票，<br />其余行程才真正成立。</h2>
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
            <h2>京都优先，<br />大阪收尾。</h2>
            <p>最贴东山的是料理屋まえかわ；想要传统料亭选菊乃井；贵船回程选吉泉；想用现代法餐收尾再选 La Cime。全程只订其中 1–2 家即可。</p>
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
            <p>集中安排在最后一天，买周边后直接回难波整理行李。</p>
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
          <a href="https://museum.nintendo.com/en/guide/index.html" target="_blank" rel="noreferrer">任天堂博物馆参观指南 ↗</a>
          <a href="https://www.usj.co.jp/web/en/us/park-guide/schedule/park-hour" target="_blank" rel="noreferrer">USJ 营业时间 ↗</a>
          <a href="https://kifunejinja.jp/" target="_blank" rel="noreferrer">贵船神社 ↗</a>
          <a href="https://www.eikando.or.jp/English/haikan_e.html" target="_blank" rel="noreferrer">永观堂参观时间 ↗</a>
          <a href="https://www.kiyomizudera.or.jp/en/location/" target="_blank" rel="noreferrer">清水寺 2026 开放时间 ↗</a>
          <a href="https://inari.jp/en/access/" target="_blank" rel="noreferrer">伏见稻荷大社交通 ↗</a>
          <a href="https://www.kobeherb.com/en/" target="_blank" rel="noreferrer">神户布引香草园 ↗</a>
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
