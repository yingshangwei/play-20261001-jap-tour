import type { Metadata } from "next";
import type { CSSProperties } from "react";
import plan from "@/travel-plans/day-1-osaka.plan.geo.json";
import styles from "./page.module.css";

export const dynamic = "force-static";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "play-20261001-jap-tour";
const publicBasePath = process.env.GITHUB_ACTIONS === "true" ? `/${repositoryName}` : "";
const journalArtStyle = {
  "--day-one-journal-art": `url("${publicBasePath}/day-1-journal-collage.png")`,
} as CSSProperties;

export const metadata: Metadata = {
  title: "第一夜，大阪｜关西 2026 Day 1",
  description: "2026 年 9 月 29 日关西机场抵达、难波入住、心斋桥、道顿堀与法善寺横丁的小时级手账行程。",
};

type TimelineItem = {
  t: string;
  what: string;
  kind: "anchor" | "hop" | "meal" | "free";
  note?: string;
  price?: string;
  tag?: string;
  verify?: "verified" | "est";
  link?: string;
};

type Source = {
  title: string;
  url: string;
  as_of: string;
};

const day = plan.days[0] as Omit<typeof plan.days[0], "timeline"> & {
  timeline: TimelineItem[];
};
const sources = plan.sources as Source[];

const mapSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const foodPicks = [
  {
    flag: "首选 · 飞行后友好",
    name: "道顿堀 今井 本店",
    order: "狐狸乌冬 / 亲子丼",
    reason: "热汤、坐下来吃、离道顿堀主线近。当前公示周二营业，价格约 ¥1,000–1,999。",
    caution: "若现场排队超过 30 分钟就切换，不把第一晚耗在队伍里。",
    href: "https://tabelog.com/en/osaka/A2701/A270202/27001289/",
    maps: mapSearch("Dotonbori Imai Honten Osaka"),
  },
  {
    flag: "备选 · 快速大阪味",
    name: "たこ焼道楽 わなか 千日前本店",
    order: "おおいり / 经典章鱼烧",
    reason: "从南海难波步行约 4 分钟，不接受预约，适合看队伍临场决定。",
    caution: "营业时间会调整；当前资料显示多以现金结算，出发前再看官网。",
    href: "https://takoyaki-wanaka.com/",
    maps: mapSearch("Takoyaki Wanaka Sennichimae Osaka"),
  },
  {
    flag: "想吃大阪烧才选",
    name: "味乃家 本店",
    order: "味乃家 MIX / 炒面",
    reason: "1965 年创店，Tabelog 大阪烧百名店；周二当前公示 11:00–22:00。",
    caution: "常见长队。只有等候不超过 30 分钟、体力仍好时再选。",
    href: "https://ajinoya-okonomiyaki.com/en/",
    maps: mapSearch("Ajinoya Honten Osaka"),
  },
];

function itemLabel(item: TimelineItem) {
  if (item.kind === "hop") return "MOVE";
  if (item.kind === "meal") return "EAT";
  if (item.kind === "anchor") return "STOP";
  return "PAUSE";
}

