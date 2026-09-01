import Link from "next/link";
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
    city: "大阪",
    stay: "难波 / 心斋桥",
    title: "USJ 后睡到自然醒，再慢走大阪南区",
    route: "黑门市场 → 四天王寺 → 美术馆 / 慶泽园 → 新世界 → 电电城 → 道顿堀",
    note: "11:00 左右再开始，美术馆与庭园二选一；不安排跨城和早起，把下午留给古寺、公园、动漫店与街头小吃。",
    transit: "全日集中在难波—天王寺，地铁加步行为主",
    tone: "city",
  },
  {
    date: "10.02",
    day: "周五",
    city: "神户",
    stay: "难波 / 心斋桥",
    title: "从山景走到海港，神户当天往返",
    route: "布引香草园 → 北野异人馆 → 生田神社 → 神户牛午餐 → 美利坚公园 → Harborland",
    note: "早上从大阪去新神户，缆车上山后一路顺坡下行；傍晚在港口看日落，再回大阪取行李和休息。",
    transit: "难波 → 三宫约 45–55 分钟；港区 → 难波约 50 分钟",
    tone: "nature",
  },
  {
    date: "10.03",
    day: "周六",
    city: "京都",
    stay: "京都站附近",
    title: "换城入住，沿东山由北向南",
    route: "银阁寺 → Omen 午餐 → 哲学之道 → 法然院 → 永观堂 → 南禅寺 → 蹴上 → 八坂神社 → 祇园",
    note: "到京都后先寄存行李。法然院和蹴上是可删节点；主线吸收飞书文档里的银阁寺、哲学之道、永观堂与南禅寺。",
    transit: "难波 → 京都站约 50–60 分钟；东山区域内以步行为主",
    tone: "culture",
  },
  {
    date: "10.04",
    day: "周日",
    city: "宇治 · 城阳",
    stay: "京都站附近",
    title: "伏见、宇治川与秋日烟火",
    route: "伏见稻荷 → 东福寺 → 平等院 → 中村藤吉 → 宇治川 → 宇治上神社 → 城阳秋花火",
    note: "伏见稻荷只走到奥社奉拜所，随后一路向南去宇治；把上午留给伏见与东福寺，16:30–17:00 抵达 JR 长池附近会场。",
    transit: "京都 → 稻荷约 5 分钟；宇治 → 长池约 20 分钟；长池 → 京都约 35 分钟",
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
    city: "奈良 → 大阪",
    stay: "难波 / 心斋桥",
    title: "退房后顺路游奈良，晚上回到大阪",
    route: "兴福寺 → 依水园 → 东大寺 → 二月堂 → 春日大社 → 水谷茶屋 → 奈良町 → 难波",
    note: "从京都带行李到近铁奈良站寄存，按东向西路线走回车站；傍晚去大阪，最后一晚只安排心斋桥补购物或一顿正式餐。",
    transit: "京都 → 奈良约 45–55 分钟；近铁奈良 → 大阪难波约 40 分钟",
    tone: "nature",
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
    body: "本次只需要锁定 1–2 顿好餐。料理屋まえかわ建议放在 10 月 3 日东山日，或 10 月 5 日贵船回城后。",
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
    when: "建议 10.03 或 10.05 晚餐",
    price: "午餐约 ¥10,000 · 晚餐约 ¥20,000",
    description: "本次正式餐首选。东山日结束后前往最自然，也可放在贵船回城后；席位少，建议尽早确认。",
    href: "https://ryouriya-maekawa.com/",
  },
  {
    city: "KOBE · 神户牛",
    name: "Mouriya Honten",
    stars: "GOOGLE MAPS 4.6 · 1,836 条评价",
    when: "建议 10.02 午餐",
    price: "套餐通常 ¥10,000 以上",
    description: "布引与北野一路下坡到三宫后正好午餐，位置和路线最贴合。若已订这顿，京都只需再订一顿正式餐。",
    href: "https://www.mouriya.co.jp/en/head",
  },
  {
    city: "KYOTO · 乌冬",
    name: "Omen Ginkaku-ji",
    stars: "GOOGLE MAPS 4.3 · 1,967 条评价",
    when: "10.03 银阁寺之后",
    price: "约 ¥1,000–2,000",
    description: "不是正式套餐，但它紧贴东山步行线，能让午餐不打断行程。排队太长时可直接换附近简餐。",
    href: "https://omen.co.jp/",
  },
];

