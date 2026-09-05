import TripMap from "@/app/TripMap";
import JourneyPlayer from "@/app/JourneyPlayer";
import { getGuideRouteModel, getJourneyModel } from "@/app/guide-core/defineGuide";
import { guideCatalog, loadGuide } from "@/guides/registry";
import DayOverview from "./travel/DayOverview";
import travelStyles from "./travel/travel.module.css";
import styles from "./guide-home.module.css";

function TitleLines({ lines }: { lines: string[] }) {
  return lines.map((line, index) => <span key={line}>{line}{index < lines.length - 1 && <br />}</span>);
}

function localPageHref(path: string) {
  if (process.env.GITHUB_ACTIONS !== "true") return path;
  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "play-20261001-jap-tour";
  return `/${repositoryName}${path}.html`;
}

function guideHref(guideId: string) {
  if (process.env.GITHUB_ACTIONS !== "true") return `/guides/${guideId}`;
  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "play-20261001-jap-tour";
  return `/${repositoryName}/guides/${guideId}.html`;
}

export default async function GuideHome({ guideId }: { guideId: string }) {
  const guide = await loadGuide(guideId);
  const routeModel = getGuideRouteModel(guide);
  const assetPrefix = process.env.GITHUB_ACTIONS === "true"
    ? `/${process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "play-20261001-jap-tour"}`
    : "";
  const journeyModel = getJourneyModel(guide, assetPrefix);
  const home = guide.home;
  const configurationGroup = guideCatalog.find((entry) => entry.id === guide.id)?.configuration?.group;
  const configurations = configurationGroup
    ? guideCatalog.filter((entry) => entry.configuration?.group === configurationGroup)
    : [];

  return (
    <main id="top">
      <header className={styles.header}>
        <nav className="nav shell" aria-label={home.navigation.ariaLabel}>
          <a className="brand" href="#top" aria-label={home.navigation.homeAriaLabel}>
            <span className="brand-mark">{home.navigation.brandMark}</span>
            <span>{home.navigation.brand}</span>
          </a>
          <div className="nav-menu">
            {home.navigation.links.filter((link) => link.href !== `#${home.reference.id}`).map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
          </div>
        </nav>

        {configurations.length > 1 && (
          <nav className={`${styles.configurations} shell`} aria-label="行程配置切换">
              {configurations.map((entry) => (
                <a href={guideHref(entry.id)} key={entry.id} aria-current={entry.id === guide.id ? "page" : undefined}>
                  <strong>{entry.configuration?.label}</strong>
                  <small>{entry.configuration?.description}</small>
                </a>
              ))}
          </nav>
        )}

        <div className={`${styles.intro} shell`}>
          <h1>{home.hero.titleLines.join("")}</h1>
          <span className={styles.dates}>{home.hero.dateRange}</span>
        </div>
        <dl className={`${styles.facts} shell`} aria-label={home.overview.ariaLabel}>
          {home.overview.items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
        </dl>
      </header>

      <JourneyPlayer key={guide.id} model={journeyModel} />

      <section className="luggage-plan shell" aria-labelledby="luggage-title">
        <div className="luggage-plan-heading">
          <div>
            <p className="eyebrow dark">{home.luggage.eyebrow}</p>
            <span className="section-note">{home.luggage.note}</span>
          </div>
          <div>
            <h2 id="luggage-title"><TitleLines lines={home.luggage.titleLines} /></h2>
            <p>{home.luggage.description}</p>
          </div>
        </div>
        <div className="luggage-plan-grid">
          {home.luggage.items.map((item) => (
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
            <p className="eyebrow dark">{home.mapSection.eyebrow}</p>
            <span className="section-note">{home.mapSection.note}</span>
          </div>
          <h2 id="map-title"><TitleLines lines={home.mapSection.titleLines} /></h2>
        </div>

        <TripMap key={guide.id} model={routeModel} />
      </section>

      <section className="route shell" id="route">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">{home.itinerary.eyebrow}</p>
            <span className="section-note">{home.itinerary.note}</span>
          </div>
          <h2><TitleLines lines={home.itinerary.titleLines} /></h2>
        </div>
        <div className="timeline">
          {home.itinerary.items.map((item, index) => {
            const journalPath = home.itinerary.journalPaths[item.date];
            return (
            <article className={`timeline-card tone-${item.tone}`} key={item.date}>
              <div className="timeline-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="timeline-date">
                <strong>{item.date}</strong>
                <span>{item.day} · {item.city}</span>
                <em>{home.itinerary.labels.stay} {item.stay}</em>
              </div>
              <div className="timeline-copy">
                <h3>{item.title}</h3>
                <p className="route-line">{item.route}</p>
                <DayOverview day={guide.days[index]} model={routeModel} compact />
                {item.luggage && <p className="transit-line"><span>{home.itinerary.labels.luggage}</span>{item.luggage}</p>}
                <p className="transit-line"><span>{home.itinerary.labels.rhythm}</span>{item.rhythm}</p>
                <details className={travelStyles.fold}>
                <summary>时间安排、交通与取舍</summary>
                <p className="transit-line"><span>{home.itinerary.labels.schedule}</span>{item.schedule}</p>
                <p className="transit-line"><span>{home.itinerary.labels.transit}</span>{item.transit}</p>
                <p>{item.note}</p>
                </details>
                {journalPath && (
                  <a className="day-detail-link" href={localPageHref(journalPath)}>
                    {home.itinerary.labels.journal.replace("{dayNumber}", String(index + 1))} <span>↗</span>
                  </a>
                )}
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <section className="booking shell" id={home.booking.id}>
        <div className="section-heading compact">
          <div>
            <p className="eyebrow dark">{home.booking.eyebrow}</p>
            <span className="section-note">{home.booking.note}</span>
          </div>
          <h2><TitleLines lines={home.booking.titleLines} /></h2>
        </div>
        <div className="booking-grid">
          {home.booking.items.map((card) => (
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
        <details className={styles.supplement} id={home.feature.id}>
          <summary>{home.feature.date} · {home.feature.titleLines.join("")}</summary>
          <div className={styles.supplementBody}>
            <p>{home.feature.description}</p>
            <dl className={styles.featureFacts}>{home.feature.stats.map((stat) => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>
            <a href={home.feature.link.href} target="_blank" rel="noreferrer">{home.feature.link.label} ↗</a>
          </div>
        </details>
      </section>

      <section className="dining" id={home.dining.id}>
        <div className="shell">
          <div className="dining-heading">
            <p className="eyebrow">{home.dining.eyebrow}</p>
            <h2><TitleLines lines={home.dining.titleLines} /></h2>
            <p>{home.dining.description}</p>
          </div>
          <div className="dining-summary" aria-label={home.dining.summaryAriaLabel}>
            {home.dining.summary.map((item) => <span key={item.label}><strong>{item.value}</strong>{item.label}</span>)}
          </div>
          <div className="restaurant-list">
            {home.dining.items.map((restaurant) => (
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
                    <div><dt>{home.dining.labels.when}</dt><dd>{restaurant.when}</dd></div>
                    <div><dt>{home.dining.labels.price}</dt><dd>{restaurant.price}</dd></div>
                    <div><dt>{home.dining.labels.rating}</dt><dd>{restaurant.rating}</dd></div>
                    <div><dt>{home.dining.labels.party}</dt><dd>{restaurant.party}</dd></div>
                    <div className="wide"><dt>{home.dining.labels.reservation}</dt><dd>{restaurant.reservation}</dd></div>
                  </dl>
                  <p className="restaurant-feature"><b>{home.dining.labels.feature}</b>{restaurant.feature}</p>
                  <p className="restaurant-caution"><b>{home.dining.labels.caution}</b>{restaurant.caution}</p>
                  <div className="restaurant-actions">
                    <a href={restaurant.mapHref} target="_blank" rel="noreferrer">{home.dining.labels.map} ↗</a>
                    {restaurant.michelinHref && <a href={restaurant.michelinHref} target="_blank" rel="noreferrer">{home.dining.labels.michelin} ↗</a>}
                    <a href={restaurant.reviewHref} target="_blank" rel="noreferrer">{home.dining.labels.review} ↗</a>
                    <a className="restaurant-book" href={restaurant.bookingHref} target="_blank" rel="noreferrer">{home.dining.labels.booking} ↗</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {(home.detours.items.length > 0 || home.practical.items.length > 0 || home.sources.links.length > 0) && <div className={`${styles.supplements} shell`}>
      {home.detours.items.length > 0 && <details className={styles.supplement}>
        <summary>有余力再选的地点</summary>
        <div className={styles.supplementBody}>
          <p className={styles.candidateNote}>仅供替换或顺路选择，不代表已加入当天行程；不挤占回酒店与休息时间。</p>
          <p>{home.detours.description}</p>
        <div className="detour-list">
          {home.detours.items.map((item) => <article key={item.title}>
            <span>{item.area}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>)}
        </div>
        </div>
      </details>}

      {home.practical.items.length > 0 && <details className={styles.supplement}>
        <summary>行前提醒 · 住宿、行李、交通与天气</summary>
        <div className={styles.supplementBody}>
        <div className="practical-list">
          {home.practical.items.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        </div>
      </details>}

      {home.sources.links.length > 0 && <details className={styles.supplement}>
        <summary>官方来源与出发前复核</summary>
        <div className="source-links">
          {home.sources.links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label} ↗</a>)}
        </div>
      </details>}
      </div>}

      <footer>
        <div className="shell footer-inner">
          <div>
            <span className="brand footer-brand"><span className="brand-mark">{home.footer.brandMark}</span> {home.footer.brand}</span>
            <p>{home.footer.message}</p>
          </div>
          <a href={home.footer.backToTop.href}>{home.footer.backToTop.label}</a>
        </div>
      </footer>
    </main>
  );
}
