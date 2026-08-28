const days = [
  {
    date: "09.28",
    day: "周一",
    city: "大阪",
    stay: "难波 / 心斋桥",
    title: "抵达关西，先去感受大阪的夜",
    route: "KIX → 难波入住 → 心斋桥筋 → 道顿堀 → 法善寺横丁",
    note: "按 14:00 落地计算，第一晚不安排长套餐。心斋桥是必到项，也适合处理药妆和基础购物。",
    tone: "city",
  },
  {
    date: "09.29",
    day: "周二",
    city: "大阪",
    stay: "难波 / 心斋桥",
    title: "USJ 全天：从任天堂世界玩到惊魂夜",
    route: "超级任天堂世界 → 哈利波特 → 主力项目 → 万圣节惊魂夜",
    note: "开园前 60–90 分钟抵达。购买含超级任天堂世界指定入场的 Express Pass，晚上保留体力看街头僵尸和限定内容。",
    tone: "special",
  },
  {
    date: "09.30",
    day: "周三",
    city: "神户",
    stay: "难波 / 心斋桥",
    title: "山、瀑布与港口夜景",
    route: "新神户 → 布引缆车 → 香草园 → 布引瀑布 → 北野 → 美利坚公园",
    note: "推荐缆车上山、徒步下山。雨后山路湿滑时改成缆车往返，下午再去港口和旧居留地。",
    tone: "nature",
  },
  {
    date: "10.01",
    day: "周四",
    city: "奈良",
    stay: "难波 / 心斋桥",
    title: "古寺之后，走进千年原始林",
    route: "东大寺 → 二月堂 → 春日大社 → 春日山原始林 → 奈良町",
    note: "不只停留在奈良公园。体力正常可走 2–3 小时林间短线；想轻松就缩短徒步，把傍晚留给奈良町。",
    tone: "nature",
  },
  {
    date: "10.02",
    day: "周五",
    city: "京都",
    stay: "京都站附近",
    title: "换城入住，沿东山慢慢散步",
    route: "银阁寺 → 哲学之道 → 南禅寺 → 圆山公园 → 八坂神社 → 祇园",
    note: "上午将行李送至京都酒店后再出发。路线以步行为主，晚上适合安排菊乃井本店。",
    tone: "culture",
  },
  {
    date: "10.03",
    day: "周六",
    city: "京都",
    stay: "京都站附近",
    title: "岚山早行，避开周末人潮",
    route: "竹林 → 天龙寺 → 大河内山庄 → 常寂光寺 / 祇王寺 → 嵯峨野",
    note: "7:00 左右抵达竹林。以寺院庭园和嵯峨野小路为主，有余力再加金阁寺，不必硬塞保津川游船。",
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
    tone: "special",
  },
  {
    date: "10.05",
    day: "周一",
    city: "京都北山",
    stay: "京都站附近",
    title: "翻过鞍马山，抵达贵船",
    route: "出町柳 → 鞍马寺 → 木根道 → 贵船神社三社 → 出町柳",
    note: "晴天从鞍马走到贵船约需半天；雨天取消山路，直接由贵船口搭巴士去神社。返程加入出町桝形商店街和鸭川跳石。",
    tone: "nature",
  },
  {
    date: "10.06",
    day: "周二",
    city: "大阪",
    stay: "难波 / 心斋桥",
    title: "回到大阪，城市与购物收尾",
    route: "大阪城公园 → 中之岛 / 梅田 → 日本桥电电城 → 心斋桥",
    note: "上午从京都回大阪，先寄存行李。晚餐可订 La Cime，结束后回难波打包行李。",
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
    body: "购买 9 月 29 日日期指定 Studio Pass，并选择含超级任天堂世界指定入场的 Express Pass。2026 万圣节惊魂夜正在举办。",
    meta: "当天可能早于标示时间开园",
    href: "https://www.usj.co.jp/web/en/us/tickets/express-pass",
    cta: "查看 Express Pass",
  },
];

const restaurants = [
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
];

const practical = [
  ["住宿", "9.28–10.02 大阪难波／心斋桥；10.02–10.06 京都站；10.06 最后一晚回难波。"],
  ["行李", "10 月 1 日请大阪酒店协助把大箱子宅配到京都，去任天堂和烟火当天只带随身包。"],
  ["交通", "关西内部使用 ICOCA 加单独购票即可，一般不需要全国 JR Pass；京都优先坐铁路而不是挤巴士。"],
  ["天气", "9 月末仍可能受台风和阵雨影响。神户、奈良两天可互换；贵船下雨则保留神社、取消翻山。"],
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
            <a href="#route">逐日路线</a>
            <a href="#book">订票</a>
            <a href="#eat">餐厅</a>
          </div>
        </nav>

        <div className="hero-content shell">
          <p className="eyebrow">2026 · 国庆关西旅行手册</p>
          <h1>十日关西，<br />沿山海与烟火前行。</h1>
          <p className="hero-copy">
            从大阪的霓虹出发，穿过神户山海、奈良古林和京都北山，
            把任天堂、贵船、USJ 与一场秋日烟火串成一条舒服的路线。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#route">开始阅读</a>
            <span className="trip-date">09.28 — 10.07</span>
          </div>
        </div>

        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="sun-disc" aria-hidden="true">関西</div>
      </header>

      <section className="overview shell" aria-label="行程概览">
        <article>
          <span>住宿节奏</span>
          <strong>大阪 4晚 · 京都 4晚 · 大阪 1晚</strong>
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
                <p>{item.note}</p>
              </div>
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
            <p className="eyebrow">TWO GOOD MEALS</p>
            <h2>一席京都，<br />一席大阪。</h2>
            <p>如果只选一顿，优先菊乃井；如果吃两顿，再用 La Cime 做旅行收尾。</p>
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
          <h2 id="practical-title">让路线保持松弛的四件事。</h2>
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
          <a href="https://www.kobeherb.com/en/" target="_blank" rel="noreferrer">神户布引香草园 ↗</a>
          <a href="https://www.pref.nara.lg.jp/site/park/2587.html" target="_blank" rel="noreferrer">春日山原始林 ↗</a>
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