export default function DayOnePage() {
  return (
    <main className={styles.desk}>
      <article className={styles.journal}>
        <header className={styles.cover}>
          <nav className={styles.topbar} aria-label="第一天页面导航">
            <a href="./">← 返回九日总行程</a>
            <span>DAY 01 · 2026.09.29 · TUE</span>
          </nav>

          <div className={styles.coverGrid}>
            <div className={styles.coverCopy}>
              <p className={styles.kicker}>KIX → NAMBA → DOTONBORI</p>
              <h1>第一夜，<br />大阪。</h1>
              <p className={styles.lead}>
                不追一班必须赶上的车，也不把大阪第一印象塞进队伍里。
                落地、放下行李，沿着心斋桥的屋顶慢慢走到霓虹和石板路。
              </p>
              <div className={styles.stats} aria-label="当天关键数据">
                <span><strong>14:00</strong>落地</span>
                <span><strong>21:05</strong>收工</span>
                <span><strong>≈3.4 km</strong>步行</span>
                <span><strong>0</strong>预约项目</span>
              </div>
              <p className={styles.sun}>{day.sun}</p>
            </div>

            <figure className={styles.photoBlock}>
              <div
                className={styles.heroImage}
                role="img"
                aria-label="大阪抵达夜手账拼贴图片位"
                style={journalArtStyle}
              />
              <figcaption>
                图片位：<code>public/day-1-journal-collage.png</code>
              </figcaption>
            </figure>
          </div>

          <div className={styles.routeTape}>
            <span>今日路线</span>
            <strong>{plan.meta.route}</strong>
          </div>
        </header>

        <section className={styles.firstRule} aria-label="最重要的到达日规则">
          <span className={styles.pin}>ARRIVAL RULE</span>
          <p>
            <strong>南海电铁不要预先锁死班次。</strong>
            出关后比较下一班 Rapi:t 与空港急行：前者最快约 34 分钟，后者约 45 分钟。
            谁先走、衔接舒服就坐谁。
          </p>
          <a href="https://www.nankai.co.jp/en_railway/access-timetable" target="_blank" rel="noreferrer">
            打开南海官方时刻表 ↗
          </a>
        </section>

        <section className={styles.schedule} aria-labelledby="schedule-title">
          <div className={styles.sectionIntro}>
            <div>
              <p>HOUR BY HOUR</p>
              <h2 id="schedule-title">落地以后，<br />把节奏放慢。</h2>
            </div>
            <aside>
              <strong>晚点 &gt; 1 小时</strong>
              <span>先删心斋桥购物，再删戎桥河畔停留；保留热饭、法善寺和早睡。</span>
            </aside>
          </div>

          <ol className={styles.timeline}>
            {day.timeline.map((item, index) => (
              <li className={`${styles.timelineItem} ${styles[item.kind]}`} key={`${item.t}-${item.what}`}>
                <div className={styles.timeColumn}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <time>{item.t}</time>
                </div>
                <div className={styles.timelineBody}>
                  <span className={styles.kind}>{itemLabel(item)}</span>
                  <h3>{item.what}</h3>
                  <div className={styles.itemMeta}>
                    {item.price && <span>{item.price}</span>}
                    {item.verify === "est" && <span>时间为估算</span>}
                    {item.tag?.startsWith("swap") && <span>有备选</span>}
                  </div>
                  {item.note && <p>{item.note}</p>}
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noreferrer">打开这一段导航 ↗</a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.foodSection} aria-labelledby="food-title">
          <div className={styles.foodHeading}>
            <p>SEARCHED FOR THIS NIGHT</p>
            <h2 id="food-title">不建偏好库，<br />只给今晚能用的选择。</h2>
            <span>联网资料核对于 2026-09-02；营业时间出发前两天复查。</span>
          </div>
          <div className={styles.foodGrid}>
            {foodPicks.map((pick, index) => (
              <article className={styles.foodCard} key={pick.name}>
                <div className={styles.foodNumber}>{String(index + 1).padStart(2, "0")}</div>
                <span className={styles.foodFlag}>{pick.flag}</span>
                <h3>{pick.name}</h3>
                <strong>{pick.order}</strong>
                <p>{pick.reason}</p>
                <small>{pick.caution}</small>
                <div className={styles.cardLinks}>
                  <a href={pick.href} target="_blank" rel="noreferrer">资料 / 官方 ↗</a>
                  <a href={pick.maps} target="_blank" rel="noreferrer">地图 ↗</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.contingency} aria-labelledby="contingency-title">
          <div>
            <p>PLAN B</p>
            <h2 id="contingency-title">天气和航班，<br />都留了后路。</h2>
          </div>
          <div className={styles.noteStack}>
            <article>
              <span>雨天</span>
              <p>{day.rain_alt}</p>
            </article>
            <article>
              <span>航班晚点</span>
              <p>{day.late_cut}</p>
            </article>
            <article>
              <span>酒店未定</span>
              <p>当前按难波 / 心斋桥住宿区估算。订房后，更新计划 JSON 的酒店坐标并重跑地图链接。</p>
            </article>
          </div>
        </section>

        <section className={styles.mapKit} aria-labelledby="map-title">
          <div>
            <p>POCKET MAP</p>
            <h2 id="map-title">路上只点链接，<br />不用重新搜地名。</h2>
          </div>
          <div className={styles.mapActions}>
            <a href={mapSearch("Kansai International Airport")} target="_blank" rel="noreferrer">01 · 关西机场 ↗</a>
            <a href={mapSearch("Nankai Namba Station")} target="_blank" rel="noreferrer">02 · 南海难波 ↗</a>
            <a href={mapSearch("Shinsaibashi-suji Shopping Street")} target="_blank" rel="noreferrer">03 · 心斋桥筋 ↗</a>
            <a href={mapSearch("Dotonbori Osaka")} target="_blank" rel="noreferrer">04 · 道顿堀 ↗</a>
            <a href={mapSearch("Hozenji Yokocho Osaka")} target="_blank" rel="noreferrer">05 · 法善寺横丁 ↗</a>
            <a href="./downloads/day-1-osaka.kml" download>下载 Day 1 离线 KML ↓</a>
          </div>
          <p className={styles.mapNote}>KML 可导入 Organic Maps；Google Maps 离线区域不支持离线公交换乘。</p>
        </section>

        <section className={styles.sources} aria-labelledby="sources-title">
          <details>
            <summary id="sources-title">核对记录与直接来源</summary>
            <div className={styles.sourceBody}>
              <p>
                9 月 29 日不是日本法定节假日。路线没有售票景点；法善寺横丁店铺营业日各异，
                街巷本身无需预约。所有列车分钟数都按范围表达，精确班次以落地出关后的官方信息为准。
              </p>
              <div>
                {sources.map((source) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                    {source.title}<span>查于 {source.as_of} ↗</span>
                  </a>
                ))}
              </div>
            </div>
          </details>
        </section>

        <footer className={styles.footer}>
          <div>
            <span>DAY 01 / 09.29</span>
            <p>回房补水，整理 USJ 随身包。大阪的第一晚，到这里就够了。</p>
          </div>
          <a href="./">回到九日总行程 ↑</a>
        </footer>
      </article>
    </main>
  );
}