const referenceReview = [
  {
    status: "吸收",
    tone: "adopt",
    title: "10.03 完整吸收东山北线",
    body: "飞书文档里的银阁寺、哲学之道、永观堂、南禅寺顺序合理；新版再补法然院、水路阁、蹴上、八坂神社和祇园。",
  },
  {
    status: "取舍",
    tone: "skip",
    title: "岚山改为替换方案",
    body: "九天内还要保留 USJ 后的轻松日、神户、奈良、贵船和固定烟火，岚山无法再单独占一天；若更想去岚山，可替换 10.03 东山线。",
  },
  {
    status: "保留",
    tone: "keep",
    title: "贵船作为京都自然主线",
    body: "晴天从鞍马翻山到贵船，雨天则取消木根道、由贵船口搭巴士直达；两种方案都确保贵船神社不被删除。",
  },
  {
    status: "不照搬",
    tone: "skip",
    title: "不安排清水寺夜游",
    body: "旧行程是 11 月末的夜间特别开放。2026 国庆落在常规时段，清水寺 18:00 闭门；想去只能改成清晨或白天，不能按 19:15 入场。",
  },
  {
    status: "顺移",
    tone: "move",
    title: "伏见稻荷放到烟火当天",
    body: "伏见、东福寺、宇治与城阳都在京都南侧；早起走千本鸟居短线后一路向南，比在退房日折返更合理。",
  },
  {
    status: "调整住宿",
    tone: "keep",
    title: "京都住 3 晚即可",
    body: "10.03 入住、10.06 退房，覆盖东山、京都南部与贵船三天；奈良安排在退房后顺路去大阪，避免多一次住宿。",
  },
];

const practical = [
  ["住宿", "9.29–10.03 大阪难波／心斋桥 4 晚；10.03–10.06 京都站 3 晚；10.06 最后一晚回难波。"],
  ["行李", "10 月 3 日先到京都站寄存；10 月 6 日退房后把行李寄存在近铁奈良站，游览结束取行李直达大阪。"],
  ["交通", "关西内部使用 ICOCA 加单独购票即可，一般不需要全国 JR Pass；京都优先坐铁路而不是挤巴士。"],
  ["取舍", "主线现在同时包含神户与奈良；代价是岚山不再占用独立一天。若一定想去岚山，用它替换 10 月 3 日东山线。"],
  ["天气", "9 月末仍可能受台风和阵雨影响。贵船下雨保留神社、取消翻山；神户遇大风则取消布引缆车，把时间留给北野和港区。"],
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
            先在大阪住稳、玩完 USJ 后留一天慢下来，再走进神户山海、京都北山与奈良古林，
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
          <strong>USJ · 贵船 · 城阳烟火</strong>
        </article>
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
          <h2>大阪起收，<br />中段串起神户、京都与奈良。</h2>
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
                {index === 0 && (
                  <Link className="day-detail-link" href="/day-1">
                    打开第一天手账 <span>↗</span>
                  </Link>
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
            <p>飞书文档的价值在于区域内的细顺序；新版吸收东山与京都东南线，同时根据这次的 USJ、贵船、神户、奈良和固定烟火重新分配住宿与跨城日期。</p>
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
              与伏见稻荷、东福寺和宇治同在京都南侧，所以安排在同一天最顺。
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
            <h2>京都一顿，<br />神户一顿就够。</h2>
            <p>正式餐首选料理屋まえかわ；如果神户已经预约 Mouriya，就不必再堆第二顿京都长套餐。地图中其余餐厅按 Google Maps 评分与顺路程度作为灵活备选。</p>
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
